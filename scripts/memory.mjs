import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://localhost:4174/moonwalk-art-gallery/?time=48");
await page.locator(".loading").waitFor({ state: "detached" });
const client = await page.context().newCDPSession(page);
await client.send("Performance.enable");
async function snapshot() {
  await client.send("HeapProfiler.collectGarbage");
  const { metrics } = await client.send("Performance.getMetrics");
  return {
    heapBytes: metrics.find((m) => m.name === "JSHeapUsedSize").value,
    ...(await client.send("Memory.getDOMCounters")),
  };
}
const samples = [await snapshot()];
for (let round = 0; round < 3; round++) {
  for (let i = 0; i < 40; i++) {
    await page.locator("#time").fill(String((i * 7) % 51));
    if (i % 5 === 0)
      await page.setViewportSize({
        width: i % 2 ? 390 : 1280,
        height: i % 2 ? 844 : 720,
      });
  }
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "Replay", exact: false }).click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
  }
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.locator("#time").fill("48");
  await page.waitForTimeout(200);
  samples.push(await snapshot());
}
await writeFile(
  "docs/review/memory.json",
  JSON.stringify(
    {
      samples,
      note: "Three rounds of 40 seeks, 8 resizes and 5 replays; forced GC before each sample. Short-run JS heap and DOM counters, not GPU/process memory or proof of no leak.",
    },
    null,
    2,
  ),
);
await browser.close();
