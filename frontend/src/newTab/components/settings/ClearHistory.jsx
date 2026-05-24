import { useState } from "react"
import { deleteSessionsAPI } from "../../../shared/api/api.js"
import toast from "react-hot-toast"

export default function ClearHistory() {
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await chrome.storage.local.get("token")
            const token = result.token

            if (!token) {
                toast.error("Authentication error. Please login again.")
                return
            }

            await deleteSessionsAPI(token)

            // clear local queue too
            await chrome.storage.local.set({ sessionQueue: [] })

            toast.success("All browsing history deleted successfully.")
            setConfirming(false)

        } catch (error) {
            console.error("Delete sessions error:", error)
            toast.error("Failed to delete history. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
        }}>
            {/* Header */}
            <div>
                <p style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px"
                }}>
                    Clear Browsing History
                </p>
                <p style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.6"
                }}>
                    Permanently delete all captured sessions from the database.
                    This action cannot be undone.
                </p>
            </div>

            {/* Confirmation step */}
            {!confirming ? (
                <button
                    onClick={() => setConfirming(true)}
                    style={{
                        alignSelf: "flex-start",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid #FF6B6B44",
                        background: "#FF6B6B11",
                        color: "var(--accent-secondary)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "#FF6B6B22"
                        e.currentTarget.style.borderColor = "#FF6B6B88"
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "#FF6B6B11"
                        e.currentTarget.style.borderColor = "#FF6B6B44"
                    }}
                >
                    Delete All History
                </button>
            ) : (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "14px",
                    background: "#FF6B6B0D",
                    border: "1px solid #FF6B6B33",
                    borderRadius: "8px",
                }}>
                    <p style={{
                        fontSize: "12px",
                        color: "var(--accent-secondary)",
                        fontWeight: 600
                    }}>
                        Are you sure? This will permanently delete all your sessions.
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            style={{
                                padding: "7px 16px",
                                borderRadius: "8px",
                                border: "none",
                                background: loading ? "var(--border)" : "#FF6B6B",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "Inter, sans-serif",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {loading ? "Deleting..." : "Yes, Delete All"}
                        </button>
                        <button
                            onClick={() => setConfirming(false)}
                            disabled={loading}
                            style={{
                                padding: "7px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--text-secondary)",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}