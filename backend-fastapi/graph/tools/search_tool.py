import os
import json
from langchain_core.tools import tool
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URL"))
db     = client["MindMirror"]

@tool
def search_browsing_history(
    user_id: str,
    query:   str = None,
    domain:  str = None,
    date:    str = None,
    limit:   int = 10
) -> str:
    """
    Search user's browsing history from MongoDB.
    Use this tool when user asks about their browsing activity.

    Args:
        user_id: The user's MongoDB ObjectId string (required)
        query: keyword to search in title and extractedText (optional)
        domain: specific domain to filter e.g. 'youtube.com' (optional)
        date: date string to filter by e.g. '1/5/2026' (optional)
        limit: max number of sessions to return (default 10)

    Returns:
        JSON string of matching sessions
    """
    try:
        filter = { "user": ObjectId(user_id) }

        if domain:
            filter["domain"] = { "$regex": domain, "$options": "i" }

        if date:
            filter["openedAt"] = { "$regex": date, "$options": "i" }

        if query:
            filter["$or"] = [
                { "title":         { "$regex": query, "$options": "i" } },
                { "extractedText": { "$regex": query, "$options": "i" } }
            ]

        sessions = list(
            db.sessions
            .find(filter)
            .sort("openedAt", -1)
            .limit(limit)
        )

        if not sessions:
            return json.dumps({ "message": "No sessions found matching your query" })

        results = []
        for session in sessions:
            results.append({
                "url": session.get("url", ""),
                "title": session.get("title", ""),
                "domain": session.get("domain", ""),
                "openedAt": session.get("openedAt", ""),
                "closedAt": session.get("closedAt", ""),
                "timeSpent": session.get("timeSpent", 0),
                "timezone": session.get("timeZone", ""),
                "extractedText": session.get("extractedText", "")
            })

        return json.dumps(results, ensure_ascii=False)

    except Exception as e:
        return json.dumps({ "error": str(e) })