import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/i18n/I18nContext";

gsap.registerPlugin(ScrollTrigger);

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS as string;

const ICON = {
  whatsapp: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411z" />
    </svg>
  ),
  mail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  github: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
};

const channels = [
  { k: "e-mail", v: "contato@guilhermebf.dev", href: "mailto:contato@guilhermebf.dev", icon: ICON.mail },
  { k: "github", v: "Guilhermeb-Ferrarezi", href: "https://github.com/Guilhermeb-Ferrarezi", icon: ICON.github },
  { k: "instagram", v: "@guilherme38_38", href: "https://instagram.com/guilherme38_38", icon: ICON.instagram },
];

type Status = "idle" | "sending" | "ok" | "error";

export function Contact() {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    let ctx: gsap.Context | null = null;

    const raf = requestAnimationFrame(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const conn = sec.querySelector<SVGPathElement>(".contact-conn-path");
      const spine = sec.querySelector<HTMLElement>(".contact-spine");
      const pjNodes = document.querySelectorAll<SVGCircleElement>("#projetos .pj-node-spine");

      // Conector: liga o último nó da spine de Projetos ao nó // contato
      if (!isMobile && conn && spine && pjNodes.length) {
        const cRect = sec.getBoundingClientRect();
        const a = pjNodes[pjNodes.length - 1].getBoundingClientRect();
        const s = spine.getBoundingClientRect();
        const ax = a.left + a.width / 2 - cRect.left;
        const ay = a.top + a.height / 2 - cRect.top; // negativo (acima da seção)
        const bx = s.left + s.width / 2 - cRect.left;
        const by = s.top - cRect.top;
        const midY = ay + (by - ay) * 0.5;
        conn.setAttribute("d", `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by}`);
      }

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".contact-node").forEach((node) => {
          gsap.from(node, {
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%", toggleActions: "play none none none" },
          });
        });

        if (conn && conn.getTotalLength() > 0) {
          const len = conn.getTotalLength();
          gsap.set(conn, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(conn, {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: sec, start: "top 78%", toggleActions: "play none none none" },
          });
        }
      }, sec);
    });

    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const fd = new FormData(form);
    fd.append("access_key", ACCESS_KEY);
    fd.append("subject", "Novo contato pelo portfólio 🚀");
    fd.append("from_name", "Portfólio · Guilherme Ferrarezi");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contato"
      ref={sectionRef}
      style={{ maxWidth: "1100px", margin: "0 auto", padding: "110px 48px 0", boxSizing: "border-box", position: "relative" }}
    >
      {/* Conector que vem do último nó da spine de Projetos até o nó // contato */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 0 }}
      >
        <path className="contact-conn-path" stroke="var(--c-p)" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="contact-wrap" style={{ position: "relative", zIndex: 1 }}>
        <span className="contact-spine" aria-hidden="true" />

        {/* Cabeçalho */}
        <div className="contact-node" style={{ marginBottom: "44px" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "var(--c-p)",
              marginBottom: "16px",
            }}
          >
            {t.contact.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
              lineHeight: 1.04,
              color: "var(--c-fg)",
              margin: 0,
            }}
          >
            {t.contact.title}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--c-muted)", lineHeight: 1.7, maxWidth: "46ch", marginTop: "18px" }}>
            {t.contact.sub}
          </p>
        </div>

        {/* Formulário */}
        <div className="contact-node" style={{ marginBottom: "40px", maxWidth: "580px" }}>
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <label style={fieldLabel}>
                <span style={fieldCap}>{t.contact.f_name}</span>
                <input className="contact-input" name="name" type="text" required placeholder={t.contact.ph_name} />
              </label>
              <label style={fieldLabel}>
                <span style={fieldCap}>{t.contact.f_email}</span>
                <input className="contact-input" name="email" type="email" required placeholder={t.contact.ph_email} />
              </label>
            </div>
            <label style={fieldLabel}>
              <span style={fieldCap}>{t.contact.f_message}</span>
              <textarea className="contact-input" name="message" required rows={4} placeholder={t.contact.ph_message} style={{ resize: "vertical", minHeight: "104px" }} />
            </label>

            {/* honeypot anti-spam (escondido) */}
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "13px 24px",
                  background: "var(--c-p)",
                  color: "var(--c-onp)",
                  border: "none",
                  borderRadius: "10px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: status === "sending" ? "default" : "pointer",
                  opacity: status === "sending" ? 0.7 : 1,
                  transition: "opacity .15s, transform .15s",
                }}
                onMouseEnter={(e) => { if (status !== "sending") e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                {status === "sending" ? t.contact.sending : status === "ok" ? t.contact.sent : t.contact.send}
              </button>

              {status === "ok" && (
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12.5px", color: "var(--c-fg)" }}>
                  {t.contact.ok}
                </span>
              )}
              {status === "error" && (
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12.5px", color: "var(--c-muted)" }}>
                  {t.contact.error}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Canais diretos */}
        <div className="contact-node">
          <a
            href="https://wa.me/5516996129511"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              background: "var(--c-pd)",
              border: "1px solid var(--c-ps)",
              borderRadius: "10px",
              color: "var(--c-fg)",
              textDecoration: "none",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "13.5px",
              marginBottom: "18px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--c-pb)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--c-pd)"; }}
          >
            <span style={{ color: "var(--c-p)" }}>{ICON.whatsapp}</span>
            WhatsApp · (16) 99612-9511
            <span style={{ color: "var(--c-mid)" }}>↗</span>
          </a>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
            {channels.map((c) => (
              <a
                key={c.k}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "10px 15px",
                  background: "var(--c-s)",
                  border: "1px solid var(--c-b)",
                  borderRadius: "10px",
                  color: "var(--c-fg)",
                  textDecoration: "none",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12.5px",
                  transition: "border-color .15s, background .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-bh)"; e.currentTarget.style.background = "var(--c-sh)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-b)"; e.currentTarget.style.background = "var(--c-s)"; }}
              >
                <span style={{ color: "var(--c-p)" }}>{c.icon}</span>
                {c.v}
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer
        style={{
          marginTop: "84px",
          borderTop: "1px solid var(--c-b)",
          padding: "18px 0",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
          color: "var(--c-dim)",
        }}
      >
        <span>© {new Date().getFullYear()} Guilherme Ferrarezi</span>
        <span>{t.contact.footer_made}</span>
      </footer>
    </section>
  );
}

const fieldLabel: CSSProperties = { display: "flex", flexDirection: "column", gap: "7px" };
const fieldCap: CSSProperties = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "10.5px",
  textTransform: "uppercase",
  letterSpacing: ".1em",
  color: "var(--c-mid)",
};
