import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  to: string;
  /** Alinha a linha ao x da spine do TechTree em vez de centralizar */
  spineAlign?: boolean;
}

const LINE_H = 72;

export function SectionArrow({ to, spineAlign }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: LINE_H, strokeDashoffset: LINE_H });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 90%",
          end: "bottom 50%",
          scrub: 0.8,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      onClick={() => document.querySelector(to)?.scrollIntoView({ behavior: "smooth" })}
      style={{
        display: "flex",
        // quando spineAlign: posiciona no x da spine do TechTree (padding 64 + SP_X 26 = 90px)
        justifyContent: spineAlign ? "flex-start" : "center",
        paddingLeft: spineAlign
          ? "calc(max(0px, (100vw - 1100px) / 2) + 90px)"
          : undefined,
        height: `${LINE_H}px`,
        cursor: "pointer",
        position: "relative",
        zIndex: 2,
        marginBottom: "-8px",
      }}
    >
      <svg width="2" height={LINE_H} viewBox={`0 0 2 ${LINE_H}`} fill="none" style={{ overflow: "visible" }}>
        <path
          ref={pathRef}
          d={`M 1 0 L 1 ${LINE_H}`}
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
