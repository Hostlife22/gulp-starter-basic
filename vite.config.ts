import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/moonwalk-art-gallery/",
  plugins: [react()],
  test: { include: ["src/tests/**/*.test.ts"] },
});
