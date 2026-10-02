import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (e) => console.error(e));
await page.goto("http://localhost:4174/gulp-starter-basic/?time=50&controls=0");
await page.locator(".loading").waitFor({ state: "detached" });
await page.screenshot({ path: "docs/review/overview-50.png" });
await page.goto(
  "http://localhost:4174/gulp-starter-basic/?time=31.7&controls=0",
);
await page.locator(".loading").waitFor({ state: "detached" });
await page.screenshot({ path: "docs/review/neon.png" });
await browser.close();
