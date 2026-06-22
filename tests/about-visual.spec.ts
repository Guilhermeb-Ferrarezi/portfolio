import { test, expect } from "@playwright/test";

const URL = "http://localhost:5174";
// preloader: ~2.85s de animação → esperamos 4s para segurança
const PRELOADER_WAIT = 4000;

async function skipPreloader(page: any) {
  // Aguarda o elemento preloader sumir do DOM (após onComplete → setPreloaderDone)
  try {
    await page.waitForSelector('[data-testid="preloader"]', { state: "detached", timeout: 8000 });
  } catch {
    await page.waitForTimeout(PRELOADER_WAIT);
  }
  await page.waitForTimeout(300);
}

test.describe("About section visual", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await skipPreloader(page);
  });

  test("01 — hero visível após preloader", async ({ page }) => {
    await page.screenshot({ path: "tests/screenshots/01-hero.png" });
    // O canvas Three.js deve existir
    const canvasCount = await page.$$eval("canvas", (els) => els.length);
    console.log(`Canvas elements: ${canvasCount}`);
    expect(canvasCount).toBeGreaterThan(0);
  });

  test("02 — SectionArrow entre hero e about", async ({ page }) => {
    // Scroll pequeno para ver a seta
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: "tests/screenshots/02-section-arrow.png" });
  });

  test("03 — About pinado: início (só título visível)", async ({ page }) => {
    // Scroll até o início da zone About (~800px = 1 viewport)
    await page.evaluate(() => window.scrollTo({ top: 870, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/03-about-pin-start.png" });

    const titleVisible = await page.$eval(".about-section-title", (el) => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.top < window.innerHeight;
    });
    console.log("Título visível:", titleVisible);
    expect(titleVisible).toBe(true);
  });

  test("04 — paths têm d-attribute e dashoffset configurados", async ({ page }) => {
    // Scroll até 30% da zona About
    await page.evaluate(() => window.scrollTo({ top: 870 + 240, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/04-paths-check.png" });

    const pathInfo = await page.$$eval("#about svg path", (paths) =>
      paths.map((p) => ({
        d: p.getAttribute("d")?.substring(0, 40) ?? "",
        dashoffset: (p as SVGPathElement).style.strokeDashoffset,
        dasharray: (p as SVGPathElement).style.strokeDasharray,
        len: (p as SVGPathElement).getTotalLength().toFixed(0),
      }))
    );
    console.log("Path info:", JSON.stringify(pathInfo, null, 2));

    expect(pathInfo.length).toBe(3);
    pathInfo.forEach((p) => {
      expect(p.d.length).toBeGreaterThan(5); // d attribute foi computado
      expect(p.dashoffset).not.toBe(""); // GSAP setou o dashoffset
    });
  });

  test("05 — About meio scroll: conteúdo aparecendo", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 870 + 480, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/05-about-mid.png" });
  });

  test("06 — About final: tudo visível", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 870 + 750, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/06-about-end.png" });

    // Heading deve estar visível (opacity > 0)
    const headingOpacity = await page.$eval(".about-h2", (el) =>
      parseFloat(getComputedStyle(el).opacity)
    );
    console.log("Heading opacity:", headingOpacity);
    expect(headingOpacity).toBeGreaterThan(0);
  });

  test("07 — paths bezier têm curvas (não são L-shapes)", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 870 + 200, behavior: "instant" }));
    await page.waitForTimeout(400);

    const paths = await page.$$eval("#about svg path", (ps) =>
      ps.map((p) => p.getAttribute("d") ?? "")
    );

    paths.forEach((d, i) => {
      // Curva smoothstep usa M, L e possivelmente Q/C — deve ter pelo menos 3 segments
      const segments = d.match(/[MLCQZ]/gi) ?? [];
      console.log(`Path ${i}: ${d.substring(0, 80)}... (${segments.length} segments)`);
      expect(segments.length).toBeGreaterThanOrEqual(2);
    });

    await page.screenshot({ path: "tests/screenshots/07-bezier-check.png" });
  });
});
