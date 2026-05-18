import { sessionModel } from "../models/session.model.js";

// Date Range Helper
// openedAt is stored as local ISO string "2026-05-18T10:30:00"
// We build prefix strings to match with $gte / $lte on string comparison
// ISO strings sort lexicographically correctly so string comparison works

function getDateRange(filter) {
  const now = new Date();

  // We work with YYYY-MM-DD prefix strings
  // ISO string comparison works correctly for date filtering
  // "2026-05-18T..." >= "2026-05-18T00:00:00" is correct

  let startPrefix;

  switch (filter) {
    case "today": {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      startPrefix = `${y}-${m}-${d}T00:00:00`;
      break;
    }
    case "week": {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      const y = weekAgo.getFullYear();
      const m = String(weekAgo.getMonth() + 1).padStart(2, "0");
      const d = String(weekAgo.getDate()).padStart(2, "0");
      startPrefix = `${y}-${m}-${d}T00:00:00`;
      break;
    }
    case "month": {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      startPrefix = `${y}-${m}-01T00:00:00`;
      break;
    }
    case "year": {
      const y = now.getFullYear();
      startPrefix = `${y}-01-01T00:00:00`;
      break;
    }
    default: {
      // fallback to this month
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      startPrefix = `${y}-${m}-01T00:00:00`;
    }
  }

  return startPrefix;
}

// Analytics Controller

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const filter = req.query.filter || "month"; // today | week | month | year

    const startPrefix = getDateRange(filter);

    // Base match — user + date range
    // openedAt stored as "2026-05-18T10:30:00", string comparison works
    const baseMatch = {
      user: userId,
      openedAt: { $gte: startPrefix },
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
