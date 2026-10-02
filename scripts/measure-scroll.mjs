import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
});
await page.goto("http://localhost:5173/moonwalk-art-gallery/?time=17.45");
await page.locator(".loading").waitFor({ state: "detached" });
console.log(
  await page.evaluate(async () => {
    const { GalleryRenderer } =
      await import("/moonwalk-art-gallery/src/renderers/gallery.ts");
    const { loadBackgrounds } =
      await import("/moonwalk-art-gallery/src/artworks/backgrounds.ts");
    const renderer = new GalleryRenderer(await loadBackgrounds(1983));
    const canvas = document.createElement("canvas");
    canvas.width = 2560;
    canvas.height = 1440;
    document.body.append(canvas);
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    const costs = [],
      intervals = [];
    let prev = 0;
    for (let i = 0; i < 180; i++) {
      await new Promise(requestAnimationFrame);
      const t = performance.now();
      if (prev) intervals.push(t - prev);
      prev = t;
      renderer.render(ctx, 1280, 720, 16.4 + i / 60, false);
      costs.push(performance.now() - t);
    }
    const stats = (a) => ({
      mean: a.reduce((s, x) => s + x, 0) / a.length,
      p95: a.sort((a, b) => a - b)[Math.floor(a.length * 0.95)],
    });
    return { render: stats(costs), frame: stats(intervals) };
  }),
);
await browser.close();
