import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Github,
  Server,
  Trophy,
  Code2,
  Globe,
  Maximize2,
  X,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/i18n/I18nContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import goSvg from "@/assets/svgs/golang.svg";
import bunSvg from "@/assets/svgs/bun.svg";
import postgresSvg from "@/assets/svgs/postgres.svg";
import dockerSvg from "@/assets/svgs/docker.svg";
import reactSvg from "@/assets/svgs/react.svg";
import tsSvg from "@/assets/svgs/typescript.svg";
import jsSvg from "@/assets/svgs/js.svg";
import cssSvg from "@/assets/svgs/css.svg";
import tailwindSvg from "@/assets/svgs/tailwind.svg";
import viteSvg from "@/assets/svgs/vite.svg";
import cloudflareSvg from "@/assets/svgs/cloudflare.svg";
import graphqlSvg from "@/assets/svgs/graphql.svg";

import infraEmail from "@/assets/projetos/infra-email.png";
import infraPagamentos from "@/assets/projetos/infra-pagamentos.png";
import infraQuadros from "@/assets/projetos/infra-quadros.png";
import infraLogin from "@/assets/projetos/infra-login.png";
import infraCheckout from "@/assets/projetos/infra-checkout.png";
import infraAssinatura from "@/assets/projetos/infra-assinatura.png";
import homeHero from "@/assets/projetos/home-hero.png";
import homeFeatures from "@/assets/projetos/home-features.png";
import homeProgramas from "@/assets/projetos/home-programas.png";
import homeDepoimentos from "@/assets/projetos/home-depoimentos.png";
import homeComoFunciona from "@/assets/projetos/home-como-funciona.png";
import unaerpHome from "@/assets/projetos/unaerp-home.png";
import unaerpProgresso from "@/assets/projetos/unaerp-progresso.png";
import webideEditor from "@/assets/projetos/webide-editor.png";
import webideRepos from "@/assets/projetos/webide-repos.png";

gsap.registerPlugin(ScrollTrigger);

// Logo de cada tecnologia (quando existe SVG); sem ícone, mostra só o texto
const TAG_ICON: Record<string, string> = {
  Go: goSvg,
  Bun: bunSvg,
  PostgreSQL: postgresSvg,
  Docker: dockerSvg,
  React: reactSvg,
  TypeScript: tsSvg,
  JavaScript: jsSvg,
  CSS: cssSvg,
  Tailwind: tailwindSvg,
  Vite: viteSvg,
  Cloudflare: cloudflareSvg,
  GraphQL: graphqlSvg,
};

type Screenshot = { label: string; src: string; alt: string };

type ProjectId = "infra" | "unaerp" | "webide" | "home";

type Project = {
  id: ProjectId; // tagline + description vêm do i18n (t.projects.items[id])
  name: string;
  tags: string[];
  href?: string; // opcional — sem href, o modal abre sem botão de GitHub
  icon: LucideIcon;
  emoji: string;
  cover?: string; // imagem principal exibida na faixa do zigzag
  screenshots?: Screenshot[];
  video?: { label: string; src: string };
  highlights?: { title: string; description: string; icon: LucideIcon }[];
};

const projects: Project[] = [
  {
    id: "infra",
    name: "Santos Tech Infra",
    tags: ["Go", "React", "Bun", "PostgreSQL", "Docker"],
    href: "https://github.com/Guilhermeb-Ferrarezi/santos-tech-infra",
    icon: Server,
    emoji: "🔐",
    cover: infraPagamentos,
    screenshots: [
      { label: "Painel de pagamentos", src: infraPagamentos, alt: "Santos Tech Infra — dashboard de pagamentos" },
      { label: "Login único (SSO)", src: infraLogin, alt: "Santos Tech Infra — tela de login do ecossistema" },
      { label: "Checkout PIX", src: infraCheckout, alt: "Santos Tech Infra — checkout de pagamento via PIX" },
      { label: "Autorização de assinatura", src: infraAssinatura, alt: "Santos Tech Infra — autorização de assinatura recorrente via PIX" },
      { label: "Métricas de e-mail", src: infraEmail, alt: "Santos Tech Infra — métricas de envio de e-mail" },
      { label: "Fluxo de validação de e-mail", src: infraQuadros, alt: "Santos Tech Infra — quadro de fluxo SPF/DKIM/DMARC" },
    ],
  },
  {
    id: "unaerp",
    name: "Inter UnaERP",
    tags: ["Go", "GraphQL", "React", "PostgreSQL", "Tailwind", "Docker"],
    href: "https://github.com/Guilhermeb-Ferrarezi/sga-inter-unaerp",
    icon: Trophy,
    emoji: "🏆",
    cover: unaerpHome,
    screenshots: [
      { label: "Home do campeonato", src: unaerpHome, alt: "Inter UnaERP — home do campeonato" },
      { label: "Progresso do torneio", src: unaerpProgresso, alt: "Inter UnaERP — progresso do torneio e classificação" },
    ],
  },
  {
    id: "webide",
    name: "Web IDE",
    tags: ["TypeScript", "React", "Bun", "Vite", "Tailwind", "Docker"],
    href: "https://github.com/Guilhermeb-Ferrarezi/web-ide",
    icon: Code2,
    emoji: "💻",
    cover: webideEditor,
    screenshots: [
      { label: "Editor (Monaco)", src: webideEditor, alt: "Web IDE — editor de código com Monaco" },
      { label: "Seus repositórios", src: webideRepos, alt: "Web IDE — lista de repositórios do GitHub" },
    ],
  },
  {
    id: "home",
    name: "Santos Tech Home",
    tags: ["React", "TypeScript", "Tailwind", "Vite", "Cloudflare"],
    href: "https://github.com/Guilhermeb-Ferrarezi/Santos-Tech-Home-Page",
    icon: Globe,
    emoji: "🌐",
    cover: homeHero,
    screenshots: [
      { label: "Hero", src: homeHero, alt: "Santos Tech Home — hero" },
      { label: "Diferenciais", src: homeFeatures, alt: "Santos Tech Home — diferenciais" },
      { label: "Programas", src: homeProgramas, alt: "Santos Tech Home — programas" },
      { label: "Depoimentos", src: homeDepoimentos, alt: "Santos Tech Home — depoimentos" },
      { label: "Como funciona", src: homeComoFunciona, alt: "Santos Tech Home — como funciona" },
    ],
  },
];

function TagList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
      {tags.map((t) => {
        const icon = TAG_ICON[t];
        return (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 11px 4px 9px",
              background: "var(--c-s)",
              border: "1px solid var(--c-b)",
              borderRadius: "100px",
              fontSize: "12px",
              color: "var(--c-muted)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {icon && (
              <img src={icon} alt="" aria-hidden="true" style={{ width: "14px", height: "14px", objectFit: "contain" }} />
            )}
            {t}
          </span>
        );
      })}
    </div>
  );
}

// Placeholder estilizado (gradiente roxo + grid + emoji) usado quando não há imagem
function MediaCover({ project }: { project: Project }) {
  const src = project.cover || project.screenshots?.find((s) => s.src)?.src || "";

  if (src) {
    return <img src={src} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--c-pb), var(--c-s)), #0c0a12",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage:
            "linear-gradient(var(--c-pd) 1px, transparent 1px), linear-gradient(90deg, var(--c-pd) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <span style={{ position: "relative", fontSize: "56px", opacity: 0.85 }}>{project.emoji}</span>
      <span
        style={{
          position: "absolute",
          bottom: "12px",
          left: "14px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "10px",
          color: "var(--c-mid)",
        }}
      >
        preview em breve
      </span>
    </div>
  );
}

function ProjectDialog({ project }: { project: Project }) {
  const { t } = useT();
  const item = t.projects.items[project.id];
  const Icon = project.icon;
  const [fullscreen, setFullscreen] = useState<Screenshot | null>(null);
  const shots = project.screenshots?.filter((s) => s.src) ?? [];

  return (
    <>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto rounded-3xl border-border bg-background/95 p-0 shadow-card backdrop-blur-xl">
        <div className="grid gap-8 p-6 md:p-8">
          <DialogHeader className="gap-4 pr-8">
            <div
              style={{
                width: "56px", height: "56px", borderRadius: "14px",
                background: "var(--c-pd)", border: "1px solid var(--c-ps)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon className="w-7 h-7 text-primary-glow" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary-glow/80 mb-3">{item.tagline}</p>
              <DialogTitle className="text-3xl md:text-5xl font-bold tracking-tight">{project.name}</DialogTitle>
              <DialogDescription className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {item.description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <TagList tags={project.tags} />

          {project.highlights && (
            <div className="grid gap-3 md:grid-cols-2">
              {project.highlights.map((h) => {
                const HIcon = h.icon;
                return (
                  <div key={h.title} className="rounded-2xl border border-border bg-secondary/35 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <HIcon className="h-5 w-5 text-primary-glow" />
                      <h4 className="text-lg font-bold">{h.title}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{h.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-bold">{t.projects.media}</h4>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm font-mono text-foreground transition-colors hover:border-primary/60 hover:text-primary-glow"
                >
                  <Github className="h-4 w-4" />
                  {t.projects.repo}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>

            {project.video?.src && (
              <figure className="overflow-hidden rounded-2xl border border-border bg-secondary/30">
                <video src={project.video.src} controls playsInline preload="metadata" className="aspect-video w-full bg-black object-cover" />
                <figcaption className="border-t border-border px-4 py-3 text-sm font-mono text-muted-foreground">
                  {project.video.label}
                </figcaption>
              </figure>
            )}

            {shots.length ? (
              <div className="grid gap-4">
                {shots.map((s) => (
                  <figure key={s.label} className="overflow-hidden rounded-2xl border border-border bg-secondary/30">
                    <button
                      type="button"
                      onClick={() => setFullscreen(s)}
                      className="group/image relative block w-full cursor-zoom-in text-left"
                      aria-label={`Abrir ${s.label} em tela cheia`}
                    >
                      <img src={s.src} alt={s.alt} className="w-full object-cover" />
                      <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-mono text-foreground opacity-0 backdrop-blur transition-opacity group-hover/image:opacity-100">
                        <Maximize2 className="h-3.5 w-3.5" />
                        tela cheia
                      </span>
                    </button>
                    <figcaption className="border-t border-border px-4 py-3 text-sm font-mono text-muted-foreground">
                      {s.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : !project.video?.src ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/25 p-8 text-center text-sm text-muted-foreground">
                {t.projects.no_shot}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>

      {fullscreen && createPortal(
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={fullscreen.label}
          onClick={() => setFullscreen(null)}
        >
          <button
            type="button"
            onClick={() => setFullscreen(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
            <img src={fullscreen.src} alt={fullscreen.alt} className="max-h-[88vh] max-w-[94vw] rounded-lg object-contain shadow-2xl" />
            <figcaption className="mt-3 text-center text-sm font-mono text-zinc-300">{fullscreen.label}</figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}

// Faixa do zigzag — preview de um lado, texto/stack do outro (alterna por índice)
function ZigRow({ project, flip }: { project: Project; flip: boolean }) {
  const { t } = useT();
  const item = t.projects.items[project.id];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          aria-label={`Abrir ${project.name}`}
          className="zig-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr .95fr",
            gap: "48px",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
        >
          {/* Mídia */}
          <div
            className="zig-media"
            style={{
              order: flip ? 2 : 0,
              height: "320px",
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid var(--c-b)",
              background: "var(--c-s)",
              transition: "border-color .2s, transform .25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--c-ps)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--c-b)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <MediaCover project={project} />
          </div>

          {/* Texto */}
          <div className="zig-text" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                color: "var(--c-p)",
                margin: 0,
              }}
            >
              {item.tagline}
            </p>
            <h3
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
                fontWeight: 700,
                letterSpacing: "-.03em",
                lineHeight: 1.05,
                color: "var(--c-fg)",
                margin: 0,
              }}
            >
              {project.name}
            </h3>
            <p style={{ fontSize: "15px", color: "var(--c-muted)", lineHeight: 1.7, margin: 0, maxWidth: "46ch" }}>
              {item.description}
            </p>
            <TagList tags={project.tags} />
            <span
              style={{
                alignSelf: "flex-start",
                marginTop: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                border: "1px solid var(--c-b)",
                borderRadius: "10px",
                background: "var(--c-s)",
                color: "var(--c-fg)",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
              }}
            >
              {t.projects.view}
              <ArrowUpRight style={{ width: "15px", height: "15px" }} />
            </span>
          </div>
        </div>
      </DialogTrigger>
      <ProjectDialog project={project} />
    </Dialog>
  );
}

export function Projects() {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    const raf = requestAnimationFrame(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const rows = gsap.utils.toArray<HTMLElement>(".zig-row");
      if (!rows.length) return;

      // Mobile (ou sem SVG): reveal simples, sem circuito
      if (isMobile || !svg) {
        ctx = gsap.context(() => {
          rows.forEach((row) => {
            const media = row.querySelector(".zig-media");
            const text = row.querySelector(".zig-text");
            gsap.set([media, text], { y: 16, opacity: 0 });
            gsap
              .timeline({ scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none none" } })
              .to([media, text], { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" });
          });
        }, section);
        return;
      }

      // Mede posições reais (antes de qualquer gsap.set) e monta a spine + ramos
      const secRect = section.getBoundingClientRect();
      const groups = Array.from(svg.querySelectorAll<SVGGElement>(".pj-branch-g"));

      // eixo da spine = centro do gap entre as colunas (medido na 1ª faixa)
      const m0 = rows[0].querySelector<HTMLElement>(".zig-media")!.getBoundingClientRect();
      const t0 = rows[0].querySelector<HTMLElement>(".zig-text")!.getBoundingClientRect();
      const xSpine = (m0.right + t0.left) / 2 - secRect.left;

      const cys: number[] = [];
      rows.forEach((row, i) => {
        const mediaEl = row.querySelector<HTMLElement>(".zig-media");
        const g = groups[i];
        if (!mediaEl || !g) return;
        const mr = mediaEl.getBoundingClientRect();
        const cy = mr.top - secRect.top + mr.height / 2;
        const flip = i % 2 === 1; // media à direita
        const innerX = (flip ? mr.left : mr.right) - secRect.left;

        // Segmento da spine: liga a faixa anterior a esta (faixa 0 não tem)
        if (i > 0) {
          g.querySelector(".pj-seg")!.setAttribute("d", `M ${xSpine} ${cys[i - 1]} L ${xSpine} ${cy}`);
        }

        g.querySelector(".pj-branch")!.setAttribute("d", `M ${xSpine} ${cy} L ${innerX} ${cy}`);
        const ns = g.querySelector(".pj-node-spine")!;
        ns.setAttribute("cx", String(xSpine)); ns.setAttribute("cy", String(cy));
        const ne = g.querySelector(".pj-node-end")!;
        ne.setAttribute("cx", String(innerX)); ne.setAttribute("cy", String(cy));

        cys.push(cy);
      });

      // Linha-âncora: alinhada com a side-line (x≈90), desce do vão acima da
      // seção até logo acima do título, terminando com um nó.
      const lead = svg.querySelector<SVGPathElement>(".pj-lead");
      const leadNode = svg.querySelector<SVGCircleElement>(".pj-lead-node");
      const headerEl = section.querySelector<HTMLElement>(".pj-header");
      const X_LEAD = 90;
      let yLeadEnd = 0;
      if (lead && leadNode && headerEl) {
        const hr = headerEl.getBoundingClientRect();
        yLeadEnd = hr.top - secRect.top - 16;
        lead.setAttribute("d", `M ${X_LEAD} -110 L ${X_LEAD} ${yLeadEnd}`);
        leadNode.setAttribute("cx", String(X_LEAD));
        leadNode.setAttribute("cy", String(yLeadEnd));
      }

      ctx = gsap.context(() => {
        // Linha-âncora desenha de uma vez ao entrar e PERMANECE completa
        // (sem scrub — senão fica pela metade quando o scroll para no meio)
        if (lead && leadNode) {
          const leadLen = lead.getTotalLength();
          gsap.set(lead, { strokeDasharray: leadLen, strokeDashoffset: leadLen });
          gsap.set(leadNode, { opacity: 0 });
          gsap
            .timeline({ scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" } })
            .to(lead, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" })
            .to(leadNode, { opacity: 1, duration: 0.25 }, "-=0.15");
        }

        // Spine segmentada: cada trecho (faixa anterior → atual) desenha quando
        // a faixa entra. Assim a árvore SEMPRE chega no último card (sem scrub).
        rows.forEach((row, i) => {
          const media = row.querySelector(".zig-media");
          const text = row.querySelector(".zig-text");
          const g = groups[i];
          if (!g) return;
          const seg = g.querySelector(".pj-seg") as SVGPathElement;
          const branch = g.querySelector(".pj-branch") as SVGPathElement;
          const ns = g.querySelector(".pj-node-spine");
          const ne = g.querySelector(".pj-node-end");
          const blen = branch.getTotalLength();
          const slen = seg.getTotalLength();
          const flip = i % 2 === 1;

          gsap.set(branch, { strokeDasharray: blen, strokeDashoffset: blen });
          if (slen > 0) gsap.set(seg, { strokeDasharray: slen, strokeDashoffset: slen });
          gsap.set([ns, ne], { opacity: 0 });
          gsap.set(media, { x: flip ? 40 : -40, opacity: 0 });
          gsap.set(text, { x: flip ? -40 : 40, opacity: 0 });

          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none none" } });
          if (slen > 0) tl.to(seg, { strokeDashoffset: 0, duration: 0.4, ease: "none" });
          tl.to(ns, { opacity: 1, duration: 0.18 }, slen > 0 ? "-=0.05" : 0)
            .to(branch, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.04")
            .to(ne, { opacity: 1, duration: 0.18 }, "-=0.12")
            .to([media, text], { x: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 }, "-=0.45");
        });
      }, section);
    });

    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="projetos"
      ref={sectionRef}
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "100px 48px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Spine do circuito — eixo central + ramos que conectam cada card (desenha no scroll) */}
      <svg
        ref={svgRef}
        className="pj-svg"
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
        {/* Linha-âncora: vem da Stack e termina logo acima do título */}
        <path className="pj-lead" stroke="var(--c-p)" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
        <circle className="pj-lead-node" r="3.5" fill="var(--c-p)" />
        {projects.map((p) => (
          <g className="pj-branch-g" key={p.name}>
            <path className="pj-seg" stroke="var(--c-p)" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
            <path className="pj-branch" stroke="var(--c-p)" strokeWidth="1.3" fill="none" opacity="0.55" strokeLinecap="round" />
            <circle className="pj-node-spine" r="3" fill="var(--c-p)" />
            <circle className="pj-node-end" r="3.5" fill="var(--c-p)" />
          </g>
        ))}
      </svg>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          className="pj-header"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
            marginBottom: "64px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                color: "var(--c-p)",
                marginBottom: "10px",
              }}
            >
              {t.projects.eyebrow}
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem,3.5vw,3rem)",
                fontWeight: 800,
                letterSpacing: "-.035em",
                lineHeight: 1,
                fontFamily: "Space Grotesk, sans-serif",
                color: "var(--c-fg)",
              }}
            >
              {t.projects.title} <em style={{ fontStyle: "italic", color: "var(--c-p)" }}>{t.projects.title_em}</em>.
            </h2>
          </div>
          <a
            href="https://github.com/Guilhermeb-Ferrarezi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 18px",
              background: "var(--c-s)",
              color: "var(--c-fg)",
              border: "1px solid var(--c-b)",
              borderRadius: "10px",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Github className="h-4 w-4" />
            GitHub 
          </a>
        </div>

        {/* Zigzag */}
        <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
          {projects.map((p, i) => (
            <ZigRow key={p.name} project={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
