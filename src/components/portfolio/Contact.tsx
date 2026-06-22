import { useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TITLE: { text: string; purple?: boolean; italic?: boolean }[] = [
  { text: "Vamos" },
  { text: "tirar" },
  { text: "sua" },
  { text: "ideia", purple: true, italic: true },
  { text: "do" },
  { text: "papel?" },
];

const links = [
  {
    label: "WhatsApp · (16) 99612-9511",
    href: "https://wa.me/5516996129511",
    primary: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411z" />
      </svg>
    ),
  },
  {
    label: "guilherme@guilhermebf.dev",
    href: "mailto:guilherme@guilhermebf.dev",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Guilhermeb-Ferrarezi",
    href: "https://github.com/Guilhermeb-Ferrarezi",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "@guilherme38_38",
    href: "https://instagram.com/guilherme38_38",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export function Contact() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-word",
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: "#contato",
            start: "top 55%",
            end: "center 20%",
            scrub: 1.8,
          },
        }
      );
      gsap.fromTo(
        ".contact-link",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact-links-grid",
            start: "top 80%",
            end: "top 35%",
            scrub: 1.4,
          },
        }
      );
    }, "#contato");
    return () => ctx.revert();
  }, []);

  return (
    <section id="contato" style={{ padding: "96px 48px 0", maxWidth: "1160px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--c-p)", marginBottom: "14px" }}
        >
          Contato
        </motion.p>

        <h2
          style={{
            fontSize: "clamp(2.8rem,5.5vw,4.6rem)",
            fontWeight: 800,
            letterSpacing: "-.04em",
            lineHeight: 1.05,
            marginBottom: "16px",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          {TITLE.map((w, i) => (
            <span
              key={i}
              className="contact-word"
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                opacity: 0.1,
                color: w.purple ? "var(--c-p)" : "var(--c-fg)",
                fontStyle: w.italic ? "italic" : "normal",
              }}
            >
              {w.text}
            </span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: "15.5px", color: "var(--c-muted)", marginBottom: "44px", lineHeight: 1.65 }}
        >
          Tenho disponibilidade pra novos projetos, parcerias e oportunidades.
          Manda uma mensagem — respondo rapidinho.
        </motion.p>

        <div
          className="contact-links-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", maxWidth: "460px", margin: "0 auto" }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="contact-link"
              style={{
                ...(l.primary
                  ? { gridColumn: "1 / -1", background: "var(--c-p)", border: "1px solid var(--c-p)", borderRadius: "12px", color: "#fff", fontWeight: 500 }
                  : { background: "var(--c-s)", border: "1px solid var(--c-b)", borderRadius: "12px", backdropFilter: "blur(8px)" }),
                padding: "13px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                textDecoration: "none",
                color: l.primary ? "#fff" : "var(--c-fg)",
                fontSize: "13.5px",
                fontFamily: "JetBrains Mono, monospace",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                if (l.primary) { e.currentTarget.style.opacity = ".86"; }
                else { e.currentTarget.style.borderColor = "var(--c-bh)"; e.currentTarget.style.background = "var(--c-sh)"; }
              }}
              onMouseLeave={(e) => {
                if (l.primary) { e.currentTarget.style.opacity = "1"; }
                else { e.currentTarget.style.borderColor = "var(--c-b)"; e.currentTarget.style.background = "var(--c-s)"; }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>{l.icon}{l.label}</div>
              <span style={{ fontSize: "12px" }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      <footer
        style={{
          marginTop: "80px",
          borderTop: "1px solid var(--c-b)",
          padding: "18px 0",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
          color: "var(--c-dim)",
          transition: "border-color 0.35s ease",
        }}
      >
        <span>© {new Date().getFullYear()} Guilherme Ferrarezi</span>
        <span>feito com <span style={{ color: "var(--c-p)" }}>♥</span> em Ribeirão Preto</span>
      </footer>
    </section>
  );
}
