# ⚡ TaskFlow — Employee Task & Leave Management Portal

![TaskFlow](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

> A full-stack enterprise HR portal with **Role-Based Access Control (RBAC)** — Admins assign tasks and manage leave requests, Employees track their work and apply for leave in real-time.

## 🌐 Live Demo

| | Link |
|---|---|
| 🚀 **Live App** | [taskflow-six-psi.vercel.app](https://taskflow-six-psi.vercel.app) |
| ⚙️ **Backend API** | [taskflow-ovxg.onrender.com](https://taskflow-ovxg.onrender.com) |
| 💻 **GitHub** | [github.com/2846-AAA/taskflow](https://github.com/2846-AAA/taskflow) |

### 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@taskflow.com | Admin@123 |
| Employee | emp@taskflow.com | Emp@123 |

---

## ✨ Features

### 👑 Admin
- 📊 Analytics dashboard with task completion rates
- ✅ Assign tasks to employees with priority levels and due dates
- 📋 Approve or reject leave requests with remarks
- 👥 View all employees with task and leave stats
- 📈 MongoDB aggregation-powered reports

### 👤 Employee
- 🗂️ View assigned tasks and update status (Pending → In Progress → Completed)
- 📝 Apply for Sick / Casual / Earned leave
- 📊 Personal progress dashboard with completion tracking
- 🔔 See leave approval/rejection status with remarks

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Hooks, React Router, Recharts, HTML5, CSS3 |
| **Backend** | Python, Flask, REST APIs, JWT Authentication |
| **Database** | MongoDB Atlas, PyMongo, Aggregation Pipelines |
| **Auth** | JWT + Role-Based Access Control (RBAC) |
| **Deployment** | Vercel (Frontend) + Render (Backend) |
| **Version Control** | Git, GitHub |

---

## 🏗️ Project Architecture

```
taskflow/
├── backend/                  # Flask REST API
│   ├── main.py               # App entry point + CORS
│   ├── db.py                 # MongoDB connection (PyMongo)
│   ├── auth_utils.py         # JWT + RBAC decorators
│   └── routes/
│       ├── auth.py           # Register / Login endpoints
│       ├── tasks.py          # Task CRUD + aggregation stats
│       ├── leaves.py         # Leave apply + admin actions
│       └── admin.py          # Admin dashboard + employee list
│
└── frontend/                 # React Application
    └── src/
        ├── App.jsx            # Protected routing by role
        ├── api.js             # Axios instance + JWT interceptor
        ├── components/
        │   ├── Sidebar.jsx    # Collapsible role-aware sidebar
        │   └── UI.jsx         # Reusable components (Badge, Modal, Toast)
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── AdminDashboard.jsx
            └── EmployeeDashboard.jsx
```

---

## 🔐 How RBAC Works

```python
# auth_utils.py — Admin-only route protection
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
```

Routes decorated with `@require_admin` are completely inaccessible to employees — enforced at the API level.

---

## 📊 MongoDB Aggregation Example

```python
# Task completion stats
pipeline = [
    {"$group": {
        "_id": "$status",
        "count": {"$sum": 1}
    }}
]
result = list(tasks_col.aggregate(pipeline))
```

---

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/2846-AAA/taskflow.git
cd taskflow

# 2. Backend setup
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# 3. Add your MongoDB URI to backend/.env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

# 4. Run backend
python main.py

# 5. Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — Register as Admin first, then as Employee!

---

## 🌍 Deployment

| Service | Platform | Config |
|---|---|---|
| Frontend | Vercel | Root: `frontend`, Framework: Vite |
| Backend | Render | Root: `backend`, Start: `python main.py` |

---

## 👩‍💻 Developer

**Anuja Dhamdhere** — Python Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](www.linkedin.com/in/anuja-dhamdhere-90795a2b8)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/2846-AAA)
