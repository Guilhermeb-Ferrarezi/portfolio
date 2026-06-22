import { test } from "@playwright/test";

const URL = "http://localhost:5173";

async function skipPreloader(page: any) {
  try {
    await page.waitForSelector('[data-testid="preloader"]', { state: "detached", timeout: 8000 });
  } catch {
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(400);
}

async function scrollToId(page: any, id: string) {
  await page.evaluate((sel: string) => {
    document.getElementById(sel)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, id);
  await page.waitForTimeout(1800);
}

test.describe("Desktop 1280", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await skipPreloader(page);
  });

  test("hero", async ({ page }) => {
    await page.mouse.move(900, 300);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "tests/screenshots/new-pc-00-hero.png" });
  });

  test("hero troca idioma", async ({ page }) => {
    await page.mouse.move(900, 320);
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Trocar idioma" }).click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: "tests/screenshots/new-pc-00-hero-i18n.png" });
  });

  test("hero light", async ({ page }) => {
    await page.getByRole("button", { name: /Modo claro/i }).click();
    await page.mouse.move(900, 320);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "tests/screenshots/new-pc-00-hero-light.png" });
  });

  test("about", async ({ page }) => {
    await scrollToId(page, "about");
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "instant" }));
    await page.waitForTimeout(900);
    await page.screenshot({ path: "tests/screenshots/new-pc-00b-about.png" });
  });

  test("stack", async ({ page }) => {
    await scrollToId(page, "stack");
    await page.screenshot({ path: "tests/screenshots/new-pc-01-stack.png" });
  });

  test("transicao stack-projetos", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.evaluate(() => window.scrollBy({ top: -420, behavior: "instant" }));
    await page.waitForTimeout(900);
    await page.screenshot({ path: "tests/screenshots/new-pc-015-transicao.png" });
  });

  test("transicao varios pontos", async ({ page }) => {
    const baseTop = await page.evaluate(() => {
      const el = document.getElementById("projetos");
      return el ? window.scrollY + el.getBoundingClientRect().top : 0;
    });
    // chega em projetos por baixo (simula rolar pra baixo) e sobe em passos,
    // parando em cada ponto para conferir se a linha fica completa
    for (const [i, off] of [-650, -500, -350, -200, -50].entries()) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), baseTop + off);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `tests/screenshots/new-pc-tr-${i}.png` });
    }
  });

  test("projetos topo", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.screenshot({ path: "tests/screenshots/new-pc-02-projetos-top.png" });
  });

  test("projetos meio", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.evaluate(() => window.scrollBy({ top: 700, behavior: "instant" }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: "tests/screenshots/new-pc-03-projetos-mid.png" });
  });

  test("projetos fim", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.evaluate(() => window.scrollBy({ top: 1500, behavior: "instant" }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: "tests/screenshots/new-pc-04-projetos-end.png" });
  });

  test("projeto modal", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.locator(".zig-row").first().click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: "tests/screenshots/new-pc-05-modal.png" });
  });

  test("contato", async ({ page }) => {
    await scrollToId(page, "contato");
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "instant" }));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: "tests/screenshots/new-pc-07-contato.png" });
  });

  test("contato EN", async ({ page }) => {
    await page.getByRole("button", { name: "Trocar idioma" }).click();
    await page.waitForTimeout(300);
    await scrollToId(page, "contato");
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "instant" }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "tests/screenshots/new-pc-09-contato-en.png" });
  });

  test("transicao projetos-contato", async ({ page }) => {
    await page.evaluate(() => {
      const c = document.getElementById("contato");
      if (c) window.scrollTo({ top: window.scrollY + c.getBoundingClientRect().top - 240, behavior: "instant" });
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "tests/screenshots/new-pc-08-conn.png" });
  });

  test("screenshot fullscreen", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.locator(".zig-row").first().click();
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: /tela cheia/i }).first().click({ force: true });
    await page.waitForTimeout(600);
    await page.screenshot({ path: "tests/screenshots/new-pc-06-fullscreen.png" });
  });
});

test.describe("Mobile 390", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(URL);
    await skipPreloader(page);
  });

  test("stack", async ({ page }) => {
    await scrollToId(page, "stack");
    await page.screenshot({ path: "tests/screenshots/new-m-01-stack.png" });
  });

  test("projetos topo", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.screenshot({ path: "tests/screenshots/new-m-02-projetos-top.png" });
  });

  test("projetos meio", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: "instant" }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: "tests/screenshots/new-m-03-projetos-mid.png" });
  });

  test("projeto modal", async ({ page }) => {
    await scrollToId(page, "projetos");
    await page.locator(".zig-row").first().click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: "tests/screenshots/new-m-04-modal.png" });
  });
});
