import {
    PieChart, Pie, Cell,
    Tooltip, Legend, ResponsiveContainer
} from "recharts"
import ChartCard from "./ChartCard.jsx"
import { COLORS, tooltipStyle, renderPieLabel } from "./ChartConfig.jsx"

export default function DomainBreakdown({ data }) {
    if (!data || data.length === 0) return null

    return (
        <ChartCard title="Domain Breakdown" height={220}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="minutes"
                        nameKey="domain"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={renderPieLabel}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v, n) => [`${v} min`, n]}
                    />
                    <Legend
                        formatter={value => value.replace("www.", "").slice(0, 16)}
                        wrapperStyle={{ fontSize: "11px", color: "#8888AA" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}