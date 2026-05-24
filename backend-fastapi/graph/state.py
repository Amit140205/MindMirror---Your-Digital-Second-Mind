from typing import TypedDict, Annotated, List
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class ChatState(TypedDict):
    user_id: str
    user_name: str
    timeZone: str
    query: str
    prompt: str
    ignoredPatterns: list[str]
    is_ignored: bool
    messages: Annotated[List[BaseMessage], add_messages]