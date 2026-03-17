import os, jwt, datetime
from functools import wraps
from flask import request, jsonify

SECRET = os.getenv('JWT_SECRET', 'taskflow_secret_2025')

def make_token(user_id: str, role: str, name: str) -> str:
    payload = {
        'user_id': user_id,
        'role': role,
        'name': name,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET, algorithm='HS256')

def decode_token():
    auth = request.headers.get('Authorization', '')
    token = auth.replace('Bearer ', '').strip()
    if not token:
        return None, 'Token missing'
    try:
        return jwt.decode(token, SECRET, algorithms=['HS256']), None
    except Exception:
        return None, 'Invalid token'

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user, err = decode_token()
        if err:
            return jsonify({'detail': err}), 401
        return f(*args, user=user, **kwargs)
    return decorated

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user, err = decode_token()
        if err:
            return jsonify({'detail': err}), 401
        if user.get('role') != 'admin':
            return jsonify({'detail': 'Admin access required'}), 403
        return f(*args, user=user, **kwargs)
    return decorated
