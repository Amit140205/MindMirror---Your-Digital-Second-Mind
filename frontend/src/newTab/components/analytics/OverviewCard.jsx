import StatCard from "./StatCard.jsx"
 
export default function OverviewCard({ overview }) {
    return (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <StatCard
                label="Total Sessions"
                value={overview.totalSessions.toLocaleString()}
                sub="completed browsing sessions"
            />
            <StatCard
                label="Total Time"
                value={overview.totalTimeHuman}
                sub="across all sessions"
            />
        </div>
    )
}