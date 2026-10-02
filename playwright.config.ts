import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "src/tests/browser",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5173/gulp-starter-basic/",
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173/gulp-starter-basic/",
    reuseExistingServer: !process.env.CI,
  },
});
