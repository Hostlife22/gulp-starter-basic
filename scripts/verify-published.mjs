import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const url = "https://hostlife22.github.io/gulp-starter-basic/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [],
  badResponses = [],
  external = [],
  assets = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("requestfailed", (r) =>
  errors.push(`${r.url()}: ${r.failure()?.errorText}`),
);
page.on("response", (r) => {
  if (r.status() >= 400)
    badResponses.push({ url: r.url(), status: r.status() });
  if (r.url().includes("/assets/") || r.url().includes("/audio/"))
    assets.push({ url: r.url(), status: r.status() });
});
page.on("request", (r) => {
  if (r.url().startsWith("http") && !r.url().startsWith(url))
    external.push(r.url());
});
const response = await page.goto(url + "?time=48", {
  waitUntil: "networkidle",
});
await page.locator(".loading").waitFor({ state: "detached" });
await page.waitForTimeout(200);
if (await page.locator(".error").count())
  errors.push(await page.locator(".error").innerText());
await page.screenshot({ path: "docs/review/published.png" });
await page.getByRole("button", { name: "Play", exact: true }).click();
await page.waitForFunction(() => {
  const audio = document.querySelector("audio");
  return audio && !audio.paused && audio.currentTime > 48;
});
const audioPlayback = await page.locator("audio").evaluate((el) => ({
  time: el.currentTime,
  duration: el.duration,
  paused: el.paused,
  muted: el.muted,
}));
await page.getByRole("button", { name: "Pause", exact: true }).click();
const report = {
  audioPlayback,
  date: new Date().toISOString(),
  url,
  status: response.status(),
  title: await page.title(),
  fontStatus: await page.evaluate(() => document.fonts.status),
  assets,
  errors,
  badResponses,
  external,
};
await writeFile("docs/review/deployment.json", JSON.stringify(report, null, 2));
await browser.close();
if (
  report.status !== 200 ||
  errors.length ||
  badResponses.length ||
  external.length
)
  throw Error(JSON.stringify(report));
console.log(
  "Published site and local assets loaded without errors or external requests.",
);
