import { sessionModel } from "../models/session.model.js";
import { encrypt } from "../utils/encryption.js";

export const saveSessions = async (req, res) => {
  try {
    const { sessions } = req.body;
    const userId = req.user._id;
    const userIdStr = userId.toString();

    if (!sessions || sessions.length === 0) {
      return res.status(400).json({ message: "No sessions provided" });
    }

    const sessionsWithUser = sessions.map((session) => ({
      user: userId,

      // Encrypted fields
      // MongoDB stores ciphertext — raw values never touch the DB
      url: encrypt(session.url || "", userIdStr),
      title: encrypt(session.title || "", userIdStr),
      extractedText: encrypt(session.extractedText || "", userIdStr),

      // Plain fields
      // Kept plain so MongoDB can query/sort directly without decryption
      // domain  → needed for direct regex queries ("which youtube sessions?")
      // openedAt → needed for date range queries ("what did I browse yesterday?")
      domain: session.domain || "",
      timeSpent: session.timeSpent,
      openedAt: session.openedAt,
      closedAt: session.closedAt,
      timeZone: session.timeZone,
    }));

    const savedSessions = await sessionModel.insertMany(sessionsWithUser);

    return res.status(201).json({
      message: `${savedSessions.length} sessions saved successfully`,
      count: savedSessions.length,
    });
  } catch (error) {
    console.log("Error in saveSessions controller:", error);
    return res.status(500).json({ message: `saveSessions error ${error}` });
  }
};
