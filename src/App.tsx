import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sun, Moon } from "lucide-react";
import { About } from "@/components/portfolio/About";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { Preloader } from "@/components/portfolio/Preloader";
import { SectionArrow } from "@/components/portfolio/SectionArrow";
import { TechTree } from "@/components/portfolio/TechTree";
import { I18nProvider, useT } from "@/i18n/I18nContext";
import {Snowfall} from "react-snowfall"

gsap.registerPlugin(ScrollTrigger);

function TopControls({ isLight, toggleTheme }: { isLight: boolean; toggleTheme: () => void }) {
  const { locale, setLocale } = useT();

  const btnBase: React.CSSProperties = {
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    border: "1px solid var(--c-b)",
    background: "var(--c-ov)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    color: "var(--c-muted)",
    cursor: "pointer",
    transition: "border-color .15s, color .15s",
  };

  const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--c-bh)";
    e.currentTarget.style.color = "var(--c-fg)";
  };
  const onLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--c-b)";
    e.currentTarget.style.color = "var(--c-muted)";
  };

  return (
    <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 998, display: "flex", gap: "8px" }}>
      {/* i18n */}
      <button
        onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
        aria-label="Trocar idioma"
        style={{ ...btnBase, padding: "0 14px", gap: "6px", fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 500, letterSpacing: ".08em" }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <span style={{ color: locale === "pt" ? "var(--c-p)" : "var(--c-muted)" }}>PT</span>
        <span style={{ opacity: 0.3 }}>/</span>
        <span style={{ color: locale === "en" ? "var(--c-p)" : "var(--c-muted)" }}>EN</span>
      </button>

      {/* Tema */}
      <button
        onClick={toggleTheme}
        aria-label={isLight ? "Modo escuro" : "Modo claro"}
        style={{ ...btnBase, width: "38px" }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {isLight ? <Moon size={15} /> : <Sun size={15} />}
      </button>
    </div>
  );
}

function AppInner() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  // A side-line (spine reta do circuito) só aparece em About + Stack:
  // escondida no Hero (canvas 3D) e em Projetos (que tem spine própria).
  useEffect(() => {
    if (!preloaderDone) return;
    const line = document.querySelector<HTMLElement>(".side-line");
    const about = document.getElementById("about");
    const projetos = document.getElementById("projetos");
    if (!line || !about || !projetos) return;

    line.style.opacity = "0"; // Hero: escondida

    // Aparece ao entrar no About (vindo do Hero), some ao voltar pro Hero
    const t1 = ScrollTrigger.create({
      trigger: about,
      start: "top 75%",
      onEnter: () => { line.style.opacity = "0.3"; },
      onLeaveBack: () => { line.style.opacity = "0"; },
    });
    // Some ao entrar em Projetos (que tem spine própria), reaparece ao voltar pro Stack
    const t2 = ScrollTrigger.create({
      trigger: projetos,
      start: "top 65%",
      onEnter: () => { line.style.opacity = "0"; },
      onLeaveBack: () => { line.style.opacity = "0.3"; },
    });

    return () => { t1.kill(); t2.kill(); };
  }, [preloaderDone]);

  return (
    <div style={{ position: "relative" }}>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
        
      {/* Spine global — linha-mãe contínua no eixo do circuito (x90), sempre visível */}
      <div
        className="side-line"
        style={{
          position: "fixed",
          left: "calc(max(0px, (100vw - 1100px) / 2) + 90px)",
          top: 0,
          bottom: 0,
          width: "1.5px",
          background: "linear-gradient(to bottom, transparent 0%, var(--c-p) 5%, var(--c-p) 95%, transparent 100%)",
          opacity: 0.3,
          zIndex: 4,
          pointerEvents: "none",
          transition: "opacity .4s ease",
        }}
      />

      <TopControls isLight={isLight} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <TechTree />
      <Projects />
      <Snowfall color="purple" snowflakeCount={120}/>
    </div>
  );
}

export function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
