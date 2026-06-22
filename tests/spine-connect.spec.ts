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

test("spine connection — about bottom → section arrow → techtree", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(URL);
  await skipPreloader(page);

  // Scroll até o final do About (onde c3 é visível)
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.8, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tests/screenshots/spine-01-about-end.png" });

  // Scroll um pouco mais — vê o SectionArrow entre About e Stack
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 3.05, behavior: "instant" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: "tests/screenshots/spine-02-transition.png" });

  // Scroll até o início do Stack
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 3.2, behavior: "instant" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: "tests/screenshots/spine-03-stack-top.png" });
});
