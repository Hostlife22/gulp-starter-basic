# Contributing

Use Node.js 22.12+ and `npm ci`. Keep changes focused and run `npm run check` before opening a pull request.

For artwork changes, compare the affected timestamp at 1280×720 and on a narrow viewport. Include a screenshot and describe remaining differences. Run `npm run test:e2e` explicitly for control, clock, transition, or layout changes. Browser checks are intentionally not part of ordinary CI.

Keep timing functions deterministic and independent of browser state. Use one animation loop. Keep the original order, labels and shared pose across renderers. Generate textures from a stable seed and cache static work. Do not add video frames, external images, or CDN dependencies to the runtime.

Formatting uses Prettier; TypeScript is strict. Extend shared geometry and tokens instead of duplicating dance or layout code. New third-party assets must include their licenses.
