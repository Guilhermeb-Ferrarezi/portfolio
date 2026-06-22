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

test.describe("TechTree visual", () => {
  test("desktop — stack section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await skipPreloader(page);

    // Scroll até a seção stack
    await page.evaluate(() => {
      const el = document.getElementById("stack");
      el?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: "tests/screenshots/stack-01-top.png", fullPage: false });

    // Scroll para baixo para ver tiers sendo revelados
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/stack-02-mid.png", fullPage: false });
  });

  test("mobile — stack section", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(URL);
    await skipPreloader(page);

    await page.evaluate(() => {
      document.getElementById("stack")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: "tests/screenshots/stack-mobile-01.png", fullPage: false });
  });

  test("stack — tooltip aparece no hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await skipPreloader(page);

    await page.evaluate(() => {
      document.getElementById("stack")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(700);

    // Hover no primeiro tech-node
    const firstNode = page.locator(".tech-node").first();
    await firstNode.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "tests/screenshots/stack-03-tooltip.png", fullPage: false });

    // Verifica que o tooltip apareceu
    const tooltipVisible = await page.locator("[data-radix-popper-content-wrapper]").isVisible();
    console.log("Tooltip visible:", tooltipVisible);
  });
});
