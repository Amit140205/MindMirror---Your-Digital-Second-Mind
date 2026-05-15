import json
from langchain_core.tools import tool
from bson import ObjectId
 
from utils.database import get_db
from utils.encryption import decrypt
 
# No module-level DB client
# get_db() is called inside the tool at call time.
# By the time any request hits, lifespan has already run connect_db(),
# so get_db() always returns the initialized motor db object.

@tool
async def search_browsing_history(
    user_id: str,
    query: str = None,
    domain: str = None,
    date: str = None,
    limit: int = 10
) -> str:
    """
    Search user's browsing history from MongoDB.
    Use this tool when user asks about their browsing activity.
 
    Args:
        user_id: The user's MongoDB ObjectId string (required)
        query:   keyword to search in title or extractedText (optional)
        domain:  specific domain to filter e.g. 'youtube.com' (optional)
        date:    date string to filter by e.g. '1/5/2026' (optional)
        limit:   max number of sessions to return (default 10)
 
    Returns:
        JSON string of matching sessions with decrypted fields
    """
    try:
        db = get_db()
 
        mongo_filter = { "user": ObjectId(user_id) }
 
        # Plain field filters — run directly in MongoDB
        # domain is stored plain so regex works without decryption
        # openedAt is stored plain so date filter works without decryption
        if domain:
            mongo_filter["domain"] = { "$regex": domain, "$options": "i" }
 
        if date:
            mongo_filter["openedAt"] = { "$regex": date, "$options": "i" }
 
        # Fetch from MongoDB
        # When query keyword present, fetch more to compensate for
        # post-decryption filtering (title/extractedText are encrypted)
        fetch_limit = limit * 3 if query else limit
 
        cursor = db.sessions \
            .find(mongo_filter) \
            .sort("openedAt", -1) \
            .limit(fetch_limit)
 
        sessions = await cursor.to_list(length=fetch_limit)
 
        if not sessions:
            return json.dumps({ "message": "No sessions found matching your query" })
 
        # Decrypt encrypted fields
        # url, title, extractedText are encrypted — decrypt after fetch
        # domain, openedAt, closedAt, timeSpent, timeZone are plain
        decrypted_sessions = []
        for session in sessions:
            try:
                decrypted_sessions.append({
                    "url":           decrypt(session.get("url",           ""), user_id),
                    "title":         decrypt(session.get("title",         ""), user_id),
                    "domain":        session.get("domain",   ""),
                    "extractedText": decrypt(session.get("extractedText", ""), user_id),
                    "openedAt":      session.get("openedAt",  ""),
                    "closedAt":      session.get("closedAt",  ""),
                    "timeSpent":     session.get("timeSpent", 0),
                    "timezone":      session.get("timeZone",  ""),
                })
            except Exception as e:
                print(f"Failed to process session: {e}")
                continue
 
        # Post-decryption keyword filter 
        # title and extractedText were encrypted so MongoDB could not filter them
        # filter in Python after decryption
        results = decrypted_sessions
 
        if query:
            query_lower = query.lower()
            results = [
                s for s in results
                if query_lower in s["title"].lower()
                or query_lower in s["url"].lower()
                or query_lower in s["extractedText"].lower()
            ]
 
        # Apply final limit after post-decryption filter
        results = results[:limit]
 
        if not results:
            return json.dumps({ "message": "No sessions found matching your query" })
 
        return json.dumps(results, ensure_ascii=False)
 
    except Exception as e:
        return json.dumps({ "error": str(e) })