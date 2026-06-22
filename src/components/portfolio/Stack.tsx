import { useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const groups = [
  { title: "Frontend",      items: ["React", "TypeScript", "Vite", "Tailwind", "shadcn/ui"] },
  { title: "Backend",       items: ["Node.js", "Express", "Bun", "PostgreSQL", "Supabase", "Prisma", "Zod"] },
  { title: "Infra & Tooling", items: ["Docker", "Linux", "Git", "Neovim", "JWT", "WebSocket"] },
];

export function Stack() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Tronco principal desenha de cima pra baixo
      gsap.fromTo(".stack-trunk",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#stack",
            start: "top 65%",
            end: "center 30%",
            scrub: 1.8,
          },
        }
      );

      // Linhas horizontais dos branches desenham da esquerda
      gsap.fromTo(".stack-branch-h",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          stagger: 0.22,
          ease: "none",
          scrollTrigger: {
            trigger: "#stack",
            start: "top 58%",
            end: "center 22%",
            scrub: 2,
          },
        }
      );

      // Cada row da árvore entra da esquerda
      gsap.fromTo(".stack-tree-row",
        { opacity: 0, x: -28 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.22,
          ease: "none",
          scrollTrigger: {
            trigger: "#stack",
            start: "top 58%",
            end: "center 22%",
            scrub: 2,
          },
        }
      );
    }, "#stack");
    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" style={{ padding: "96px 48px", maxWidth: "1160px", margin: "0 auto" }}>
      <motion.p
        className="font-mono"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--c-p)", marginBottom: "14px" }}
      >
        Stack
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        style={{
          fontSize: "clamp(2.4rem,4.5vw,3.8rem)",
          fontWeight: 800,
          letterSpacing: "-.035em",
          lineHeight: 1.02,
          marginBottom: "60px",
          fontFamily: "Space Grotesk, sans-serif",
          color: "var(--c-fg)",
        }}
      >
        Ferramentas que eu <em style={{ fontStyle: "italic" }}>domino</em>.
      </motion.h2>

      {/* Árvore */}
      <div className="stack-grid" style={{ display: "flex", alignItems: "stretch" }}>

        {/* Tronco vertical */}
        <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, width: "1px", marginRight: "0" }}>
          <div
            className="stack-trunk"
            style={{
              width: "1px",
              flex: 1,
              minHeight: "200px",
              background: "linear-gradient(to bottom, var(--c-p) 0%, var(--c-ps) 80%, transparent 100%)",
            }}
          />
        </div>

        {/* Grupos */}
        <div style={{ flex: 1, paddingLeft: "40px" }}>
          {groups.map((g, gi) => (
            <div
              key={g.title}
              className="stack-tree-row"
              style={{
                position: "relative",
                marginBottom: gi < groups.length - 1 ? "44px" : 0,
                opacity: 0,
              }}
            >
              {/* Branch: segmento vertical descendente */}
              <div style={{
                position: "absolute",
                left: "-40px",
                top: 0,
                width: "1px",
                height: "24px",
                background: "var(--c-p)",
                opacity: 0.45,
              }} />

              {/* Branch: segmento horizontal */}
              <div
                className="stack-branch-h"
                style={{
                  position: "absolute",
                  left: "-40px",
                  top: "24px",
                  width: "40px",
                  height: "1px",
                  background: "var(--c-p)",
                  opacity: 0.45,
                }}
              />

              {/* Header da categoria */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingTop: "16px" }}>
                <span style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: "var(--c-p)",
                  opacity: 0.55,
                  letterSpacing: ".1em",
                  userSelect: "none",
                }}>
                  {`0${gi + 1}`}
                </span>
                <div style={{ height: "1px", width: "18px", background: "var(--c-p)", opacity: 0.25, flexShrink: 0 }} />
                <h3 style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "var(--c-fg)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  margin: 0,
                }}>
                  {g.title}
                </h3>
              </div>

              {/* Box de tecnologias */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  padding: "18px 20px",
                  border: "1px solid var(--c-b)",
                  borderRadius: "14px",
                  background: "var(--c-s)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  transition: "border-color .2s, background .2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--c-ps)";
                  el.style.background = "var(--c-sh)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--c-b)";
                  el.style.background = "var(--c-s)";
                }}
              >
                {g.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "5px 13px",
                      background: "var(--c-s)",
                      border: "1px solid var(--c-b)",
                      borderRadius: "100px",
                      fontSize: "12px",
                      color: "var(--c-muted)",
                      fontFamily: "JetBrains Mono, monospace",
                      cursor: "default",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--c-pb)";
                      e.currentTarget.style.color = "var(--c-p)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--c-b)";
                      e.currentTarget.style.color = "var(--c-muted)";
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
