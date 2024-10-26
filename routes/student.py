from flask import Blueprint, jsonify, request
from models import Student
from flask_jwt_extended import jwt_required
from extensions import db

student_bp = Blueprint('student_bp', __name__)

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

@student_bp.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{'id': student.id, 'name': student.name, 'age': student.age, 'email': student.email} for student in students]), 200


@student_bp.route('/students/<int:id>', methods=['GET'])
def get_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify({'id': student.id, 'name': student.name, 'age': student.age, 'email': student.email}), 200



@student_bp.route('/add_student', methods=['POST'])
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
        student_bp.logger.error(f'Error adding student: {e}')
        return jsonify({'error': 'An error occured while adding the student.'}), 500
    

@student_bp.route('/update_student/<int:id>', methods=['PUT'])
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
    

@student_bp.route('/delete_student/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted successfully!'})