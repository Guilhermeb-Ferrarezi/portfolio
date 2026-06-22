import { test } from "@playwright/test";

const URL = "http://localhost:5173";

async function skipPreloader(page: any) {
  try {
    await page.waitForSelector('[data-testid="preloader"]', { state: "detached", timeout: 8000 });
  } catch {
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(300);
}

async function enableLight(page: any) {
  // Define tema claro antes de navegar
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });
}

test.describe("Light mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await enableLight(page);
    await page.goto(URL);
    await skipPreloader(page);
  });

  test("hero — light", async ({ page }) => {
    await page.screenshot({ path: "tests/screenshots/light-01-hero.png" });
  });

  test("about — light", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/light-02-about.png" });
  });

  test("transição about→stack — light", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.8, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/light-03-transition.png" });
  });

  test("stack — light", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("stack")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/light-04-stack.png" });
  });

  test("stack mid scrub — light", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("stack")?.scrollIntoView({ behavior: "instant" });
    });
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/light-05-stack-mid.png" });
  });
});
