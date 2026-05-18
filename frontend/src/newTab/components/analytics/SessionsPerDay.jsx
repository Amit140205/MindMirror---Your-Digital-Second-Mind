import {
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import ChartCard from "./ChartCard.jsx"
import { tooltipStyle } from "./ChartConfig.jsx"

export default function SessionsPerDay({ data }) {
    if (!data || data.length === 0) return null

    return (
        <ChartCard title="Sessions Per Day" height={220}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#8888AA", fontSize: 10 }}
                        tickFormatter={d => d.slice(5)}  // "2026-05-18" → "05-18"
                    />
                    <YAxis tick={{ fill: "#8888AA", fontSize: 10 }} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v) => [v, "Sessions"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke="#6C63FF"
                        strokeWidth={2}
                        dot={{ fill: "#6C63FF", r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}