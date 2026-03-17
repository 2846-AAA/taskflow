from flask import jsonify
from db import users_col, tasks_col, leaves_col
from auth_utils import require_admin
from flask import Blueprint

admin_bp = Blueprint('admin', __name__)

@admin_bp.get('/employees')
@require_admin
def get_employees(user):
    emps = list(users_col.find({'role': 'employee'}, {'password': 0}))
    for e in emps:
        e['_id'] = str(e['_id'])
        e['task_count'] = tasks_col.count_documents({'assigned_to': e['_id']})
        e['completed_tasks'] = tasks_col.count_documents({'assigned_to': e['_id'], 'status': 'completed'})
        e['pending_leaves'] = leaves_col.count_documents({'employee_id': e['_id'], 'status': 'pending'})
    return jsonify(emps)

@admin_bp.get('/dashboard')
@require_admin
def dashboard(user):
    total = tasks_col.count_documents({})
    completed = tasks_col.count_documents({'status': 'completed'})
    return jsonify({
        'total_employees': users_col.count_documents({'role': 'employee'}),
        'total_tasks': total,
        'pending_tasks': tasks_col.count_documents({'status': 'pending'}),
        'inprogress_tasks': tasks_col.count_documents({'status': 'in_progress'}),
        'completed_tasks': completed,
        'pending_leaves': leaves_col.count_documents({'status': 'pending'}),
        'approved_leaves': leaves_col.count_documents({'status': 'approved'}),
        'completion_rate': round(completed / total * 100, 1) if total > 0 else 0
    })
