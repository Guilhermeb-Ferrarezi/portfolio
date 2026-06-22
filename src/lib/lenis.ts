import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 1.8,
  });

  // Sincroniza Lenis com o GSAP ticker para que ScrollTrigger funcione corretamente
  gsap.ticker.add((time) => {
    lenis!.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Informa o ScrollTrigger a cada scroll do Lenis
  lenis.on("scroll", ScrollTrigger.update);

  return lenis;
}

export function destroyLenis() {
  if (!lenis) return;
  lenis.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}
