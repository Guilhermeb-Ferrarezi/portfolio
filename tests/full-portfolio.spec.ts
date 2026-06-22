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

test.describe("Portfolio completo", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await skipPreloader(page);
  });

  test("hero inicial", async ({ page }) => {
    await page.screenshot({ path: "tests/screenshots/full-01-hero.png" });
  });

  test("hero pin mid-scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: "tests/screenshots/full-02-hero-pin.png" });
  });

  test("about mid", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.2, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: "tests/screenshots/full-03-about.png" });
  });

  test("stack mid scrub", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("stack")?.scrollIntoView({ behavior: "instant" });
    });
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/full-04-stack.png" });
  });

  test("projects horizontal scroll", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("projetos")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/full-05-projects.png" });
  });

  test("contact", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("contato")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/full-06-contact.png" });
  });
});
