from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import text
from models import db, Student
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

migrate = Migrate(app, db)

load_dotenv()
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{username}:{password}@localhost/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def validate_student_data(data):
    name = data.get('name')
    email = data.get('email')
    age = data.get('age')

    if not name:
        return 'Name is required.'
    if not email or '@' not in email:
        return 'Invalid email address.'
    if age is None:
        return 'Age is required.'
    if isinstance(age, str) and not age.isdigit():
        return 'Invalid age. It must be a positive integer.'
    age = int(age)
    if age <= 0:
        return 'Invalid age. It must be a positive integer.'
    return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    age = data.get('age')

    error = validate_student_data(data)
    if error:
        return jsonify({'error': error}), 400

    try:
        if age is not None:
            age = int(age)
        new_student = Student(name=name, age=age, email=email)
        db.session.add(new_student)
        db.session.commit()
        return jsonify({'message': 'Student added successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error adding student: {e}')
        return jsonify({'error': 'An error occured while adding the student.'}), 500
    
@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{'id': student.id, 'name': student.name, 'age': student.age, 'email': student.email} for student in students]), 200

@app.route('/students/<int:id>', methods=['GET'])
def get_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify({'id': student.id, 'name': student.name, 'age': student.age, 'email': student.email}), 200

@app.route('/update_student/<int:student_id>', methods=['PUT'])
def update_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': f'Student with id {id} not found'}), 404
    
    data = request.get_json()
    print((f'Received data for update: {data}'))
    if 'name' not in data or 'age' not in data or 'email' not in data:
        return jsonify({'error': 'Missing fields'}), 400
    
    student.name = data['name']
    student.age = data['age']
    student.email = data['email']
    db.session.commit()
    return jsonify({'message': 'Student updated successfully!'}), 200

@app.route('/delete_student/<int:id>', methods=['DELETE'])
def delete_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted successfully!'})


# def create_database():
#     with app.app_context():
#         db.create_all()
#         print("Database tables created.")

# @app.route('/test-db-connection')
# def test_db_connection():
#     try:
#         db.session.execute(text("SELECT 1"))
#         return "Database connection is successful!"
#     except Exception as e:
#         return f"Database connection failed: {e}"

for rule in app.url_map.iter_rules():
    print(rule)


if __name__ == "__main__":
    # create_database()
    app.run(debug=True)