import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onComplete: () => void;
}

const L1 = "Guilherme";
const L2 = "Ferrarezi.";

export function Preloader({ onComplete }: Props) {
  const topRef  = useRef<HTMLDivElement>(null);
  const botRef  = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

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
      .to(".pre-name", { opacity: 0, duration: 0.25, ease: "power2.in" }, "<+0.05");
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const charStyle = {
    display: "inline-block" as const,
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
    fontWeight: 900,
    letterSpacing: "-.045em",
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

      {/* Linha roxa na emenda */}
      <div
        ref={seamRef}
        style={{
          position: "absolute",
          top: "50%",
          left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent 0%, #7c3aed 25%, #c4b5fd 50%, #7c3aed 75%, transparent 100%)",
          boxShadow: "0 0 24px rgba(139,92,246,0.9), 0 0 60px rgba(139,92,246,0.4)",
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
        <div style={{ overflow: "hidden" }}>
          {L1.split("").map((ch, i) => (
            <span key={i} className="pre-char" style={{ ...charStyle, color: "#f0f0f0" }}>
              {ch}
            </span>
          ))}
        </div>

        {/* Linha 2 — roxo */}
        <div style={{ overflow: "hidden" }}>
          {L2.split("").map((ch, i) => (
            <span key={i} className="pre-char" style={{ ...charStyle, color: "#8b5cf6" }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
