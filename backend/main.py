from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.leaves import leaves_bp
from routes.admin import admin_bp

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(leaves_bp, url_prefix='/api/leaves')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

@app.get('/')
def root():
    return {'status': 'TaskFlow API is running', 'version': '2.0.0'}

if __name__ == '__main__':
    port = int(os.environ.get("PORT",10000))
    app.run(host="0.0.0.0", port=port)
