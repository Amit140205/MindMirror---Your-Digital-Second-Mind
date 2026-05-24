import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard.jsx";
import { COLORS, tooltipStyle, renderPieLabel } from "./ChartConfig.jsx";

function isIgnored(domain, ignoredPatterns) {
  return ignoredPatterns.some((p) => domain.includes(p.replace("www.", "")));
}

export default function DomainBreakdown({ data, ignoredPatterns = [] }) {
  if (!data || data.length === 0) return null;

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
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  isIgnored(entry.domain, ignoredPatterns)
                    ? "#44445A"
                    : COLORS[i % COLORS.length]
                }
                opacity={isIgnored(entry.domain, ignoredPatterns) ? 0.5 : 1}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: "#EEEEF5" }}
            labelStyle={{ color: "#8888AA" }}
            formatter={(v, n) => [
              `${v} min`,
              isIgnored(n, ignoredPatterns) ? `${n} (not tracked)` : n,
            ]}
          />
          <Legend
            formatter={(value) => {
              const clean = value.replace("www.", "").slice(0, 16);
              return isIgnored(value, ignoredPatterns) ? `⬛ ${clean}` : clean;
            }}
            wrapperStyle={{ fontSize: "11px", color: "#8888AA" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {data.some((entry) => isIgnored(entry.domain, ignoredPatterns)) && (
        <p
          style={{
            fontSize: "10px",
            color: "var(--text-disabled)",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          ⬛ Greyed domains were tracked before you disabled tracking for them
        </p>
      )}
    </ChartCard>
  );
}
