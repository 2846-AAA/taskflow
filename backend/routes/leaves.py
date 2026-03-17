from flask import Blueprint, request, jsonify
from db import leaves_col
from auth_utils import require_auth, require_admin
from bson import ObjectId
from datetime import datetime

leaves_bp = Blueprint('leaves', __name__)

def fmt(l):
    l['_id'] = str(l['_id'])
    return l

@leaves_bp.get('/')
@require_auth
def get_leaves(user):
    if user['role'] == 'admin':
        leaves = list(leaves_col.find().sort('applied_at', -1))
    else:
        leaves = list(leaves_col.find({'employee_id': user['user_id']}).sort('applied_at', -1))
    return jsonify([fmt(l) for l in leaves])

@leaves_bp.post('/')
@require_auth
def apply_leave(user):
    data = request.get_json()
    doc = {
        'leave_type': data.get('leave_type', 'sick'),
        'from_date': data.get('from_date', ''),
        'to_date': data.get('to_date', ''),
        'reason': data.get('reason', ''),
        'days': data.get('days', 1),
        'employee_id': user['user_id'],
        'employee_name': user['name'],
        'status': 'pending',
        'remarks': '',
        'applied_at': datetime.utcnow().isoformat()
    }
    result = leaves_col.insert_one(doc)
    doc['_id'] = str(result.inserted_id)
    return jsonify(doc), 201

@leaves_bp.patch('/<lid>')
@require_admin
def action_leave(lid, user):
    data = request.get_json()
    leaves_col.update_one(
        {'_id': ObjectId(lid)},
        {'$set': {
            'status': data.get('status'),
            'remarks': data.get('remarks', ''),
            'actioned_by': user['name'],
            'actioned_at': datetime.utcnow().isoformat()
        }}
    )
    return jsonify({'message': f"Leave {data.get('status')}"})
