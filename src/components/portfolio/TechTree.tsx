import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useT } from "@/i18n/I18nContext";
import { StackBackground } from "./StackBackground";

import androidSvg    from "@/assets/svgs/android.svg";
import bunSvg        from "@/assets/svgs/bun.svg";
import claudeSvg     from "@/assets/svgs/claude.svg";
import cloudflareSvg from "@/assets/svgs/cloudflare.svg";
import cssSvg        from "@/assets/svgs/css.svg";
import dockerSvg     from "@/assets/svgs/docker.svg";
import expoSvg       from "@/assets/svgs/expo.svg";
import figmaSvg      from "@/assets/svgs/figma.svg";
import githubSvg     from "@/assets/svgs/github.svg";
import gitSvg        from "@/assets/svgs/git.svg";
import goSvg         from "@/assets/svgs/golang.svg";
import html5Svg      from "@/assets/svgs/html5.svg";
import jsSvg         from "@/assets/svgs/js.svg";
import linuxSvg      from "@/assets/svgs/linux.svg";
import nextjsSvg     from "@/assets/svgs/nextjs.svg";
import nodejsSvg     from "@/assets/svgs/nodejs.svg";
import playwrightSvg from "@/assets/svgs/playwright.svg";
import postgresSvg   from "@/assets/svgs/postgres.svg";
import pythonSvg     from "@/assets/svgs/python.svg";
import radixSvg      from "@/assets/svgs/radix-ui.svg";
import reactSvg      from "@/assets/svgs/react.svg";
import redisSvg      from "@/assets/svgs/redis.svg";
import shadcnSvg     from "@/assets/svgs/shadcn-ui.svg";
import supabaseSvg   from "@/assets/svgs/supabase.svg";
import tailwindSvg   from "@/assets/svgs/tailwind.svg";
import tsSvg         from "@/assets/svgs/typescript.svg";
import vercelSvg     from "@/assets/svgs/vercel.svg";
import viteSvg       from "@/assets/svgs/vite.svg";

gsap.registerPlugin(ScrollTrigger);

const TECHS: Record<string, { name: string; svg: string; desc: { pt: string; en: string } }> = {
  ts:         { name: "TypeScript",   svg: tsSvg,         desc: { pt: "Tipagem estática para JS",              en: "Static typing for JavaScript" } },
  js:         { name: "JavaScript",   svg: jsSvg,         desc: { pt: "Linguagem universal da web",             en: "Universal web language" } },
  go:         { name: "Go",           svg: goSvg,         desc: { pt: "Backend performático e simples",         en: "Performant and simple backend" } },
  python:     { name: "Python",       svg: pythonSvg,     desc: { pt: "Scripts, automações e IA",               en: "Scripts, automations and AI" } },
  html:       { name: "HTML5",        svg: html5Svg,      desc: { pt: "Estrutura semântica da web",             en: "Semantic web structure" } },
  css:        { name: "CSS",          svg: cssSvg,        desc: { pt: "Estilo e animações web",                 en: "Web styling and animations" } },
  react:      { name: "React",        svg: reactSvg,      desc: { pt: "Biblioteca UI declarativa",              en: "Declarative UI library" } },
  nextjs:     { name: "Next.js",      svg: nextjsSvg,     desc: { pt: "Framework React fullstack",              en: "Fullstack React framework" } },
  vite:       { name: "Vite",         svg: viteSvg,       desc: { pt: "Bundler ultrarrápido",                   en: "Ultra-fast bundler" } },
  tailwind:   { name: "Tailwind CSS", svg: tailwindSvg,   desc: { pt: "CSS utilitário mobile-first",            en: "Mobile-first utility CSS" } },
  shadcn:     { name: "shadcn/ui",    svg: shadcnSvg,     desc: { pt: "Componentes prontos e acessíveis",       en: "Ready-made accessible components" } },
  radix:      { name: "Radix UI",     svg: radixSvg,      desc: { pt: "Primitivos UI headless",                 en: "Headless UI primitives" } },
  nodejs:     { name: "Node.js",      svg: nodejsSvg,     desc: { pt: "Runtime JS no servidor",                 en: "JS runtime on the server" } },
  bun:        { name: "Bun",          svg: bunSvg,        desc: { pt: "Runtime JS moderno e rápido",            en: "Fast modern JS runtime" } },
  postgres:   { name: "PostgreSQL",   svg: postgresSvg,   desc: { pt: "Banco relacional robusto",               en: "Robust relational database" } },
  redis:      { name: "Redis",        svg: redisSvg,      desc: { pt: "Cache e filas em memória",               en: "In-memory cache and queues" } },
  supabase:   { name: "Supabase",     svg: supabaseSvg,   desc: { pt: "Backend as a service open source",       en: "Open source backend as a service" } },
  docker:     { name: "Docker",       svg: dockerSvg,     desc: { pt: "Containerização de apps",                en: "Application containerization" } },
  vercel:     { name: "Vercel",       svg: vercelSvg,     desc: { pt: "Deploy frontend na borda",               en: "Frontend deploy at the edge" } },
  cloudflare: { name: "Cloudflare",   svg: cloudflareSvg, desc: { pt: "CDN, DNS e edge computing",              en: "CDN, DNS and edge computing" } },
  linux:      { name: "Linux",        svg: linuxSvg,      desc: { pt: "SO para servidores e dev",               en: "OS for servers and dev" } },
  git:        { name: "Git",          svg: gitSvg,        desc: { pt: "Controle de versão distribuído",         en: "Distributed version control" } },
  github:     { name: "GitHub",       svg: githubSvg,     desc: { pt: "Hospedagem e colaboração de código",     en: "Code hosting and collaboration" } },
  figma:      { name: "Figma",        svg: figmaSvg,      desc: { pt: "Design e prototipação de UI",            en: "UI design and prototyping" } },
  playwright: { name: "Playwright",   svg: playwrightSvg, desc: { pt: "Testes E2E automatizados",               en: "Automated E2E testing" } },
  expo:       { name: "Expo",         svg: expoSvg,       desc: { pt: "Framework React Native cross-platform",  en: "Cross-platform React Native framework" } },
  android:    { name: "Android",      svg: androidSvg,    desc: { pt: "Plataforma mobile Android",              en: "Android mobile platform" } },
  claude:     { name: "Claude AI",    svg: claudeSvg,     desc: { pt: "IA para desenvolvimento acelerado",      en: "AI for accelerated development" } },
};

const TIERS = [
  { id: "lang",  label: { pt: "Linguagens",     en: "Languages"      }, techs: ["ts", "js", "go", "python"] },
  { id: "front", label: { pt: "Frontend",        en: "Frontend"       }, techs: ["html", "css", "react", "nextjs", "vite", "tailwind", "shadcn", "radix"] },
  { id: "back",  label: { pt: "Backend",         en: "Backend"        }, techs: ["nodejs", "bun", "postgres", "redis", "supabase"] },
  { id: "infra", label: { pt: "Infra & Deploy",  en: "Infra & Deploy" }, techs: ["docker", "vercel", "cloudflare", "linux"] },
  { id: "tools", label: { pt: "Ferramentas",     en: "Tools"          }, techs: ["git", "github", "figma", "playwright", "expo", "android", "claude"] },
];

function TechPill({ id, locale }: { id: string; locale: "pt" | "en" }) {
  const tech = TECHS[id];
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="tech-node"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 14px 7px 10px",
            borderRadius: "8px",
            border: `1px solid ${hovered ? "var(--c-ps)" : "var(--c-b)"}`,
            background: hovered ? "var(--c-b)" : "var(--c-s)",
            cursor: "default",
            userSelect: "none",
            flexShrink: 0,
            transform: hovered ? "translateY(-1px)" : "translateY(0)",
            boxShadow: hovered ? "0 4px 14px var(--c-pd)" : "none",
            transition: "border-color .15s, background .15s, transform .15s, box-shadow .15s",
          }}
        >
          <img
            src={tech.svg}
            alt={tech.name}
            style={{ width: "18px", height: "18px", objectFit: "contain", flexShrink: 0, filter: "grayscale(1)" }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12.5px",
              fontWeight: 500,
              color: hovered ? "var(--c-fg)" : "var(--c-muted)",
              whiteSpace: "nowrap",
              transition: "color .15s",
            }}
          >
            {tech.name}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p style={{ fontWeight: 600, marginBottom: "2px", fontSize: "12px" }}>{tech.name}</p>
        <p style={{ opacity: 0.75, fontSize: "11px" }}>{tech.desc[locale]}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function TechTree() {
  const sectionRef = useRef<HTMLElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const spineRef = useRef<SVGPathElement>(null);
  const { locale } = useT();

  useEffect(() => {
    const section = sectionRef.current;
    const tree = treeRef.current;
    const svg = svgRef.current;
    const spine = spineRef.current;
    if (!section || !tree || !svg || !spine) return;

    let ctx: gsap.Context | null = null;

    const raf = requestAnimationFrame(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      // Mobile: o circuito SVG fica escondido (CSS) — reveal simples por tier, sem paths
      if (isMobile) {
        const rows = Array.from(tree.querySelectorAll<HTMLElement>(".tier-row"));
        ctx = gsap.context(() => {
          rows.forEach((row) => {
            const head = row.querySelector(".tier-head");
            const box = row.querySelector(".tier-box");
            const pills = row.querySelectorAll(".tech-node");
            gsap.set([head, box], { y: 14, opacity: 0 });
            gsap.set(pills, { y: 8, opacity: 0 });
            gsap
              .timeline({
                scrollTrigger: { trigger: row, start: "top 92%", toggleActions: "play none none none" },
              })
              .to([head, box], { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" })
              .to(pills, { y: 0, opacity: 1, duration: 0.35, stagger: 0.03, ease: "power3.out" }, "-=0.2");
          });
        }, sectionRef);
        return;
      }

      const treeRect = tree.getBoundingClientRect();
      const SP_X = 26;   // x da spine
      const KNEE = 52;   // x do degrau vertical
      const DROP = 18;   // quanto o ramo sai acima do label
      const CL = 14;     // tamanho do corner bracket

      const rows = Array.from(tree.querySelectorAll<HTMLElement>(".tier-row"));
      const groups = Array.from(svg.querySelectorAll<SVGGElement>(".tt-branch-g"));
      const startYs: number[] = [];
      const labelCys: number[] = [];

      // Mede posições reais e desenha spine, ramos-degrau, nós e corner brackets
      rows.forEach((row, i) => {
        const head = row.querySelector<HTMLElement>(".tier-head");
        const box = row.querySelector<HTMLElement>(".tier-box");
        const g = groups[i];
        if (!head || !box || !g) return;

        const hr = head.getBoundingClientRect();
        const cy = hr.top - treeRect.top + hr.height / 2;
        const headLeft = hr.left - treeRect.left;
        const startY = cy - DROP;
        startYs.push(startY);
        labelCys.push(cy);

        const endX = Math.max(KNEE + 16, headLeft - 12);
        // ramo com degrau: sai da spine, desce no joelho, segue até o label
        g.querySelector(".tt-branch")!.setAttribute(
          "d",
          `M ${SP_X} ${startY} L ${KNEE} ${startY} L ${KNEE} ${cy} L ${endX} ${cy}`,
        );
        const ns = g.querySelector(".tt-node-spine")!;
        const ne = g.querySelector(".tt-node-end")!;
        ns.setAttribute("cx", String(SP_X)); ns.setAttribute("cy", String(startY));
        ne.setAttribute("cx", String(endX)); ne.setAttribute("cy", String(cy));
        const ping = g.querySelector(".tt-ping")!;
        ping.setAttribute("cx", String(endX)); ping.setAttribute("cy", String(cy));

        // corner brackets em "L" nas 4 esquinas da caixa
        const br = box.getBoundingClientRect();
        const x1 = br.left - treeRect.left;
        const y1 = br.top - treeRect.top;
        const x2 = br.right - treeRect.left;
        const y2 = br.bottom - treeRect.top;
        g.querySelector(".tt-corners")!.setAttribute(
          "d",
          `M ${x1} ${y1 + CL} L ${x1} ${y1} L ${x1 + CL} ${y1} ` +
            `M ${x2 - CL} ${y1} L ${x2} ${y1} L ${x2} ${y1 + CL} ` +
            `M ${x1} ${y2 - CL} L ${x1} ${y2} L ${x1 + CL} ${y2} ` +
            `M ${x2 - CL} ${y2} L ${x2} ${y2} L ${x2} ${y2 - CL}`,
        );
      });

      const topY = -90;
      const botY = labelCys[labelCys.length - 1] ?? topY;
      spine.setAttribute("d", `M ${SP_X} ${topY} L ${SP_X} ${botY}`);
      const topNode = svg.querySelector(".tt-spine-top");
      topNode?.setAttribute("cx", String(SP_X));
      topNode?.setAttribute("cy", String(topY));

      ctx = gsap.context(() => {
        // Spine se desenha conforme o scroll atravessa a seção
        const spineLen = spine.getTotalLength();
        gsap.set(spine, { strokeDasharray: spineLen, strokeDashoffset: spineLen });
        gsap.to(spine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: tree, start: "top 78%", end: "bottom 75%", scrub: 1 },
        });

        const topNode = svg.querySelector(".tt-spine-top");
        gsap.set(topNode, { opacity: 0 });
        gsap.to(topNode, {
          opacity: 1,
          duration: 0.3,
          scrollTrigger: { trigger: tree, start: "top 80%", toggleActions: "play none none none" },
        });

        // Cada tier: nó spine → ramo desenha → nó ponta (ping) → label → corners → caixa → pills
        rows.forEach((row, i) => {
          const head = row.querySelector(".tier-head");
          const box = row.querySelector(".tier-box");
          const pills = row.querySelectorAll(".tech-node");
          const g = groups[i];
          if (!g) return;
          const branch = g.querySelector(".tt-branch") as SVGPathElement;
          const corners = g.querySelector(".tt-corners") as SVGPathElement;
          const nSpine = g.querySelector(".tt-node-spine");
          const nEnd = g.querySelector(".tt-node-end");
          const ping = g.querySelector(".tt-ping");
          const blen = branch.getTotalLength();
          const clen = corners.getTotalLength();

          gsap.set(branch, { strokeDasharray: blen, strokeDashoffset: blen });
          gsap.set(corners, { strokeDasharray: clen, strokeDashoffset: clen });
          gsap.set([nSpine, nEnd], { opacity: 0 });
          gsap.set(ping, { opacity: 0, attr: { r: 4 } });
          gsap.set(head, { x: -10, opacity: 0 });
          gsap.set(box, { y: 14, opacity: 0 });
          gsap.set(pills, { y: 10, opacity: 0 });

          gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 95%", toggleActions: "play none none none" },
          })
            .to(nSpine, { opacity: 1, duration: 0.18 })
            .to(branch, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, "-=0.04")
            .to(nEnd, { opacity: 1, duration: 0.18 }, "-=0.1")
            .fromTo(
              ping,
              { attr: { r: 4 }, opacity: 0.55 },
              { attr: { r: 18 }, opacity: 0, duration: 0.8, ease: "power2.out" },
              "-=0.12",
            )
            .to(head, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.72")
            .to(corners, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.55")
            .to(box, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.5")
            .to(pills, { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power3.out" }, "-=0.3");
        });
      }, sectionRef);
    });

    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, [locale]);

  return (
    <section
      id="stack"
      ref={sectionRef}
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 64px 60px",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <StackBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
      <TooltipProvider delayDuration={150}>
        {/* Árvore de circuito — spine + ramos desenhados no scroll */}
        <div ref={treeRef} className="tech-tree" style={{ position: "relative" }}>
          <svg
            ref={svgRef}
            className="tt-svg"
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
            <path
              ref={spineRef}
              className="tt-spine"
              stroke="var(--c-p)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.55"
              strokeLinecap="round"
            />
            <circle className="tt-spine-top" r="3.5" fill="var(--c-p)" />
            {TIERS.map((tier) => (
              <g className="tt-branch-g" key={tier.id}>
                <path className="tt-branch" stroke="var(--c-p)" strokeWidth="1.3" fill="none" opacity="0.55" strokeLinecap="round" strokeLinejoin="round" />
                <path className="tt-corners" stroke="var(--c-p)" strokeWidth="1.3" fill="none" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
                <circle className="tt-ping" fill="none" stroke="var(--c-p)" strokeWidth="1" />
                <circle className="tt-node tt-node-spine" r="3.2" fill="var(--c-p)" />
                <circle className="tt-node tt-node-end" r="4" fill="var(--c-p)" />
              </g>
            ))}
          </svg>

          {/* Título recuado à direita da spine (a spine sobe atrás dele) */}
          <div className="tt-header" style={{ marginBottom: "28px", paddingLeft: "88px" }}>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--c-p)",
                marginBottom: "8px",
              }}
            >
              {locale === "pt" ? "// tecnologias" : "// technologies"}
            </p>
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontWeight: 900,
                letterSpacing: "-.04em",
                color: "var(--c-fg)",
                lineHeight: 1,
              }}
            >
              Stack
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className="tier-row"
                style={{ position: "relative", padding: "12px 0 16px 88px" }}
              >
                <div
                  className="tier-head"
                  style={{ display: "inline-flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "11px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--c-p)",
                    }}
                  >
                    {tier.label[locale]}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "10px",
                      color: "var(--c-muted)",
                      opacity: 0.5,
                    }}
                  >
                    {tier.techs.length} {locale === "pt" ? "itens" : "items"}
                  </span>
                </div>

                <div
                  className="tier-box"
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    padding: "16px",
                    border: "1px solid var(--c-b)",
                    borderRadius: "3px",
                    background: "var(--c-s)",
                  }}
                >
                  {tier.techs.map((id) => (
                    <TechPill key={id} id={id} locale={locale} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>
      </div>
    </section>
  );
}
