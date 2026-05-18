export default function StatCard({ label, value, sub }) {
    return (
        <div style={{
            background:   "var(--bg-surface)",
            border:       "1px solid var(--border)",
            borderRadius: "12px",
            padding:      "20px 24px",
            flex:         1,
            minWidth:     "140px",
        }}>
            <p style={{
                fontSize:      "11px",
                color:         "var(--text-disabled)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom:  "8px"
            }}>
                {label}
            </p>
            <p style={{
                fontSize:   "28px",
                fontWeight: 700,
                color:      "var(--text-primary)",
                lineHeight: 1
            }}>
                {value}
            </p>
            {sub && (
                <p style={{
                    fontSize:  "11px",
                    color:     "var(--text-secondary)",
                    marginTop: "6px"
                }}>
                    {sub}
                </p>
            )}
        </div>
    )
}