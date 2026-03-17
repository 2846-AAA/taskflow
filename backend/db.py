import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "")
client = MongoClient(MONGO_URI)
db = client["taskflow2"]

users_col = db["users"]
tasks_col = db["tasks"]
leaves_col = db["leaves"]
