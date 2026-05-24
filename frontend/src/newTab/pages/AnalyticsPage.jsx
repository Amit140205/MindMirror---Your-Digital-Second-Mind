import { useState, useEffect, useCallback } from "react";
import { MdRefresh } from "react-icons/md";
import { analyticsAPI } from "../../shared/api/api.js";
import OverviewCard from "../components/analytics/OverviewCard.jsx";
import SessionsPerDay from "../components/analytics/SessionsPerDay.jsx";
import TopDomains from "../components/analytics/TopDomains.jsx";
import PeakHours from "../components/analytics/PeakHours.jsx";
import DomainBreakdown from "../components/analytics/DomainBreakdown.jsx";

const FILTERS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: "12px",
        minHeight: "300px",
      }}
    >
      <div style={{ fontSize: "40px" }}>📊</div>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        No data for this period
      </p>
      <p style={{ color: "var(--text-disabled)", fontSize: "12px" }}>
        Browse some websites and come back
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: "120px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

export default function AnalyticsPage({ isVisible }) {
  const [filter, setFilter] = useState("month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ignoredPatterns, setIgnoredPatterns] = useState([]);

  const fetchAnalytics = useCallback(async (selectedFilter) => {
    setLoading(true);
    setError(null);
    try {
      const result = await chrome.storage.local.get("token");
      const token = result.token;
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await analyticsAPI(token, selectedFilter);
      setData(response);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch when tab becomes visible or filter changes
  useEffect(() => {
    if (isVisible) fetchAnalytics(filter);
  }, [isVisible, filter, fetchAnalytics]);

  useEffect(() => {
    chrome.storage.local.get("ignoredPatterns").then((result) => {
      setIgnoredPatterns(result.ignoredPatterns || []);
    });
  }, []);

  const hasData = data && data.overview.totalSessions > 0;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Analytics
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "2px",
            }}
          >
            Your browsing insights
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(filter)}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-surface)",
            color: loading ? "var(--text-disabled)" : "var(--text-secondary)",
            fontSize: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.borderColor = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <MdRefresh
            size={14}
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: filter === f.id ? "var(--primary)" : "var(--border)",
              background:
                filter === f.id ? "var(--primary-glow)" : "transparent",
              color:
                filter === f.id ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: filter === f.id ? 600 : 400,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "16px",
            background: "#FF6B6B11",
            border: "1px solid #FF6B6B44",
            borderRadius: "10px",
            color: "var(--accent-secondary)",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSkeleton />}

      {/* Empty */}
      {!loading && !error && data && !hasData && <EmptyState />}

      {/* Charts */}
      {!loading && !error && hasData && (
        <>
          <OverviewCard overview={data.overview} />
          <SessionsPerDay data={data.sessionsPerDay} />
          <TopDomains
            byTime={data.topDomainsByTime}
            byVisits={data.topDomainsByVisits}
            ignoredPatterns={ignoredPatterns}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <PeakHours data={data.peakHours} />
            <DomainBreakdown data={data.domainBreakdown} ignoredPatterns={ignoredPatterns}/>
          </div>
        </>
      )}

      <div style={{ height: "24px" }} />
    </div>
  );
}
