import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/i18n/I18nContext";

gsap.registerPlugin(ScrollTrigger);

// Mede a posição de um elemento relativa a um container
function relRect(el: Element, container: Element) {
  const eR = el.getBoundingClientRect();
  const cR = container.getBoundingClientRect();
  return {
    top:    eR.top    - cR.top,
    bottom: eR.bottom - cR.top,
    left:   eR.left   - cR.left,
    right:  eR.right  - cR.left,
    cx: (eR.left + eR.right)  / 2 - cR.left,
    cy: (eR.top  + eR.bottom) / 2 - cR.top,
    width:  eR.width,
    height: eR.height,
  };
}

export function About() {
  const { t } = useT();
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const conn3Ref = useRef<SVGPathElement>(null);
  const spineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    const c3 = conn3Ref.current;
    if (!wrap || !inner || !c3) return;

    let ctx: gsap.Context | null = null;

    const raf = requestAnimationFrame(() => {
      // Medições DOM ANTES de qualquer gsap.set (transforms ainda não aplicadas)
      const rightColEl = inner.querySelector(".about-right-col");
      const availEl    = inner.querySelector(".av");

      if (!rightColEl || !availEl) return;

      const rightCol = relRect(rightColEl, inner);
      const avail    = relRect(availEl, inner);
      const rightColCx = rightCol.cx;

      // Conector inferior: de baixo do avail → spine x (90px, alinhado à spine do Stack) até o fundo do inner
      const innerH = inner.getBoundingClientRect().height;
      const midY   = (avail.bottom + innerH) / 2;
      const d3 = `M ${rightColCx} ${avail.bottom} C ${rightColCx} ${midY}, 90 ${midY}, 90 ${innerH}`;

      c3.setAttribute("d", d3);

      // Spine vertical à esquerda: sobe acima do inner p/ receber a seta do Hero e desce até o fundo
      const spine = spineRef.current;
      spine?.setAttribute("d", `M 90 -90 L 90 ${innerH}`);

      ctx = gsap.context(() => {
        // Estado inicial — conteúdo oculto
        gsap.set(".al",      { opacity: 0 });
        gsap.set(".al2",     { opacity: 0, y: 10 });
        gsap.set(".ah .ac",  { y: "110%" });
        gsap.set(".ab p",    { y: 20, opacity: 0 });
        gsap.set(".as-wrap", { opacity: 0 });
        gsap.set(".as",      { y: 14, opacity: 0 });
        gsap.set(".av",      { y: 10, opacity: 0 });

        // Estado inicial — paths ocultos
        const len3 = c3.getTotalLength();
        gsap.set(c3, { strokeDasharray: len3, strokeDashoffset: len3 });
        if (spine) {
          const lenS = spine.getTotalLength();
          gsap.set(spine, { strokeDasharray: lenS, strokeDashoffset: lenS });
        }

        // Pin curto — segura a seção centralizada por um breve momento
        ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          pin: inner,
          pinSpacing: false,
          anticipatePin: 1,
        });

        // Entrada — anima enquanto a seção SOBE pela viewport, terminando
        // antes de centralizar. Assim o conteúdo já chega visível (sem tela morta).
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top 85%",
            end: "top 15%",
            scrub: 1,
          },
        });

        // Spine de entrada desenha primeiro (recebe a seta vinda do Hero)
        if (spine) tl.to(spine, { strokeDashoffset: 0, duration: 0.5, ease: "none" }, 0);

        tl
          // Label
          .to(".al",      { opacity: 1, duration: 0.2 })
          // Heading chars
          .to(".ah .ac",  { y: "0%", stagger: 0.012, duration: 0.5 }, "-=0.05")
          // Linha de apoio
          .to(".al2",     { opacity: 1, y: 0, duration: 0.2 }, "-=0.1")
          // Bio
          .to(".ab p",    { y: 0, opacity: 1, stagger: 0.15, duration: 0.4 }, "-=0.1")
          // Stats grid
          .to(".as-wrap", { opacity: 1, duration: 0.01 }, "-=0.05")
          .to(".as",      { y: 0, opacity: 1, stagger: 0.07, duration: 0.3 }, "-=0.01")
          // Disponibilidade
          .to(".av",      { y: 0, opacity: 1, duration: 0.2 }, "-=0.05")
          // Conector inferior
          .to(c3, { strokeDashoffset: 0, duration: 0.4, ease: "none" }, "-=0.05");
      }, wrapRef);
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [t]);

  const H1 = t.about.heading_1;
  const H2 = t.about.heading_2;

  const statItems = [
    { value: t.about.stat_1_value, label: t.about.stat_1_label },
    { value: t.about.stat_2_value, label: t.about.stat_2_label },
    { value: t.about.stat_3_value, label: t.about.stat_3_label },
    { value: t.about.stat_4_value, label: t.about.stat_4_label },
  ];

  return (
    <div ref={wrapRef} style={{ height: "120vh" }}>
      <div
        ref={innerRef}
        id="about"
        className="about-inner"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 64px",
          boxSizing: "border-box",
          maxWidth: "1100px",
          margin: "0 auto",
          gap: "16px",
        }}
      >
        {/* SVG overlay — paths calculados via getSmoothStepPath, animados pelo GSAP */}
        <svg
          className="about-connectors"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "visible",
            zIndex: 0,
          }}
        >
          <path ref={spineRef} className="about-spine" stroke="var(--c-p)" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
          <path ref={conn3Ref} stroke="var(--c-p)" strokeWidth="1" fill="none" opacity="0.55" />
        </svg>

        {/* Glow ambiente — radial suave ancorado no canto do conteúdo */}
        <div
          aria-hidden="true"
          className="about-glow"
          style={{
            position: "absolute",
            left: "-60px",
            top: "50%",
            width: "min(560px, 62%)",
            height: "420px",
            transform: "translateY(-50%)",
            background:
              "radial-gradient(ellipse at center, var(--c-pd), transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Cabeçalho centralizado — eyebrow + heading + apoio */}
        <div
          className="about-header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "14px",
            width: "100%",
            position: "relative",
            zIndex: 1,
            marginBottom: "16px",
          }}
        >
          <p
            className="al"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--c-p)",
              margin: 0,
            }}
          >
            {t.about.section_title}
          </p>

          <h2
            className="about-h2"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-.04em",
              color: "var(--c-fg)",
              margin: 0,
            }}
          >
            <span className="ah" style={{ display: "block", overflow: "hidden" }}>
              {H1.split("").map((ch, i) => (
                <span key={i} className="ac" style={{ display: "inline-block" }}>
                  {ch}
                </span>
              ))}
            </span>
            <span className="ah" style={{ display: "block", overflow: "hidden" }}>
              {H2.split("").map((ch, i) => (
                <span
                  key={i}
                  className="ac"
                  style={{
                    display: "inline-block",
                    color: i === 0 ? "var(--c-p)" : "var(--c-fg)",
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h2>

          <p
            className="al2"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12.5px",
              lineHeight: 1.6,
              letterSpacing: ".02em",
              color: "var(--c-muted)",
              maxWidth: "46ch",
              margin: 0,
            }}
          >
            {t.about.label}
          </p>
        </div>

        {/* Grid de conteúdo — bio à esquerda, stats/disponibilidade à direita */}
        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
            width: "100%",
            paddingLeft: "56px",
            boxSizing: "border-box",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Coluna esquerda — bio */}
          <div
            className="about-left-col"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div className="ab" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", lineHeight: 1.7, color: "var(--c-fg)" }}>
                {t.about.bio_1}
              </p>
              <p style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.92rem)", lineHeight: 1.7, color: "var(--c-muted)" }}>
                {t.about.bio_2}
              </p>
            </div>
          </div>

          {/* Coluna direita — stats + disponibilidade */}
          <div
            className="about-right-col"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div
              className="as-wrap about-stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                border: "1px solid var(--c-b)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {statItems.map((s, i) => (
                <div
                  key={i}
                  className="as"
                  style={{
                    padding: "16px 18px",
                    background: "var(--c-s)",
                    borderRight: i % 2 === 0 ? "1px solid var(--c-b)" : "none",
                    borderBottom: i < 2 ? "1px solid var(--c-b)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
                      fontWeight: 800,
                      letterSpacing: "-.03em",
                      color: "var(--c-p)",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "var(--c-muted)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="av"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "var(--c-muted)",
                letterSpacing: ".06em",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#28c840",
                  boxShadow: "0 0 8px rgba(40,200,64,0.7)",
                  flexShrink: 0,
                  animation: "hero-cursor 2.4s ease-in-out infinite",
                }}
              />
              {t.about.availability}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
