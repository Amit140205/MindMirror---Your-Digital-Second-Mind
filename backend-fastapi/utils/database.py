import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

client = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DB_NAME", "MindMirror")]
    print(f"Connected to MongoDB: {os.getenv('DB_NAME', 'MindMirror')}")

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_db():
    return db