import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"
import ChartCard from "./ChartCard.jsx"
import { COLORS, tooltipStyle } from "./ChartConfig.jsx"

function isIgnored(domain, ignoredPatterns) {
    return ignoredPatterns.some(p => domain.includes(p.replace("www.", "")))
}

function DomainBarChart({ title, data, dataKey, tooltipLabel, ignoredPatterns = [] }) {
    if (!data || data.length === 0) return null

    return (
        <ChartCard title={title} height={220}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#8888AA", fontSize: 10 }} />
                    <YAxis
                        type="category"
                        dataKey="domain"
                        tick={{ fill: "#8888AA", fontSize: 10 }}
                        width={90}
                        tickFormatter={d => d.replace("www.", "").slice(0, 14)}
                    />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: "#EEEEF5" }}
                        labelStyle={{ color: "#8888AA" }}
                        formatter={(v, n, props) => {
                            const domain = props.payload?.domain || ""
                            const ignored = isIgnored(domain, ignoredPatterns)
                            return [v, ignored ? `${tooltipLabel} (not tracked)` : tooltipLabel]
                        }}
                    />
                    <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
                        {data.map((entry, i) => (
                            <Cell
                                key={i}
                                fill={isIgnored(entry.domain, ignoredPatterns) ? "#44445A" : COLORS[i % COLORS.length]}
                                opacity={isIgnored(entry.domain, ignoredPatterns) ? 0.5 : 1}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* legend note if any ignored domain present */}
            {data.some(entry => isIgnored(entry.domain, ignoredPatterns)) && (
                <p style={{
                    fontSize: "10px",
                    color: "var(--text-disabled)",
                    marginTop: "8px",
                    textAlign: "center"
                }}>
                    ⬛ Greyed domains were tracked before you disabled tracking for them
                </p>
            )}
        </ChartCard>
    )
}

export default function TopDomains({ byTime, byVisits, ignoredPatterns = [] }) {
    if ((!byTime || byTime.length === 0) && (!byVisits || byVisits.length === 0)) return null

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <DomainBarChart
                title="Top Domains by Time (min)"
                data={byTime}
                dataKey="minutes"
                tooltipLabel="Minutes"
                ignoredPatterns={ignoredPatterns}
            />
            <DomainBarChart
                title="Top Domains by Visits"
                data={byVisits}
                dataKey="visits"
                tooltipLabel="Visits"
                ignoredPatterns={ignoredPatterns}
            />
        </div>
    )
}