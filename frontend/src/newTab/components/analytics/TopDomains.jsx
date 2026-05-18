import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"
import ChartCard from "./ChartCard.jsx"
import { COLORS, tooltipStyle } from "./ChartConfig.jsx"

function DomainBarChart({ title, data, dataKey, tooltipLabel }) {
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
                        formatter={(v) => [v, tooltipLabel]}
                    />
                    <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}

export default function TopDomains({ byTime, byVisits }) {
    if ((!byTime || byTime.length === 0) && (!byVisits || byVisits.length === 0)) return null

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <DomainBarChart
                title="Top Domains by Time (min)"
                data={byTime}
                dataKey="minutes"
                tooltipLabel="Minutes"
            />
            <DomainBarChart
                title="Top Domains by Visits"
                data={byVisits}
                dataKey="visits"
                tooltipLabel="Visits"
            />
        </div>
    )
}