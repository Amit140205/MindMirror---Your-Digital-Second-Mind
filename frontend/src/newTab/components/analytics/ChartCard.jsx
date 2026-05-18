export default function ChartCard({ title, height = 220, children }) {
    return (
        <div style={{
            background:   "var(--bg-surface)",
            border:       "1px solid var(--border)",
            borderRadius: "12px",
            padding:      "20px 20px 12px",
        }}>
            <p style={{
                fontSize:      "12px",
                fontWeight:    600,
                color:         "var(--text-secondary)",
                marginBottom:  "16px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
            }}>
                {title}
            </p>
            <div style={{ height }}>
                {children}
            </div>
        </div>
    )
}