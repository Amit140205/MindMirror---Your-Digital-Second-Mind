import { useState, useEffect } from "react"
import { HiXMark, HiPlus } from "react-icons/hi2"
import { MdBlock } from "react-icons/md"

function validateDomain(input, existingPatterns) {
    let cleaned = input
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/^www\./, "")

    if (!cleaned)
        return { valid: false, cleaned: null, warning: null }

    if (!cleaned.includes("."))
        return { valid: false, cleaned: null, warning: `Did you mean "${cleaned}.com"? Domain must contain a dot.` }

    if (!/^[a-z0-9.\-]+$/.test(cleaned))
        return { valid: false, cleaned: null, warning: "Invalid domain — only letters, numbers, dots and hyphens allowed." }

    if (existingPatterns.includes(cleaned))
        return { valid: false, cleaned: null, warning: `"${cleaned}" is already in your list.` }

    return { valid: true, cleaned, warning: null }
}

export default function IgnoredPatterns() {
    const [patterns, setPatterns] = useState([])
    const [input, setInput] = useState("")
    const [warning, setWarning] = useState("")

    useEffect(() => {
        chrome.storage.local.get("ignoredPatterns").then(result => {
            setPatterns(result.ignoredPatterns || [])
        })
    }, [])

    const handleAdd = async () => {
        const { valid, cleaned, warning } = validateDomain(input, patterns)
        if (!valid) {
            setWarning(warning || "")
            return
        }
        const updated = [...patterns, cleaned]
        setPatterns(updated)
        await chrome.storage.local.set({ ignoredPatterns: updated })
        setInput("")
        setWarning("")
    }

    const handleRemove = async (pattern) => {
        const updated = patterns.filter(p => p !== pattern)
        setPatterns(updated)
        await chrome.storage.local.set({ ignoredPatterns: updated })
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd()
    }

    const handleInputChange = (e) => {
        setInput(e.target.value)
        if (warning) setWarning("")
    }

    return (
        <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
        }}>
            {/* Header */}
            <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "38px", height: "38px",
                        borderRadius: "10px",
                        background: "rgba(255, 107, 107, 0.1)",
                        border: "1px solid rgba(255, 107, 107, 0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <MdBlock size={18} style={{ color: "var(--accent-secondary)" }} />
                    </div>
                    <div>
                        <p style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: "2px"
                        }}>
                            Ignored Domains
                        </p>
                        <p style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                        }}>
                            Sessions from these sites will never be captured
                        </p>
                    </div>
                </div>

                {/* Count badge */}
                {patterns.length > 0 && (
                    <div style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: "rgba(255, 107, 107, 0.1)",
                        border: "1px solid rgba(255, 107, 107, 0.25)",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--accent-secondary)",
                        flexShrink: 0,
                    }}>
                        {patterns.length} blocked
                    </div>
                )}
            </div>

            {/* Input section */}
            <div style={{
                padding: "24px 32px",
                borderBottom: patterns.length > 0 ? "1px solid var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "0 12px",
                        borderRadius: "10px",
                        border: `1px solid ${warning ? "rgba(255,107,107,0.5)" : "var(--border)"}`,
                        background: "var(--bg-elevated)",
                        transition: "border 0.2s ease",
                    }}
                        onFocus={() => {}}
                    >
                        <MdBlock size={14} style={{ color: warning ? "var(--accent-secondary)" : "var(--text-disabled)", flexShrink: 0 }} />
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. youtube.com or mail.google.com"
                            style={{
                                flex: 1,
                                padding: "9px 0",
                                border: "none",
                                background: "transparent",
                                color: "var(--text-primary)",
                                fontSize: "13px",
                                fontFamily: "Inter, sans-serif",
                                outline: "none",
                            }}
                        />
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={!input.trim()}
                        style={{
                            padding: "9px 16px",
                            borderRadius: "10px",
                            border: "none",
                            background: !input.trim() ? "var(--border)" : "var(--primary)",
                            color: !input.trim() ? "var(--text-disabled)" : "#fff",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: !input.trim() ? "not-allowed" : "pointer",
                            fontFamily: "Inter, sans-serif",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                        onMouseEnter={e => {
                            if (input.trim()) e.currentTarget.style.background = "var(--primary-hover)"
                        }}
                        onMouseLeave={e => {
                            if (input.trim()) e.currentTarget.style.background = "var(--primary)"
                        }}
                    >
                        <HiPlus size={13} />
                        Add
                    </button>
                </div>

                {/* Warning */}
                {warning && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        background: "rgba(255, 107, 107, 0.08)",
                        border: "1px solid rgba(255, 107, 107, 0.2)",
                    }}>
                        <span style={{ fontSize: "11px" }}>⚠️</span>
                        <p style={{
                            fontSize: "11px",
                            color: "var(--accent-secondary)",
                        }}>
                            {warning}
                        </p>
                    </div>
                )}
            </div>

            {/* Pattern List */}
            {patterns.length === 0 ? (
                <div style={{
                    padding: "20px 32px 24px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                }}>
                    <div style={{
                        width: "40px", height: "40px",
                        borderRadius: "50%",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: "4px",
                    }}>
                        <MdBlock size={18} style={{ color: "var(--text-disabled)" }} />
                    </div>
                    <p style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                    }}>
                        No domains blocked yet
                    </p>
                    <p style={{
                        fontSize: "11px",
                        color: "var(--text-disabled)",
                        textAlign: "center",
                        lineHeight: "1.6",
                    }}>
                        Your browsing is fully tracked. Add domains above to prevent them from being captured.
                    </p>
                </div>
            ) : (
                <div style={{
                    padding: "8px 16px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                }}>
                    {patterns.map((pattern, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                background: "rgba(255, 107, 107, 0.05)",
                                border: "1px solid rgba(255, 107, 107, 0.15)",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)"
                                e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.3)"
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(255, 107, 107, 0.05)"
                                e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.15)"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}>
                                <MdBlock size={13} style={{ color: "var(--accent-secondary)", flexShrink: 0, opacity: 0.7 }} />
                                <span style={{
                                    fontSize: "13px",
                                    color: "var(--text-primary)",
                                    fontFamily: "monospace",
                                }}>
                                    {pattern}
                                </span>
                            </div>

                            <button
                                onClick={() => handleRemove(pattern)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--text-disabled)",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "3px",
                                    borderRadius: "4px",
                                    transition: "all 0.15s ease",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = "var(--accent-secondary)"
                                    e.currentTarget.style.background = "rgba(255,107,107,0.1)"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = "var(--text-disabled)"
                                    e.currentTarget.style.background = "transparent"
                                }}
                            >
                                <HiXMark size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}