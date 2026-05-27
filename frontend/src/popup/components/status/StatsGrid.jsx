function StatCard({ label, value, sub }) {
  return (
    <div style={{
      padding: "12px",
      borderRadius: "10px",
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
    }}>
      <p style={{
        fontSize: "10px",
        color: "var(--text-disabled)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        margin: "0 0 6px",
      }}>
        {label}
      </p>
      <p style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: 0,
        lineHeight: 1,
      }}>
        {value}
      </p>
      <p style={{ fontSize: "10px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
        {sub}
      </p>
    </div>
  )
}

export default function StatsGrid({ queuedCount, ignoredCount }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
      <StatCard
        label="Queued"
        value={queuedCount}
        sub="sessions pending sync"
      />
      <StatCard
        label="Blocked"
        value={ignoredCount}
        sub={ignoredCount === 1 ? "domain ignored" : "domains ignored"}
      />
    </div>
  )
}