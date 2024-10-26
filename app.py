from flask import Flask, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import Student, User, Admin, Teacher
from routes.student import student_bp
from routes.auth import auth_bp
from flask_mail import Mail
from routes.reset_password import reset_password_bp
from sqlalchemy import inspect
from extensions import db, bcrypt, mail
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{username}:{password}@localhost/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config ['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config ['SECURITY_PASSWORD_SALT'] = os.getenv('SECURITY_PASSWORD_SALT')

db.init_app(app)
bcrypt.init_app(app)
mail.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(student_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(reset_password_bp)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/show_tables')
def show_tables():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    return f"Tables in the database: {tables}"

@app.route('/show_columns/<table_name>')
def show_columns(table_name):
    inspector = inspect(db.engine)
    columns = inspector.get_columns(table_name)
    column_info = {column['name']: column['type'] for column in columns}
    return f'Columns in {table_name}: {column_info}'

with app.app_context():
    db.create_all()

for rule in app.url_map.iter_rules():
    print(rule)


if __name__ == "__main__":
    app.run(debug=True)