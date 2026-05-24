import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import ChartCard from "./ChartCard.jsx"
import { tooltipStyle } from "./ChartConfig.jsx"

export default function PeakHours({ data }) {
    if (!data || data.length === 0) return null

    return (
        <ChartCard title="Peak Browsing Hours" height={220}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" />
                    <XAxis
                        dataKey="hour"
                        tick={{ fill: "#8888AA", fontSize: 10 }}
                        tickFormatter={h => `${h}:00`}
                    />
                    <YAxis tick={{ fill: "#8888AA", fontSize: 10 }} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: "#EEEEF5" }}
                        labelStyle={{ color: "#8888AA" }}
                        formatter={(v, n) => [v, n === "sessions" ? "Sessions" : "Minutes"]}
                        labelFormatter={h => `${h}:00 - ${h}:59`}
                    />
                    <Bar dataKey="sessions" fill="#00D4AA" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}