from langchain_core.messages import HumanMessage
from graph.graph_builder import get_workflow
import json

async def handle_chat(request, current_user: dict):
    workflow = get_workflow()
    
    config = {
        "configurable": {
            "thread_id": current_user["user_id"]
        }
    }
    
    result = await workflow.ainvoke({
        "user_id": current_user["user_id"],
        "user_name": current_user["user_name"],
        "timezone": request.timezone,
        "query": request.message,
        "prompt": "",
        "messages": [HumanMessage(content=request.message)]
    }, config=config)
    
    last_message = result["messages"][-1]

    response_data = json.loads(last_message.content)
    
    return response_data