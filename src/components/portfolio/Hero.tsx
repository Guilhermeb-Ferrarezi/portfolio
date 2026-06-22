import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/i18n/I18nContext";

gsap.registerPlugin(ScrollTrigger);

class TextScramble {
  private el: HTMLElement;
  private chars: string;
  private queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>;
  private frame: number;
  private raf: number;
  private resolve!: () => void;
  update: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#@abcdefghijklmnopqrstuvwxyz01";
    this.queue = [];
    this.frame = 0;
    this.raf = 0;
    this.update = this._update.bind(this);
  }

  setText(newText: string) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const p = new Promise<void>((r) => (this.resolve = r));
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] ?? "";
      const to = newText[i] ?? "";
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * 12) + 4;
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.update();
    return p;
  }

  private _update() {
    let done = 0;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < this.queue.length; i++) {
      const q = this.queue[i];
      if (this.frame >= q.end) {
        done++;
        frag.appendChild(document.createTextNode(q.to));
      } else if (this.frame >= q.start) {
        if (!q.char || Math.random() < 0.28) {
          q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        const span = document.createElement("span");
        span.style.color = "var(--c-muted)";
        span.textContent = q.char;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(q.from));
      }
    }
    this.el.replaceChildren(frag);
    if (done === this.queue.length) {
      this.resolve();
    } else {
      this.raf = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }
}

const NAME = ["Guilherme", "Ferrarezi"];

function readVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function Hero() {
  const { t } = useT();
  const flowRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLCanvasElement>(null);
  const cycleRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const flow = flowRef.current;
    const nameCv = nameRef.current;
    if (!flow || !nameCv) return;
    const fctx = flow.getContext("2d")!;
    const nctx = nameCv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Traços/partículas em branco no dark, preto no light (segue o texto do tema)
    let ink: [number, number, number] = hexToRgb(readVar("--c-fg", "#f0f0f0"));
    let bg: [number, number, number] = hexToRgb(readVar("--c-bg", "#070707"));
    const themeObs = new MutationObserver(() => {
      ink = hexToRgb(readVar("--c-fg", "#f0f0f0"));
      bg = hexToRgb(readVar("--c-bg", "#070707"));
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let W = 0, H = 0;
    let flowPts: { x: number; y: number }[] = [];
    let nameParts: { x: number; y: number; tx: number; ty: number }[] = [];
    let dot = 3;
    let lastW = 0, lastH = 0;
    let tt = 0;
    const FLOW_N = reduced ? 0 : 200;

    function buildName() {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d")!;
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      // fonte maior proporcionalmente no mobile, mas reduzida até caber na largura
      let fs = W < 600 ? W * 0.18 : Math.min(W * 0.12, 158);
      o.font = `900 ${fs}px "Space Grotesk", sans-serif`;
      const maxW = W * 0.9;
      const tw = Math.max(o.measureText(NAME[0]).width, o.measureText(NAME[1]).width);
      if (tw > maxW) {
        fs = (fs * maxW) / tw; // encolhe pra "Guilherme"/"Ferrarezi" não estourar
        o.font = `900 ${fs}px "Space Grotesk", sans-serif`;
      }
      o.fillText(NAME[0], W / 2, H / 2 - fs * 0.5);
      o.fillText(NAME[1], W / 2, H / 2 + fs * 0.52);
      const d = o.getImageData(0, 0, W, H).data;
      // densidade proporcional ao tamanho (mais pontos por letra = legível)
      const gap = Math.max(3, Math.round(fs / 26));
      dot = gap >= 5 ? 3 : 2;
      const targets: [number, number][] = [];
      for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) {
        if (d[(y * W + x) * 4 + 3] > 128) targets.push([x, y]);
      }
      nameParts = targets.map(([x, y]) => ({ x: Math.random() * W, y: Math.random() * H, tx: x, ty: y }));
    }

    function resize() {
      const newW = window.innerWidth, newH = window.innerHeight;
      // no mobile a barra de URL muda só a altura ao rolar — ignora (senão o nome "se desfaz")
      if (newW === lastW && Math.abs(newH - lastH) < 140 && nameParts.length) return;
      lastW = newW; lastH = newH;
      W = flow!.width = nameCv!.width = newW;
      H = flow!.height = nameCv!.height = newH;
      fctx.clearRect(0, 0, W, H);
      flowPts = Array.from({ length: FLOW_N }, () => ({ x: Math.random() * W, y: Math.random() * H }));
      buildName();
    }
    resize();
    window.addEventListener("resize", resize);
    // reconstrói o nome quando a fonte carrega (senão usa fallback)
    document.fonts.ready.then(() => buildName());

    const mouse = { x: -999, y: -999 };
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    // Loop com cap de FPS
    const FPS = reduced ? 8 : 30;
    const interval = 1000 / FPS;
    let acc = 0, prev = performance.now();
    let rafId = 0, running = false, inView = true;

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      acc += now - prev; prev = now;
      if (acc < interval) return;
      acc = 0;
      const [r, g, b] = ink;

      // Flow field (traços) — rastro com a cor de fundo
      tt += 0.0022;
      fctx.fillStyle = `rgba(${bg[0]},${bg[1]},${bg[2]},0.085)`;
      fctx.fillRect(0, 0, W, H);
      fctx.strokeStyle = `rgba(${r},${g},${b},0.28)`;
      fctx.lineWidth = 1;
      for (const p of flowPts) {
        const a = Math.sin(p.x * 0.0024 + tt) * Math.cos(p.y * 0.0024 - tt) * Math.PI * 2;
        const nx = p.x + Math.cos(a) * 2, ny = p.y + Math.sin(a) * 2;
        fctx.beginPath();
        fctx.moveTo(p.x, p.y);
        fctx.lineTo(nx, ny);
        fctx.stroke();
        p.x = nx; p.y = ny;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) { p.x = Math.random() * W; p.y = Math.random() * H; }
      }

      // Nome em partículas
      nctx.clearRect(0, 0, W, H);
      nctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
      for (const p of nameParts) {
        p.x += (p.tx - p.x) * 0.09;
        p.y += (p.ty - p.y) * 0.09;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, md = Math.hypot(dx, dy);
        if (md < 80) { p.x += (dx / md) * 4; p.y += (dy / md) * 4; }
        nctx.fillRect(p.x, p.y, dot, dot);
      }
    };

    const start = () => { if (running) return; running = true; prev = performance.now(); rafId = requestAnimationFrame(frame); };
    const stop = () => { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !document.hidden) start(); else stop();
    }, { threshold: 0 });
    io.observe(flow);

    const onVis = () => { if (document.hidden) stop(); else if (inView) start(); };
    document.addEventListener("visibilitychange", onVis);
    start();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to("#hero-badge", { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .to("#hero-sub", { opacity: 1, y: 0, duration: 0.7 }, 0.9)
        .to("#hero-act", { opacity: 1, y: 0, duration: 0.6 }, 1.1)
        .to("#hero-scroll", { opacity: 1, duration: 0.8 }, 1.5);

      const arrowTl = gsap.timeline({ repeat: -1, delay: 2.2 });
      arrowTl
        .to(".hero-arrow", { opacity: 0.75, y: 4, duration: 0.4, stagger: 0.16, ease: "power2.in" })
        .to(".hero-arrow", { opacity: 0.08, y: 0, duration: 0.4, stagger: { from: "end", each: 0.16 }, ease: "power2.out" })
        .to({}, { duration: 0.5 });

      ScrollTrigger.create({ trigger: sectionRef.current!, start: "top top", end: "+=38%", pin: true, anticipatePin: 1 });

      gsap.to("#hero-content-inner", {
        y: -90, opacity: 0, ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top top", end: "+=32%", scrub: 2 },
      });
      gsap.to("#hero-scroll", {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top top", end: "+=18%", scrub: 1 },
      });
    });

    return () => {
      stop();
      io.disconnect();
      themeObs.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      ctx.revert();
    };
  }, []);

  // Ciclo do badge (frases traduzidas) — efeito próprio: troca de idioma NÃO
  // recria o canvas, então o nome em partículas não "esfarela".
  useEffect(() => {
    const el = cycleRef.current;
    if (!el) return;
    const phrases = t.hero.phrases;
    const fx = new TextScramble(el);
    let idx = 0;
    let timer = 0;
    let cancelled = false;
    const next = () => {
      if (cancelled) return;
      idx = (idx + 1) % phrases.length;
      fx.setText(phrases[idx]).then(() => { if (!cancelled) timer = window.setTimeout(next, 2600); });
    };
    el.textContent = phrases[0];
    timer = window.setTimeout(next, 2600);
    return () => { cancelled = true; clearTimeout(timer); fx.stop(); };
  }, [t]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden", background: "var(--c-bg)" }}
    >
      {/* Flow field (traços) */}
      <canvas ref={flowRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
      {/* Nome em partículas */}
      <canvas ref={nameRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} />

      {/* Gradiente de profundidade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, transparent 35%, var(--c-bg) 100%), linear-gradient(to bottom, transparent 60%, var(--c-bg) 96%)",
        }}
      />

      {/* Conteúdo: badge no topo, sub + CTAs embaixo (nome fica no centro, via canvas) */}
      <div
        id="hero-content-inner"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
          padding: "17vh 24px 14vh",
          pointerEvents: "none",
        }}
      >
        {/* Badge cycling */}
        <div
          id="hero-badge"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "clamp(0.85rem,1.4vw,1rem)",
            opacity: 0,
            transform: "translateY(12px)",
            letterSpacing: ".02em",
            height: "1.8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            userSelect: "none",
          }}
        >
          <span style={{ color: "var(--c-mid)", fontWeight: 400 }}>{t.hero.badge_prefix}</span>
          <span ref={cycleRef} style={{ color: "var(--c-fg)", minWidth: "140px", display: "inline-block", textAlign: "left" }}>
            sites e sistemas
          </span>
          <span
            style={{ display: "inline-block", width: "2px", height: "1em", background: "var(--c-p)", animation: "hero-cursor 1.1s step-end infinite", verticalAlign: "middle", flexShrink: 0 }}
          />
        </div>

        {/* Sub + CTAs */}
        <div>
          <p
            id="hero-sub"
            style={{
              fontSize: "clamp(0.95rem,1.6vw,1.1rem)",
              color: "var(--c-muted)",
              maxWidth: "400px",
              margin: "0 auto 30px",
              lineHeight: 1.6,
              opacity: 0,
              transform: "translateY(16px)",
            }}
          >
            {t.hero.sub}
          </p>

          <div
            id="hero-act"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap", opacity: 0, transform: "translateY(16px)", pointerEvents: "auto" }}
          >
            <a
              href="#projetos"
              style={{ padding: "12px 24px", background: "var(--c-p)", color: "var(--c-onp)", borderRadius: "10px", fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", transition: "opacity .15s, transform .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = ".84"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
            >
              {t.hero.cta_projects}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>

            <a
              href="https://wa.me/5516996129511"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "11px 20px", background: "var(--c-s)", color: "var(--c-fg)", border: "1px solid var(--c-b)", borderRadius: "10px", fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", backdropFilter: "blur(8px)", transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-bh)"; e.currentTarget.style.background = "var(--c-sh)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-b)"; e.currentTarget.style.background = "var(--c-s)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411z" /></svg>
              WhatsApp
            </a>

            <a
              href="https://github.com/Guilhermeb-Ferrarezi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "11px 20px", background: "var(--c-s)", color: "var(--c-fg)", border: "1px solid var(--c-b)", borderRadius: "10px", fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", backdropFilter: "blur(8px)", transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-bh)"; e.currentTarget.style.background = "var(--c-sh)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-b)"; e.currentTarget.style.background = "var(--c-s)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Setas de scroll em cascata */}
      <div
        id="hero-scroll"
        style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: "0px", opacity: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <svg key={i} className="hero-arrow" width="26" height="16" viewBox="0 0 26 16" fill="none" style={{ opacity: 0.08, display: "block" }}>
            <path d="M2 2l11 11L24 2" stroke="var(--c-p)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
    </section>
  );
}
