const ITEMS = [
  "React", "TypeScript", "Node.js", "PostgreSQL", "Docker",
  "Linux", "Hyprland", "Neovim", "Bun", "Prisma", "JWT", "WebSocket",
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--c-b)",
        borderBottom: "1px solid var(--c-b)",
        transition: "border-color 0.35s ease",
      }}
    >
      <div className="animate-marquee" style={{ display: "flex", width: "max-content" }}>
        {doubled.map((w, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "13px 32px 13px 0",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "13px",
              color: "var(--c-dim)",
              whiteSpace: "nowrap",
              transition: "color 0.35s ease",
            }}
          >
            <strong style={{ color: "var(--c-mid)", fontWeight: 500 }}>{w}</strong>
            <span style={{ color: "var(--c-p)", fontSize: "9px" }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
