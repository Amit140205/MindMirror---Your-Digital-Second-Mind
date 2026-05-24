import StorageWarning from "../components/settings/StorageWarning.jsx"
import ClearHistory from "../components/settings/ClearHistory.jsx"
import IgnoredPatterns from "../components/settings/IgnoredPatterns.jsx"

export default function SettingsPage({ isVisible }) {
    if (!isVisible) return null

    return (
        <div
            style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                backgroundColor: "var(--bg-primary)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            {/* Header */}
            <div>
                <h2 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                }}>
                    Settings
                </h2>
                <p style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "2px"
                }}>
                    Manage your data and privacy preferences
                </p>
            </div>

            <StorageWarning />
            <ClearHistory />
            <IgnoredPatterns />
        </div>
    )
}