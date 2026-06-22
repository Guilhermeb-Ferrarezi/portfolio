const COL_A = [
  "Fullstack Developer",
  "Go · TypeScript",
  "APIs & Microserviços",
  "PostgreSQL · Redis",
  "Docker · Linux",
  "Performance First",
  "Código que dura",
  "Design + Backend",
];

const COL_B = [
  "Disponível para projetos",
  "React · Next.js",
  "Infra · DevOps",
  "Sistemas reais",
  "WebSockets · gRPC",
  "Ribeirão Preto · SP",
  "4+ anos de mercado",
  "30+ projetos entregues",
];

const COL_C = [
  "Clean Architecture",
  "Prisma · Drizzle",
  "CI/CD · GitHub Actions",
  "Segurança & Auth",
  "Automações",
  "Integrações",
  "UX que converte",
  "Escalável por design",
];

function Column({
  items,
  direction,
  duration,
}: {
  items: string[];
  direction: "up" | "down";
  duration: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        flex: 1,
        borderRight: "1px solid var(--c-b)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          animation: `${direction === "up" ? "scroll-up" : "scroll-down"} ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              writingMode: "vertical-lr",
              textOrientation: "mixed",
              transform: direction === "up" ? "rotate(180deg)" : "none",
              padding: "32px 20px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: i % 3 === 0 ? "var(--c-p)" : "var(--c-muted)",
              whiteSpace: "nowrap",
              opacity: i % 5 === 0 ? 0.4 : 0.7,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfiniteScroll() {
  return (
    <div
      style={{
        height: "380px",
        display: "flex",
        borderTop: "1px solid var(--c-b)",
        borderBottom: "1px solid var(--c-b)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* fade nas bordas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, var(--c-bg) 0%, transparent 18%, transparent 82%, var(--c-bg) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <Column items={COL_A} direction="up"   duration={18} />
      <Column items={COL_B} direction="down" duration={22} />
      <Column items={COL_C} direction="up"   duration={15} />
    </div>
  );
}
