from flask import Blueprint, request, jsonify
from db import users_col
from auth_utils import make_token
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/register')
def register():
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'employee')
    department = data.get('department', 'General')

    if not name or not email or not password:
        return jsonify({'detail': 'All fields are required'}), 400
    if users_col.find_one({'email': email}):
        return jsonify({'detail': 'Email already registered'}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    result = users_col.insert_one({
        'name': name, 'email': email, 'password': hashed,
        'role': role, 'department': department
    })
    token = make_token(str(result.inserted_id), role, name)
    return jsonify({'token': token, 'name': name, 'role': role, 'department': department}), 201

@auth_bp.post('/login')
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = users_col.find_one({'email': email})
    if not user:
        return jsonify({'detail': 'No account found with this email'}), 401
    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'detail': 'Incorrect password'}), 401

    token = make_token(str(user['_id']), user['role'], user['name'])
    return jsonify({'token': token, 'name': user['name'], 'role': user['role'], 'department': user.get('department', 'General')}), 200
