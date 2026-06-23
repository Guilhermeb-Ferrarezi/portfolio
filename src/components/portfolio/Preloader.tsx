import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onComplete: () => void;
}

const L1 = "Guilherme";
const L2 = "Ferrarezi";

export function Preloader({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRef  = useRef<HTMLDivElement>(null);
  const botRef  = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Flow field de fundo (mesmo efeito do Hero, leve)
    let raf = 0;
    const cv = canvasRef.current;
    if (cv) {
      const c = cv.getContext("2d")!;
      const W = (cv.width = window.innerWidth);
      const H = (cv.height = window.innerHeight);
      const N = window.innerWidth < 768 ? 120 : 200;
      const ps = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H }));
      let tt = 0;
      c.fillStyle = "#070707"; c.fillRect(0, 0, W, H);
      const tick = () => {
        raf = requestAnimationFrame(tick);
        tt += 0.0024;
        c.fillStyle = "rgba(7,7,7,0.09)"; c.fillRect(0, 0, W, H);
        c.strokeStyle = "rgba(255,255,255,0.2)"; c.lineWidth = 1;
        for (const p of ps) {
          const a = Math.sin(p.x * 0.0024 + tt) * Math.cos(p.y * 0.0024 - tt) * Math.PI * 2;
          const nx = p.x + Math.cos(a) * 2, ny = p.y + Math.sin(a) * 2;
          c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(nx, ny); c.stroke();
          p.x = nx; p.y = ny;
          if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) { p.x = Math.random() * W; p.y = Math.random() * H; }
        }
      };
      tick();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete();
        },
      });

      tl.from(".pre-char", {
        y: "115%",
        duration: 1,
        stagger: 0.038,
        ease: "power4.out",
      }, 0.25)
      .to({}, { duration: 0.5 })
      .to(seamRef.current, { opacity: 1, duration: 0.12, ease: "none" })
      .to({}, { duration: 0.08 })
      .to(topRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<")
      .to(botRef.current, { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<")
      .to([".pre-name", canvasRef.current], { opacity: 0, duration: 0.3, ease: "power2.in" }, "<+0.05");
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const charStyle = {
    display: "inline-block" as const,
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "clamp(2rem, 12vw, 4rem)",
    fontWeight: 900,
    letterSpacing: "-.035em",
    lineHeight: 0.93,
  };

  return (
    <div data-testid="preloader" style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      {/* Painel superior */}
      <div
        ref={topRef}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "50%",
          background: "#070707",
        }}
      />

      {/* Painel inferior */}
      <div
        ref={botRef}
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "50%",
          background: "#070707",
        }}
      />

      {/* Flow field de fundo */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} />

      {/* Linha roxa na emenda */}
      <div
        ref={seamRef}
        style={{
          position: "absolute",
          top: "50%",
          left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent 0%, var(--c-p) 25%, var(--c-p) 50%, var(--c-p) 75%, transparent 100%)",
          boxShadow: "0 0 24px var(--c-p), 0 0 60px var(--c-ps)",
          opacity: 0,
          zIndex: 1001,
          pointerEvents: "none",
        }}
      />

      {/* Nome centralizado */}
      <div
        className="pre-name"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          textAlign: "left",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Linha 1 — branco */}
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          {L1.split("").map((ch, i) => (
            <span key={i} className="pre-char" style={{ ...charStyle, color: "#f0f0f0" }}>
              {ch}
            </span>
          ))}
        </div>

        {/* Linha 2 — roxo */}
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          {L2.split("").map((ch, i) => (
            <span key={i} className="pre-char" style={{ ...charStyle, color: "var(--c-p)" }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
