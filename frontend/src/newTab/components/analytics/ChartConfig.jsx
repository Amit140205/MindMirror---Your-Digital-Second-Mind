// Shared color palette for all charts
export const COLORS = [
  "#6C63FF",
  "#00D4AA",
  "#FF6B6B",
  "#FFB347",
  "#4ECDC4",
  "#A78BFA",
  "#F472B6",
  "#34D399",
];

// Recharts tooltip style matching app dark theme
export const tooltipStyle = {
  backgroundColor: "#1C1C28",
  border: "1px solid #2A2A3D",
  borderRadius: "8px",
  color: "#EEEEF5",
  fontSize: "12px",
  fontFamily: "Inter, sans-serif",
};

// Pie chart inner label — shows percentage, hides slices under 5%
export const renderPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#EEEEF5"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
