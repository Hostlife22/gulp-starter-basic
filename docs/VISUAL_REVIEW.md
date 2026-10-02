# Visual review

Reviewed on 2 October 2026 against the provided 1280×720 video and its local contact sheets. This is a working procedural interpretation. **It is not a frame-exact copy, and the prompt's strict visual fidelity criterion is not yet satisfied.**

## Evidence

Reference is on the left; implementation is on the right:

- [Styles 01–05](review/styles-1.jpg)
- [Styles 06–10](review/styles-2.jpg)
- [Styles 11–15](review/styles-3.jpg)
- [Styles 16–20](review/styles-4.jpg)
- [Introduction at 1, 2, 3 seconds](review/intro.jpg)
- [Six material boundaries](review/transitions.jpg)
- [Reassembly and final views](review/reassembly.jpg)
- [Recorded playback](review/playback.webm) and [temporal contact sheet](review/playback-contact.jpg)
- [Phone overview](review/mobile-grid.png), [phone artwork](review/mobile-work.png), [short desktop](review/short-desktop.png)

Full-resolution local captures are in `docs/review/raw/` (excluded from Git). They include all twenty specified control moments, six transitions at three phases each, 46/46.5/47-second reassembly, 48/50-second final poses, and two fade moments. Regenerate with `node scripts/review.mjs` against the production preview on port 4174, then `python3 scripts/compare.py`. The comparison script requires the original local video/reference frames, Python Pillow, and ffmpeg.

## Matches and observed behaviour

The desktop title and 5×4 grid use the reference's coordinate proportions. The large strip uses 535-unit squares at y=61 with a 45-unit gutter. All twenty named works are present in order and have individual compositions. The same articulated pose is rendered as stone dots, mosaic pieces, glass, outlines, cross-stitches, neon tubes, ASCII glyphs, pixels, shaded polygons and embroidery.

The root moves independently of the camera. At material boundaries a single figure straddles the gutter and changes material at the next frame. The following background is revealed from left to right. Each card moves into the final grid, where all twenty figures change pose together. Recorded playback reaches the final fade through the real clock.

## Remaining differences

| Area                     | Difference from the reference                                                                                                                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dance                    | The key poses are manually interpreted, not tracked from every frame. The silhouette is narrower and more angular; hip, hand, head and heel timing does not match every control frame. The short cycle repeats more uniformly than the source. |
| Travel                   | World travel is continuous, but mostly linear within each scene. The reference's small accelerations and exact entrance timing have not been motion-tracked.                                                                                   |
| Reassembly               | The implementation compresses the strip into the grid rapidly around 46–46.7 s. Its paths and overlap differ from the source. Mobile changes to a scrolling grid near the end of this transition.                                              |
| Typography               | Libre Baskerville and Cormorant Garamond are substitutes. The display heading is heavier. Poster lettering uses generic serif/monospace outlines; neon lacks the exact hand-lettered script, and comic/letterpress lettering differs.          |
| Stone / paper / concrete | Procedural grain and stains are cleaner and flatter. The stone ornaments lack the source's irregular chipped edges; concrete holes lack its soft sprayed shading.                                                                              |
| Mosaic / glass           | Tesserae and glass seams are explicit, but their exact shape and density differ. Figure geometry is shared, so stained glass does not have the exact hand-shaped contours of the reference.                                                    |
| Sampler / patch          | Real crosses and threads are drawn, but weave density, thread direction and patch outline are simplified.                                                                                                                                      |
| Low poly                 | Flat polygon shading suggests facets, but does not reproduce a true three-dimensional mesh or the source's exact camera-dependent volume.                                                                                                      |
| Silkscreen / stencil     | The four portraits are simplified and lack the same ink registration details; the stencil is cleaner than the reference.                                                                                                                       |
| Audio                    | The supplied video’s AAC track is included at the user’s request, without re-encoding. Its decoded PCM hash matches the original. The dance remains an interpreted motion sequence.                                                            |

### Small text and ornament approximations

Illuminated manuscript sentences, proportion-study notes, tomb signs, the stained-glass plaque and the silhouette plaque are approximations. The printer's service lines and bottom glyph pattern are recreated, not transcribed. The Japanese vertical inscription is an approximate short title. Major readable titles such as REX POPVLI, THRILLER, MOTOWN, DINER, WHO’S BAD?, HEE-HEE!, HEAL THE WORLD and NEVERLAND are retained. These substitutions are not claimed to be historically accurate or exact transcriptions.

The main follow-up for closer fidelity is a denser pose trace from the video, followed by poster-specific contours and lettering. The current implementation should be assessed using the paired images rather than treated as a completed visual match merely because functional tests pass.
