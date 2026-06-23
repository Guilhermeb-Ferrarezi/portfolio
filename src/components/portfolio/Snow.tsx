import { useMemo } from "react";

// Neve em CSS puro: cada camada é um elemento com dezenas de flocos via box-shadow,
// rasterizado UMA vez e só transladado (translateY) — composição barata na GPU,
// sem canvas/rAF nem repintura de tela cheia a 60fps.
const COLOR = "#9a9a9a";

function makeShadows(n: number): string {
  return Array.from({ length: n }, () => {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    return `${x}vw ${y}vh 0 ${COLOR}`;
  }).join(", ");
}

export function Snow() {
  // 3 camadas com tamanho/velocidade diferentes pra dar profundidade
  const layers = useMemo(
    () => [
      { shadow: makeShadows(16), size: 2, dur: 17, op: 0.5 },
      { shadow: makeShadows(12), size: 3, dur: 23, op: 0.7 },
      { shadow: makeShadows(7), size: 4, dur: 31, op: 0.9 },
    ],
    [],
  );

  return (
    <div className="snow-wrap" aria-hidden="true">
      {layers.map((l, i) => (
        <div key={i} className="snow-col" style={{ animationDuration: `${l.dur}s`, opacity: l.op }}>
          <span className="snow-dot" style={{ width: l.size, height: l.size, boxShadow: l.shadow }} />
          <span className="snow-dot snow-dot--up" style={{ width: l.size, height: l.size, boxShadow: l.shadow }} />
        </div>
      ))}
    </div>
  );
}
