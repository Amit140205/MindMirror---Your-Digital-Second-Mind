import mongoose from "mongoose";
import { sessionModel } from "../models/session.model.js";

function getDateRange(filter, timeZone = "UTC") {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayStr = formatter.format(new Date());
  const end = `${todayStr}T23:59:59`; // always end of today

  switch (filter) {
    case "today":
      return { start: `${todayStr}T00:00:00`, end };
    case "week": {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return { start: `${formatter.format(d)}T00:00:00`, end };
    }
    case "month":
      return { start: `${todayStr.slice(0, 7)}-01T00:00:00`, end };
    case "year":
      return { start: `${todayStr.slice(0, 4)}-01-01T00:00:00`, end };
    default:
      return { start: `${todayStr.slice(0, 7)}-01T00:00:00`, end };
  }
}

// Analytics Controller

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const filter = req.query.filter || "month";
    const timeZone = req.query.timeZone || "UTC";
    const { start: startPrefix, end: endPrefix } = getDateRange(
      filter,
      timeZone,
    );

    // Base match — user + date range
    // openedAt stored as "2026-05-18T10:30:00", string comparison works
    const baseMatch = {
      user: new mongoose.Types.ObjectId(userId),
      openedAt: { $gte: startPrefix, $lte: endPrefix },
    };

    // Run all aggregations in parallel
    const [
      overallStats,
      topDomainsByTime,
      topDomainsByVisits,
      sessionsPerDay,
      peakHours,
      domainBreakdown,
    ] = await Promise.all([
      // 1. Overall stats — total sessions + total time
      sessionModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalTimeMs: { $sum: "$timeSpent" },
          },
        },
      ]),

      // 2. Top 5 domains by total time spent
      sessionModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$domain",
            totalTimeMs: { $sum: "$timeSpent" },
          },
        },
        { $sort: { totalTimeMs: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            domain: "$_id",
            totalTimeMs: 1,
            // convert ms to minutes for display
            minutes: { $round: [{ $divide: ["$totalTimeMs", 60000] }, 1] },
          },
        },
      ]),

      // 3. Top 5 domains by visit count
      sessionModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$domain",
            visits: { $sum: 1 },
          },
        },
        { $sort: { visits: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            domain: "$_id",
            visits: 1,
          },
        },
      ]),

      // 4. Sessions per day
      // openedAt is "2026-05-18T10:30:00" — extract date portion (first 10 chars)
      sessionModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: { $substr: ["$openedAt", 0, 10] }, // "2026-05-18"
            sessions: { $sum: 1 },
            totalTimeMs: { $sum: "$timeSpent" },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            sessions: 1,
            minutes: { $round: [{ $divide: ["$totalTimeMs", 60000] }, 1] },
          },
        },
      ]),

      // 5. Peak browsing hours
      // openedAt is "2026-05-18T10:30:00" — extract hour (chars 11-12)
      sessionModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: { $toInt: { $substr: ["$openedAt", 11, 2] } }, // 0-23
            sessions: { $sum: 1 },
            totalTimeMs: { $sum: "$timeSpent" },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            hour: "$_id",
            sessions: 1,
            minutes: { $round: [{ $divide: ["$totalTimeMs", 60000] }, 1] },
          },
        },
      ]),

      // 6. Domain breakdown — all domains with time for pie chart
      sessionModel.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$domain",
            totalTimeMs: { $sum: "$timeSpent" },
            visits: { $sum: 1 },
          },
        },
        { $sort: { totalTimeMs: -1 } },
        { $limit: 8 }, // top 8 for pie chart readability
        {
          $project: {
            _id: 0,
            domain: "$_id",
            minutes: { $round: [{ $divide: ["$totalTimeMs", 60000] }, 1] },
            visits: 1,
          },
        },
      ]),
    ]);

    // Format overall stats
    const stats = overallStats[0] || { totalSessions: 0, totalTimeMs: 0 };
    const totalMs = stats.totalTimeMs || 0;
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    return res.status(200).json({
      filter,
      overview: {
        totalSessions: stats.totalSessions || 0,
        totalTime: totalMs,
        totalTimeHuman: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      },
      topDomainsByTime,
      topDomainsByVisits,
      sessionsPerDay,
      peakHours,
      domainBreakdown,
    });
  } catch (error) {
    console.log("Error in getAnalytics controller:", error);
    return res.status(500).json({ message: `getAnalytics error ${error}` });
  }
};
