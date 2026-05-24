import json
from langchain_core.tools import tool
from bson import ObjectId

from utils.database import get_db
from utils.encryption import decrypt

@tool
async def search_browsing_history(
    user_id: str,
    query: str = None,
    domain: str = None,
    date: str = None,
    limit: int = 10,
) -> str:
    """
    Search user's browsing history from MongoDB.
    Use this tool when user asks about their browsing activity.

    Args:
        user_id: The user's MongoDB ObjectId string (required)
        query: keyword to search in title or extractedText (optional)
        domain: specific domain to filter e.g. 'youtube.com' (optional)
        date: ISO date string to filter by e.g. '2026-05-18' (optional)
        limit: max number of sessions to return (default 10)

    Returns:
        JSON string of matching sessions with decrypted fields
    """
    try:
        db = get_db()

        mongo_filter = { "user": ObjectId(user_id) }

        if domain:
            mongo_filter["domain"] = { "$regex": domain, "$options": "i" }

        if date:
            mongo_filter["openedAt"] = { "$regex": date, "$options": "i" }

        fetch_limit = limit * 3 if query else limit

        cursor = db.sessions \
            .find(mongo_filter) \
            .sort("openedAt", -1) \
            .limit(fetch_limit)

        sessions = await cursor.to_list(length=fetch_limit)

        if not sessions:
            return json.dumps({ "message": "No sessions found matching your query" })

        # Decrypt encrypted fields and parse extractedText
        # url, title, extractedText are encrypted — decrypt after fetch
        # domain, openedAt, closedAt, timeSpent, timeZone are plain
        decrypted_sessions = []
        for session in sessions:
            try:
                # parse extractedText from JSON string → dict
                # so LLM receives { initial: "...", updates: [...] }
                # instead of a raw escaped JSON string
                raw_extracted = decrypt(session.get("extractedText", ""), user_id)
                try:
                    extracted = json.loads(raw_extracted)
                    # handle legacy format — old sessions stored plain string or "[]"
                    if not isinstance(extracted, dict) or "initial" not in extracted:
                        extracted = { "initial": raw_extracted, "updates": [] }
                except Exception:
                    extracted = { "initial": raw_extracted, "updates": [] }

                decrypted_sessions.append({
                    "url":           decrypt(session.get("url", ""), user_id),
                    "title":         decrypt(session.get("title", ""), user_id),
                    "domain":        session.get("domain", ""),
                    "extractedText": extracted,   # dict not string
                    "openedAt":      session.get("openedAt", ""),
                    "closedAt":      session.get("closedAt", ""),
                    "timeSpent":     session.get("timeSpent", 0),
                    "timezone":      session.get("timeZone", ""),
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
            filtered = []
            for s in results:
                et = s["extractedText"]
                extracted_str = (
                    et.get("initial", "") + " " +
                    " ".join(et.get("updates", []))
                ).lower()

                if (
                    query_lower in s["title"].lower()
                    or query_lower in s["url"].lower()
                    or query_lower in extracted_str
                ):
                    filtered.append(s)

            results = filtered

        # Apply final limit after post-decryption filter
        results = results[:limit]

        if not results:
            return json.dumps({ "message": "No sessions found matching your query" })

        return json.dumps(results, ensure_ascii=False)

    except Exception as e:
        return json.dumps({ "error": str(e) })