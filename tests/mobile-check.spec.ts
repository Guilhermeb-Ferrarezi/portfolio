import { test } from "@playwright/test";

const URL = "http://localhost:5174";

async function skipPreloader(page: any) {
  try {
    await page.waitForSelector('[data-testid="preloader"]', { state: "detached", timeout: 8000 });
  } catch {
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(300);
}

// Testa em 390×844 (iPhone 14)
test.describe("Mobile 390px", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(URL);
    await skipPreloader(page);
  });

  test("hero mobile", async ({ page }) => {
    await page.screenshot({ path: "tests/screenshots/m-01-hero.png" });
  });

  test("about pin start", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight + 50, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/m-02-about-start.png" });
  });

  test("about mid scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight + 400, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/m-03-about-mid.png" });
  });

  test("about end scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight + 800, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/m-04-about-end.png" });
  });
});
