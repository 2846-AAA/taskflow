from flask import Blueprint, request, jsonify
from db import tasks_col
from auth_utils import require_auth, require_admin
from bson import ObjectId
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

def fmt(t):
    t['_id'] = str(t['_id'])
    return t

@tasks_bp.get('/')
@require_auth
def get_tasks(user):
    if user['role'] == 'admin':
        tasks = list(tasks_col.find().sort('created_at', -1))
    else:
        tasks = list(tasks_col.find({'assigned_to': user['user_id']}).sort('created_at', -1))
    return jsonify([fmt(t) for t in tasks])

@tasks_bp.post('/')
@require_admin
def create_task(user):
    data = request.get_json()
    doc = {
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'assigned_to': data.get('assigned_to', ''),
        'assigned_name': data.get('assigned_name', ''),
        'priority': data.get('priority', 'medium'),
        'due_date': data.get('due_date', ''),
        'department': data.get('department', 'General'),
        'status': 'pending',
        'created_by': user['user_id'],
        'created_at': datetime.utcnow().isoformat()
    }
    result = tasks_col.insert_one(doc)
    doc['_id'] = str(result.inserted_id)
    return jsonify(doc), 201

@tasks_bp.patch('/<tid>')
@require_auth
def update_status(tid, user):
    data = request.get_json()
    tasks_col.update_one(
        {'_id': ObjectId(tid)},
        {'$set': {'status': data.get('status'), 'updated_at': datetime.utcnow().isoformat()}}
    )
    return jsonify({'message': 'Updated'})

@tasks_bp.delete('/<tid>')
@require_admin
def delete_task(tid, user):
    tasks_col.delete_one({'_id': ObjectId(tid)})
    return jsonify({'message': 'Deleted'})

@tasks_bp.get('/stats/summary')
@require_admin
def task_stats(user):
    pipeline = [{'$group': {'_id': '$status', 'count': {'$sum': 1}}}]
    result = list(tasks_col.aggregate(pipeline))
    total = tasks_col.count_documents({})
    stats = {'pending': 0, 'in_progress': 0, 'completed': 0, 'total': total}
    for r in result:
        if r['_id'] in stats:
            stats[r['_id']] = r['count']
    stats['completion_rate'] = round(stats['completed'] / total * 100, 1) if total > 0 else 0
    return jsonify(stats)
