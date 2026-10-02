import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/gulp-starter-basic/",
  plugins: [react()],
  test: { include: ["src/tests/**/*.test.ts"] },
});
