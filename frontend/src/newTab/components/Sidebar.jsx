import { BsChatLeftTextFill } from "react-icons/bs";
import { MdBarChart } from "react-icons/md";

export default function Sidebar({
  activeView,
  onViewChange,
  isTutorialOpen,
  tutorialSlide,
}) {
  const navItems = [
    {
      id: "chat",
      label: "Chat",
      icon: (
        <BsChatLeftTextFill size={16} style={{ color: "var(--primary)" }} />
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <MdBarChart size={18} style={{ color: "var(--accent)" }} />,
    },
  ];

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        flexShrink: 0,
      }}
    >
      <h3
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--text-disabled)",
          marginBottom: "10px",
          paddingLeft: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Navigation
      </h3>

      {navItems.map((item) => {
        const isActive = activeView === item.id;
        const isHighlighted =
          isTutorialOpen && tutorialSlide === 3 && item.id === "analytics";

        return (
          <div
            key={item.id}
            className={isHighlighted ? "tutorial-highlight" : ""}
            onClick={() => onViewChange(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
              borderLeft: isActive
                ? "2px solid var(--primary)"
                : "2px solid transparent",
              transition: "all 0.2s ease",
              fontSize: "13px",
              fontWeight: isActive ? 600 : 500,
              marginBottom: "2px",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
                e.currentTarget.style.color = "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
