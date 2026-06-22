import { useEffect, useRef } from "react";
import * as THREE from "three";
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
        span.style.color = "rgba(139,92,246,0.65)";
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
}

const LINE1 = "Guilherme";
const LINE2 = "Ferrarezi.";

export function Hero() {
  const { t } = useT();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const cycleRef   = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070707, 0.032);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 4, 11);
    camera.lookAt(0, 0, 0);

    const GS = 24, GN = 44;
    const gridGeo = new THREE.PlaneGeometry(GS, GS, GN, GN);
    const gridMat = new THREE.ShaderMaterial({
      uniforms: { u_time: { value: 0 } },
      transparent: true,
      wireframe: true,
      vertexShader: `
        uniform float u_time;
        void main() {
          vec3 p = position;
          p.z = sin(p.x * 0.38 + u_time * 0.5) * cos(p.y * 0.38 + u_time * 0.4) * 0.65;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `void main() { gl_FragColor = vec4(0.357, 0.129, 0.714, 0.09); }`,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -3;
    scene.add(grid);

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext("2d")!;
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(210,180,255,1)");
    grad.addColorStop(0.35, "rgba(139,92,246,0.6)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const PC = 320;
    const pp = new Float32Array(PC * 3);
    for (let i = 0; i < PC; i++) {
      const r = 5 + Math.random() * 12;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pp[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      pp[i * 3 + 1] = (Math.random() - 0.35) * 9;
      pp[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.07, map: sprite, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0.8,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    const icoGeo  = new THREE.IcosahedronGeometry(1.2, 1);
    const icoMat  = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.09 });
    const ico     = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(3.5, 1.2, -1);
    scene.add(ico);

    const ico2Geo = new THREE.IcosahedronGeometry(0.7, 1);
    const ico2Mat = new THREE.MeshBasicMaterial({ color: 0x6d28d9, wireframe: true, transparent: true, opacity: 0.07 });
    const ico2    = new THREE.Mesh(ico2Geo, ico2Mat);
    ico2.position.set(-4, -0.5, -2);
    scene.add(ico2);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let heroScrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => { heroScrollY = window.scrollY; };
    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId = 0;
    let running = false;
    let inView = true;
    let elapsed = 0;
    let acc = 0;
    const FPS = 24;
    const interval = 1 / FPS;

    const frame = () => {
      rafId = requestAnimationFrame(frame);
      acc += clock.getDelta();
      if (acc < interval) return; // limita a ~30fps
      elapsed += acc;
      acc = 0;
      const t = elapsed;

      gridMat.uniforms.u_time.value = t;

      ico.rotation.x  = t * 0.14;
      ico.rotation.y  = t * 0.21;
      ico2.rotation.x = t * 0.09;
      ico2.rotation.y = -t * 0.15;

      const sp = Math.min(heroScrollY / window.innerHeight, 1);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 1.3;
      camera.position.y = 4 + mouse.y * 0.4 + sp * 2.5;
      camera.position.z = 11 - sp * 4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      clock.getDelta(); // descarta o gap acumulado enquanto pausado
      rafId = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // Pausa o render quando o hero sai da viewport (economia de GPU)
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Pausa quando a aba não está visível
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    const startCycle = () => {
      const el = cycleRef.current;
      if (!el) return;
      const phrases = t.hero.phrases;
      const fx = new TextScramble(el);
      let idx = 0;
      const next = () => {
        idx = (idx + 1) % phrases.length;
        fx.setText(phrases[idx]).then(() => setTimeout(next, 2600));
      };
      setTimeout(next, 2600);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, onComplete: startCycle });
      tl.to("#hero-badge",       { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .to("#hero-l1 .hchar",   { y: "0%", duration: 1.1, stagger: 0.038 }, 0.55)
        .to("#hero-l2 .hchar",   { y: "0%", duration: 1.1, stagger: 0.038 }, 0.72)
        .to("#hero-sub",         { opacity: 1, y: 0, duration: 0.7 }, 1.3)
        .to("#hero-act",         { opacity: 1, y: 0, duration: 0.6 }, 1.55)
        .to("#hero-scroll",      { opacity: 1, duration: 0.8 }, 1.9);

      // Setas em cascata — disparam depois que o hero aparece
      const arrowTl = gsap.timeline({ repeat: -1, delay: 2.4 });
      arrowTl
        .to(".hero-arrow", {
          opacity: 0.75,
          y: 4,
          duration: 0.4,
          stagger: 0.16,
          ease: "power2.in",
        })
        .to(".hero-arrow", {
          opacity: 0.08,
          y: 0,
          duration: 0.4,
          stagger: { from: "end", each: 0.16 },
          ease: "power2.out",
        })
        .to({}, { duration: 0.5 });

      // Pin do hero — scroll travel curto antes de seguir pro About
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: "+=38%",
        pin: true,
        anticipatePin: 1,
      });

      // Conteúdo sobe enquanto câmera avança
      gsap.to("#hero-content-inner", {
        y: -90,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: "+=32%",
          scrub: 2,
        },
      });

      // Setas somem no início do scroll
      gsap.to("#hero-scroll", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: "+=18%",
          scrub: 1,
        },
      });
    });

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      renderer.dispose();
      [gridGeo, gridMat, pGeo, pMat, icoGeo, icoMat, ico2Geo, ico2Mat, sprite].forEach((o) => o.dispose());
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        background: "#030303",
      }}
    >
      {/* Three.js canvas — preenche a seção inteira */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Gradiente de profundidade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(7,7,7,0.55) 100%), linear-gradient(to bottom, rgba(7,7,7,0.2) 0%, transparent 25%, transparent 70%, rgba(7,7,7,0.95) 100%)",
        }}
      />

      {/* Conteúdo principal */}
      <div
        id="hero-content-inner"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        {/* Badge cycling */}
        <div
          id="hero-badge"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "clamp(0.85rem,1.4vw,1rem)",
            marginBottom: "28px",
            opacity: 0,
            letterSpacing: ".02em",
            height: "1.8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            userSelect: "none",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.22)", fontWeight: 400 }}>{t.hero.badge_prefix}</span>
          <span
            ref={cycleRef}
            style={{ color: "rgba(255,255,255,0.75)", minWidth: "140px", display: "inline-block", textAlign: "left" }}
          >
            sites e sistemas
          </span>
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              background: "#8b5cf6",
              animation: "hero-cursor 1.1s step-end infinite",
              verticalAlign: "middle",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Título */}
        <h1
          style={{
            fontSize: "clamp(3.5rem,9vw,8rem)",
            fontWeight: 900,
            lineHeight: 0.93,
            letterSpacing: "-.045em",
            color: "#f0f0f0",
            marginBottom: "24px",
            fontFamily: "Space Grotesk, sans-serif",
            textAlign: "center",
          }}
        >
          <span id="hero-l1" style={{ display: "block", overflow: "hidden" }}>
            {LINE1.split("").map((ch, i) => (
              <span key={i} className="hchar" style={{ display: "inline-block", transform: "translateY(110%)" }}>
                {ch}
              </span>
            ))}
          </span>
          <span id="hero-l2" style={{ display: "block", overflow: "hidden" }}>
            {LINE2.split("").map((ch, i) => (
              <span key={i} className="hchar" style={{ display: "inline-block", transform: "translateY(110%)" }}>
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          id="hero-sub"
          style={{
            fontSize: "clamp(0.95rem,1.6vw,1.1rem)",
            color: "#666",
            maxWidth: "380px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
            opacity: 0,
            transform: "translateY(16px)",
            textAlign: "center",
          }}
        >
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div
          id="hero-act"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            opacity: 0,
            transform: "translateY(16px)",
          }}
        >
          <a
            href="#projetos"
            style={{
              padding: "12px 24px",
              background: "#8b5cf6",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "opacity .15s, transform .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = ".84"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
          >
            {t.hero.cta_projects}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="https://wa.me/5516996129511"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "11px 20px",
              background: "rgba(255,255,255,0.05)",
              color: "#f0f0f0",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(8px)",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411z" />
            </svg>
            WhatsApp
          </a>

          <a
            href="https://github.com/Guilhermeb-Ferrarezi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "11px 20px",
              background: "rgba(255,255,255,0.05)",
              color: "#f0f0f0",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(8px)",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Setas de scroll em cascata */}
      <div
        id="hero-scroll"
        style={{
          position: "absolute",
          bottom: "36px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          opacity: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="hero-arrow"
            width="26"
            height="16"
            viewBox="0 0 26 16"
            fill="none"
            style={{ opacity: 0.08, display: "block" }}
          >
            <path
              d="M2 2l11 11L24 2"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    </section>
  );
}
