import { useEffect, useRef } from "react";
import { tsParticles, type Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { loadTextShape } from "@tsparticles/shape-text";

let engineLoaded = false;

async function ensureEngine() {
  if (engineLoaded) return;
  await loadSlim(tsParticles);
  await loadTextShape(tsParticles);
  engineLoaded = true;
}

export function StackBackground() {
  const idRef = useRef("stack-particles-" + Math.random().toString(36).slice(2));

  useEffect(() => {
    const id = idRef.current;
    let destroyed = false;
    let container: Container | undefined;

    ensureEngine().then(() => {
      if (destroyed) return;
      return tsParticles.load({
        id,
        options: {
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            number: { value: 45, density: { enable: true } },
            color: { value: ["#8b5cf6", "#a78bfa", "#7c3aed", "#c4b5fd"] },
            shape: {
              type: "text",
              options: {
                text: {
                  value: ["{}", "</>", "=>", "//", "fn()", "[]", "const", "async", "::", "&&", "type", "01"],
                  font: "JetBrains Mono, monospace",
                  weight: "400",
                  style: "",
                },
              },
            },
            opacity: {
              value: { min: 0.07, max: 0.2 },
              animation: { enable: true, speed: 0.3, sync: false },
            },
            size: { value: { min: 10, max: 16 } },
            move: {
              enable: true,
              speed: { min: 0.5, max: 1.0 },
              direction: "bottom",
              straight: false,
              random: true,
              outModes: { default: "out" },
            },
            rotate: {
              value: { min: -20, max: 20 },
              animation: { enable: true, speed: 2, sync: false },
            },
          },
          detectRetina: true,
        },
      });
    }).then((loaded) => {
      if (destroyed) {
        loaded?.destroy();
        return;
      }
      container = loaded;
    });

    return () => {
      destroyed = true;
      container?.destroy();
    };
  }, []);

  return (
    <div
      id={idRef.current}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
