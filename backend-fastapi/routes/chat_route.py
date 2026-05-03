from fastapi import APIRouter, Depends
from controllers.chat_controller import handle_chat
from middlewares.isAuth import verify_token
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    timezone: str

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(verify_token) # runs first
):
    return await handle_chat(request, current_user)