from flask import Blueprint, request, jsonify, url_for, current_app
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from models import Student
from extensions import bcrypt, db, mail

reset_password_bp = Blueprint('reset_password_bp', __name__)

def generate_reset_token(email):
    s= URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return s.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])

@reset_password_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user =Student.query.filter_by(email=email).first()

    if user:
        token = generate_reset_token(user.email)

        reset_link = url_for('reset_password_bp.reset_password', token=token, _external=True)
        msg = Message('Password Reset Request', sender='noreply@yourapp.com', recipients=[user.email])
        msg.body = f'Click the link to reset your password: {reset_link}'
        mail.send(msg)

        return jsonify({'message': 'Password reset link sent to your email'}), 200
    else:
        return jsonify({'error': 'Email not found.'}), 404
    
@reset_password_bp.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    try:
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        email = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'], max_age=3600)
    except:
        return jsonify({'error': 'The reset link is invalid or has expired.'}), 400
    
    data = request.get_json()
    new_password = data.get('newPassword')

    user = Student.query.filter_by(email=email).firsst()

    if user:
        user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({'message': 'Password has been updated.'}), 200
    else:
        return jsonify({'error': 'User not found.'}), 404
        
