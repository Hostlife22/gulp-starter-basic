# Architecture

## Data flow

`Clock → timelineAt + poseAt → GalleryRenderer → material renderers`

React owns semantic UI and lifecycle. One requestAnimationFrame advances the clock; React receives a throttled time snapshot for controls. The renderer updates the canvas and title opacity without React state for individual joints or cards.

- `src/data/styles.ts`: the twenty typed artwork definitions, captions, palettes and reference moments.
- `src/animation/clock.ts`: pause, seek, hidden-tab suspension, duration clamp. Long frames advance at most 100 ms to avoid surprising jumps.
- `src/animation/timeline.ts`: editable scene boundaries, continuous world root, introduction, reassembly and a persistent final gallery.
- `src/animation/galleryLayout.ts`: shared 1280×720 coordinate system, strip pitch and final grid.
- `src/animation/choreography.ts`: eight smooth foot-contact poses, reference phase anchors, and a separate hand/torso gesture track. Heel rise and whole-foot pickup are independent.
- `src/animation/rig.ts`: measured body proportions, separate shoulder/hip joints and two-bone inverse kinematics. The bending plane is projected into 2D for foreshortening; projected bones never exceed their model lengths.
- `src/artworks/`: four era modules produce twenty independent SVG compositions. SVGs are decoded once into cached canvases; blob URLs are revoked. IDs are isolated in separate SVG documents.
- `src/renderers/figure.ts`: rounded articulated contours, curls, fedora, cuffs, shoes, costume details, material outlines and a shared sampled mask for pecking, mosaic, cross-stitch, ASCII and pixels.
- `src/renderers/gallery.ts`: visibility culling, card transforms, material clipping masks, captions and hit regions.

## Coordinates and transitions

The strip is measured in poster units: a 535-square work and a 580-unit pitch. The root moves in strip world coordinates, separately from camera position. Figure material is clipped to each poster's interval including its right gutter; the adjacent interval begins where the next frame starts. This avoids duplicate opaque figures and preserves the part crossing the gap.

Each poster displays its own background immediately when it enters the viewport. Each card interpolates independently to its final grid position. Other figures fade in during reassembly; the active figure remains visible.

## Rendering and resources

All content is local. SVG backgrounds use deterministic seeded details. A shared small canvas samples the pose's material regions once per frame; all discrete renderers use this raster. There is no WebGL, video element, worker, API, or external image. Canvas allocations for static backgrounds happen during loading. The browser's `getImageData` still allocates a small readback buffer each frame; this is a known optimisation opportunity.

DPR is limited to two. Hidden large posters are culled. The canvas, observer and visibility handlers are cleaned up on unmount. Paused scenes redraw only on seek or resize. Font loading is awaited, with system fallbacks provided by CSS. Resource errors retain the catalogue and display a message.

## Reproducibility

`?time=…&seed=…&controls=0` starts a paused reference view. Time and seed fully determine rendered content; fonts and browser rasterisation can still change pixels. Tests use this normal presentation feature instead of production-only debug globals.

## CI

Fast checks run on push to `master` and pull requests. Pages deployment depends on those checks. Browser tests are a separate, manually dispatched workflow; no E2E is triggered by a push, pull request, or deployment.

## Audio

`AudioSync` follows the visual clock using a local AAC file extracted from the supplied video without re-encoding. Sound is enabled by default. A blocked autoplay attempt waits for a click or key press without changing the sound preference or retrying every frame; deliberate mute persists across replay and later gestures. Pause, seek and hidden-tab state are applied to both media and visuals. Drift greater than 180 ms during playback is corrected against the shared clock. Audio failures leave the visual gallery usable and show a retry message. The media element is paused on cleanup.
