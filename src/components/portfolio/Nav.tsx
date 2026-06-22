import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const items = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stack", href: "#stack" },
  { label: "Projetos", href: "#projetos" },
];

export function Nav() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));

    const onScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > window.innerHeight * 0.6);
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <header
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "-110px"})`,
        width: "min(calc(100% - 32px), 920px)",
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",
      }}
    >
      <nav
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderRadius: "14px",
          border: "1px solid var(--c-b)",
          background: "var(--c-ov)",
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
          overflow: "hidden",
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Scroll progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "1.5px",
            width: `${progress}%`,
            background: "linear-gradient(to right, #7c3aed, #c4b5fd)",
            transition: "width 0.1s linear",
          }}
        />

        <a
          href="#"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "-.02em",
            color: "var(--c-fg)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "color 0.35s ease",
          }}
        >
          <span style={{
            width: "24px", height: "24px", borderRadius: "6px",
            background: "var(--c-p)", display: "inline-flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: 800, color: "#fff",
            fontFamily: "Space Grotesk, sans-serif", flexShrink: 0,
          }}>GF</span>
          Guilherme Ferrarezi
        </a>

        <ul style={{ display: "flex", gap: "28px", listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((it) => (
            <li key={it.href} className="hidden md:block">
              <a
                href={it.href}
                style={{
                  fontSize: "13.5px",
                  color: "var(--c-muted)",
                  textDecoration: "none",
                  transition: "color .15s",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-muted)")}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isLight ? "Modo escuro" : "Modo claro"}
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "1px solid var(--c-b)",
              background: "var(--c-s)",
              color: "var(--c-muted)",
              cursor: "pointer",
              transition: "all .15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--c-bh)";
              el.style.color = "var(--c-fg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--c-b)";
              el.style.color = "var(--c-muted)";
            }}
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <a
            href="#contato"
            style={{
              padding: "7px 16px",
              background: "var(--c-p)",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = ".82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Contato
          </a>
        </div>
      </nav>
    </header>
  );
}
