import os
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.database import get_db
from bson import ObjectId

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )
        
        user_id = payload.get("userId")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # fetch user from MongoDB
        db = get_db()
        user = await db.users.find_one({ "_id": ObjectId(user_id) })
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return {
            "user_id": str(user["_id"]),
            "user_name": user["userName"]
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")