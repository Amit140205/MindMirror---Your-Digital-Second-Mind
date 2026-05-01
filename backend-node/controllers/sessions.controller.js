import { sessionModel } from "../models/session.model.js";

export const saveSessions = async (req, res) => {
  try {
    const { sessions } = req.body;
    const userId = req.user._id;

    if (!sessions || sessions.length === 0) {
      return res.status(400).json({ message: "No sessions provided" });
    }

    // adding userId to each sessions
    const sessionsWithUser = sessions.map((session) => ({
      user: userId,
      url: session.url,
      title: session.title || "",
      domain: session.domain || "",
      timeSpent: session.timeSpent,
      openedAt: session.openedAt,
      closedAt: session.closedAt,
      timeZone: session.timezone,
      extractedText: session.extractedText || "",
    }));

    const savedSessions = await sessionModel.insertMany(sessionsWithUser)

    return res.status(201).json({
        message: `${savedSessions.length} sessions saved successfully`,
        count: savedSessions.length
    })
  } catch (error) {
    console.log("Error in saveSessions controller:", error);
    return res.status(500).json({ message: `saveSessions error ${error}` });
  }
};
