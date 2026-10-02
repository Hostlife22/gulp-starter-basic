import process from "node:process";
import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const [mode, filename] = process.argv.slice(2);
if (!["capture", "compare"].includes(mode) || !filename)
  throw Error(
    "Usage: node scripts/compare-frames.mjs capture|compare <baseline.json>",
  );
const base =
  process.env.GALLERY_BASE_URL ?? "http://localhost:5173/moonwalk-art-gallery/";
const desktopTimes = [
  1, 3.7, 5, 7.1, 9.15, 11.2, 13.25, 15.3, 17.35, 19.4, 21.45, 23.5, 25.55,
  27.6, 29.65, 31.7, 33.75, 35.8, 37.85, 39.9, 41.95, 44, 46.4, 48, 52.017,
];
const browser = await chromium.launch();
const frames = [];
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 720 });
    for (const time of width === 390 ? [5, 44, 48, 52.017] : desktopTimes) {
      await page.goto(`${base}?time=${time}&controls=0`);
      await page.locator(".loading").waitFor({ state: "detached" });
      if (await page.locator(".error").count())
        throw Error(await page.locator(".error").innerText());
      await page.waitForTimeout(180);
      const snapshot = await page.evaluate(() => ({
        pixels: document.querySelector("canvas").toDataURL(),
        title: document.querySelector(".title-layer").style.opacity,
      }));
      frames.push({
        width,
        time,
        hash: createHash("sha256")
          .update(JSON.stringify(snapshot))
          .digest("hex"),
      });
    }
  }
  if (errors.length) throw Error(errors.join("\n"));
} finally {
  await browser.close();
}
if (mode === "capture") {
  await writeFile(filename, JSON.stringify(frames, null, 2));
  console.log(`Captured ${frames.length} frames to ${filename}.`);
} else {
  const baseline = JSON.parse(await readFile(filename, "utf8"));
  const changed = frames.filter(
    (frame) =>
      !baseline.some(
        (before) =>
          before.width === frame.width &&
          before.time === frame.time &&
          before.hash === frame.hash,
      ),
  );
  const missing = baseline.filter(
    (before) =>
      !frames.some(
        (frame) => frame.width === before.width && frame.time === before.time,
      ),
  );
  console.log(
    JSON.stringify({ frames: frames.length, changed, missing }, null, 2),
  );
  if (changed.length || missing.length) process.exitCode = 1;
}
