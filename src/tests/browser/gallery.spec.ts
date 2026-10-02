import { test, expect } from "@playwright/test";
const ready = async (page: import("@playwright/test").Page) => {
  await expect(page.locator(".loading")).toHaveCount(0);
  await expect(page.locator(".error")).toHaveCount(0);
  await page.waitForTimeout(120);
};
test("clock advances, pause freezes pixels, seek and replay work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./?time=5");
  await ready(page);
  const canvas = page.locator("canvas");
  const first = await canvas.screenshot();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(350);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  expect(await canvas.screenshot()).not.toEqual(first);
  const paused = await canvas.screenshot();
  await page.waitForTimeout(160);
  expect(await canvas.screenshot()).toEqual(paused);
  await page.getByLabel("Gallery time in seconds").fill("31.7");
  await expect(page.locator("output")).toContainText("31.7");
  await page.getByRole("button", { name: "Replay", exact: false }).click();
  await expect(page.locator("output")).not.toContainText("31.7");
  expect(errors).toEqual([]);
});
test("all twenty episodes and material boundaries render", async ({ page }) => {
  const times = [
    5, 7.1, 9.15, 11.2, 13.25, 15.3, 17.35, 19.4, 21.45, 23.5, 25.55, 27.6,
    29.65, 31.7, 33.75, 35.8, 37.85, 39.9, 41.95, 44, 10.3, 32.8, 36.9, 41,
    43.1,
  ];
  await page.goto("./?time=5");
  await ready(page);
  for (const time of times) {
    await page.getByLabel("Gallery time in seconds").fill(String(time));
    await expect(page.locator("output")).toContainText(time.toFixed(1));
    await expect(page.locator(".error")).toHaveCount(0);
  }
  await page.getByRole("button", { name: "Overview", exact: false }).click();
  await expect(page.locator("output")).toContainText("48.0");
  await page.locator("summary").click();
  await expect(page.locator("#catalogue li")).toHaveCount(20);
  await page.getByRole("button", { name: /20 PATCH/ }).click();
  await expect(page.locator("output")).toContainText("44.0");
});
test("keyboard, reduced motion and narrow screens retain the full catalogue", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await ready(page);
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".stage")).toHaveClass(/mobile-grid/);
  await page.locator("summary").click();
  await page.getByRole("button", { name: /20 PATCH/ }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: /20 PATCH/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.getByRole("button", { name: /20 PATCH/ }).click();
  await page.getByLabel("Gallery time in seconds").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByLabel("Gallery time in seconds")).toHaveValue("43.99");
  await page.setViewportSize({ width: 1280, height: 480 });
  await page.locator("summary").scrollIntoViewIfNeeded();
  await expect(page.locator("summary")).toBeVisible();
});
test("final overview contains twenty changing figure regions", async ({
  page,
}) => {
  await page.goto("./?time=48");
  await ready(page);
  const regions = () =>
    page.evaluate(() => {
      const ctx = document.querySelector("canvas")!.getContext("2d")!;
      return Array.from({ length: 20 }, (_, i) =>
        Array.from(
          ctx.getImageData(
            672 + (i % 5) * 112 + 25,
            111 + Math.floor(i / 5) * 127 + 30,
            55,
            70,
          ).data,
        ),
      );
    });
  const before = await regions();
  await page.getByLabel("Gallery time in seconds").fill("50");
  await page.waitForTimeout(150);
  const after = await regions();
  for (let i = 0; i < 20; i++)
    expect(
      after[i].filter((value, j) => value !== before[i][j]).length,
      `artwork ${i + 1} changes pose`,
    ).toBeGreaterThan(40);
});
test("canvas failure keeps an error and the text catalogue available", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto("./?time=48");
  await expect(page.getByRole("alert")).toContainText("cannot display");
  await page.locator("summary").click();
  await expect(page.getByRole("button", { name: /20 PATCH/ })).toBeAttached();
});
test("source audio starts on a gesture and follows pause, seek, mute and replay", async ({
  page,
}) => {
  await page.goto("./?time=10");
  await ready(page);
  const audio = page.locator("audio");
  await expect
    .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).readyState))
    .toBeGreaterThanOrEqual(1);
  expect(await audio.evaluate((el) => (el as HTMLAudioElement).paused)).toBe(
    true,
  );
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect
    .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).paused))
    .toBe(false);
  await expect
    .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).currentTime))
    .toBeGreaterThan(10);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect
    .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).paused))
    .toBe(true);
  await page.getByLabel("Gallery time in seconds").fill("31.7");
  await expect
    .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).currentTime))
    .toBeCloseTo(31.7, 1);
  await page.getByRole("button", { name: "Mute sound" }).click();
  expect(await audio.evaluate((el) => (el as HTMLAudioElement).muted)).toBe(
    true,
  );
  await page.getByRole("button", { name: "Replay", exact: false }).click();
  await page.waitForTimeout(200);
  expect(await audio.evaluate((el) => (el as HTMLAudioElement).paused)).toBe(
    true,
  );
  await page.getByRole("button", { name: "Enable sound" }).click();
  await expect
    .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).paused))
    .toBe(false);
  expect(
    await audio.evaluate((el) => (el as HTMLAudioElement).currentTime),
  ).toBeLessThan(2);
});

for (const policy of [
  "no-user-gesture-required",
  "document-user-activation-required",
]) {
  test(`sound defaults on with autoplay policy ${policy}`, async ({
    playwright,
  }) => {
    const browser = await playwright.chromium.launch({
      args: [`--autoplay-policy=${policy}`],
    });
    try {
      const page = await browser.newPage();
      if (policy === "document-user-activation-required") {
        // Headless Chromium may bypass autoplay policy; enforce the rejection
        // until a real trusted gesture, then use the browser's actual decoder.
        await page.addInitScript(() => {
          let activated = false;
          window.addEventListener(
            "click",
            (event) => {
              if (event.isTrusted) activated = true;
            },
            true,
          );
          const play = HTMLMediaElement.prototype.play;
          HTMLMediaElement.prototype.play = function () {
            if (!activated)
              return Promise.reject(
                new DOMException("Gesture required", "NotAllowedError"),
              );
            return play.call(this);
          };
        });
      }
      await page.goto("http://127.0.0.1:5173/moonwalk-art-gallery/");
      await ready(page);
      const audio = page.locator("audio");
      if (policy === "document-user-activation-required") {
        await expect(page.locator(".media-note")).toContainText(
          "Click or press a key",
        );
        expect(
          await audio.evaluate((el) => (el as HTMLAudioElement).paused),
        ).toBe(true);
        const start = page.getByRole("button", { name: "Start sound" });
        await expect(start).toHaveAttribute("aria-pressed", "false");
        await start.click();
        await expect
          .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).paused))
          .toBe(false);
        // Reproduce the reported refresh: one press must also work after reload.
        await page.reload();
        await ready(page);
        await expect(start).toHaveAttribute("aria-pressed", "false");
        await start.click();
      }
      await expect
        .poll(() => audio.evaluate((el) => (el as HTMLAudioElement).paused))
        .toBe(false);
      expect(await audio.evaluate((el) => (el as HTMLAudioElement).muted)).toBe(
        false,
      );
      await expect(
        page.getByRole("button", { name: "Mute sound" }),
      ).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: "Mute sound" }).click();
      await page.mouse.click(10, 10);
      expect(await audio.evaluate((el) => (el as HTMLAudioElement).muted)).toBe(
        true,
      );
      expect(
        await audio.evaluate((el) => (el as HTMLAudioElement).paused),
      ).toBe(true);
    } finally {
      await browser.close();
    }
  });
}
