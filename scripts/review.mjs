import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
const base = "http://localhost:4174/moonwalk-art-gallery/";
await mkdir("docs/review/raw", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "?time=0");
await page.locator(".loading").waitFor({ state: "detached" });
if (await page.locator(".error").count())
  throw Error(await page.locator(".error").innerText());
const times = [
  1,
  2,
  3,
  5,
  7.1,
  9.15,
  11.2,
  13.25,
  15.3,
  17.35,
  19.4,
  21.45,
  23.5,
  25.55,
  27.6,
  29.65,
  31.7,
  33.75,
  35.8,
  37.85,
  39.9,
  41.95,
  44,
  45,
  46,
  46.5,
  47,
  48,
  50,
  51.5,
  51.9,
  ...[6.2, 10.3, 32.8, 36.9, 41, 43.1].flatMap((t) => [t - 0.2, t, t + 0.2]),
];
await page.addStyleTag({
  content: ".controls,.catalogue,.show-controls{visibility:hidden}",
});
for (const time of times) {
  await page.locator("#time").evaluate((input, time) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(input, String(time));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, time);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `docs/review/raw/t-${time.toFixed(2)}.png` });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "?time=48");
await page.locator(".loading").waitFor({ state: "detached" });
await page.waitForTimeout(200);
await page.screenshot({ path: "docs/review/mobile-grid.png", fullPage: true });
await page.goto(base + "?time=44");
await page.locator(".loading").waitFor({ state: "detached" });
await page.screenshot({ path: "docs/review/mobile-work.png", fullPage: true });
await page.setViewportSize({ width: 1280, height: 480 });
await page.goto(base + "?time=48");
await page.locator(".loading").waitFor({ state: "detached" });
await page.screenshot({
  path: "docs/review/short-desktop.png",
  fullPage: true,
});
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(base + "?time=47.5");
await page.locator(".loading").waitFor({ state: "detached" });
await page.getByRole("button", { name: "Play", exact: true }).click();
const performanceData = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const times = [];
      let last = performance.now();
      const stop = last + 3000;
      function frame(now) {
        times.push(now - last);
        last = now;
        if (now < stop) requestAnimationFrame(frame);
        else {
          times.sort((a, b) => a - b);
          resolve({
            frames: times.length,
            meanMs: times.reduce((a, b) => a + b, 0) / times.length,
            p95Ms: times[Math.floor(times.length * 0.95)],
            userAgent: navigator.userAgent,
          });
        }
      }
      requestAnimationFrame(frame);
    }),
);
await writeFile(
  "docs/review/performance.json",
  JSON.stringify(
    {
      date: new Date().toISOString(),
      host: {
        platform: os.platform(),
        arch: os.arch(),
        cpu: os.cpus()[0].model,
      },
      performanceData,
      errors,
    },
    null,
    2,
  ),
);
await page.close();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: "docs/review/raw", size: { width: 960, height: 540 } },
});
const recording = await context.newPage();
await recording.goto(base + "?time=0&controls=0");
await recording.locator(".loading").waitFor({ state: "detached" });
await recording.keyboard.press("Space");
await recording.waitForTimeout(27000);
await recording.waitForTimeout(27000);
const finalTime = await recording.locator("#time").inputValue();
if (Number(finalTime) < 52)
  throw Error(`Playback did not reach the end: ${finalTime}`);
await context.close();
await recording.video().saveAs("docs/review/playback.webm");
await browser.close();
console.log(
  "Captured every control frame, six transitions, responsive views, full playback and final-grid frame times.",
);
