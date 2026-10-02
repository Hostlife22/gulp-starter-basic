# Validation

Date: 2 October 2026. Local environment: macOS x64, Intel Core i7-9750H @ 2.60 GHz, Node 22.22.0, Playwright Chromium 153.0.8010.12.

## Executed checks

| Check                        | Result                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run check`              | Passed: Prettier, ESLint, strict TypeScript, unit tests, production build                                                            |
| Vitest                       | 16 passing tests                                                                                                                     |
| `npm run test:e2e`           | 6 passing browser scenarios, explicitly invoked                                                                                      |
| Real playback                | Recorded a complete showing; the slider reached 52.017 s without seek                                                                |
| Reference frames             | Captured 49 moments: intro, twenty style controls, additional patch hold, six boundaries in three phases, reassembly, final and fade |
| Final figures                | Separate pixel regions for all twenty figures changed between 48 and 50 s                                                            |
| Responsive layouts           | 390×844 phone and 1280×480 desktop; catalogue and controls accessible, no phone horizontal overflow                                  |
| Reduced motion               | Starts paused at 48 s with the complete scrolling gallery                                                                            |
| Canvas failure               | Visible error and usable text catalogue verified with Canvas 2D unavailable                                                          |
| Browser errors during review | None recorded                                                                                                                        |
| Audio                        | Original AAC extracted; source PCM hash matched                                                                                      |

Unit tests cover unique ordered artwork IDs, deterministic valid SVGs, finite poses, articulation changes, continuous root travel, gutter traversal, final grid coordinates, fade, pause/resume, seek/replay, hidden tabs and end-of-playback stopping.

Browser tests cover real clock progress, pixel stability on pause, seek/replay, all scene controls, key material boundaries, selection through the catalogue, slider keyboard operation, reduced motion, narrow and short windows, canvas fallback, and twenty independently changing final regions. Browser checks are **not** in `check`, push/PR checks or the deploy job. The browser workflow is `workflow_dispatch` only.

## Visual review

The reference contact sheets cover the whole 52-second source. The implementation was captured at the specified timestamps and compared in [paired sheets](VISUAL_REVIEW.md). A [complete implementation recording](review/playback.webm) and [2 fps playback contact sheet](review/playback-contact.jpg) preserve actual clock progression. The recording includes initial resource preparation before playback.

Functional checks pass, but visual equivalence does not. The figure proportions, exact choreography, lettering, textures, faceted volume and reassembly paths still differ. See [the visual review](VISUAL_REVIEW.md) for specific limitations rather than treating passing tests as proof of fidelity.

## Performance

The final gallery was measured for approximately three seconds during live playback, with all twenty figures moving, at 1280×720 and DPR 1. The final sample contains 141 frames, mean interval **21.36 ms** (about **46.8 fps**) and p95 **33.4 ms**. [Raw measurements](review/performance.json).

This is a local **headless Chromium** result. GPU acceleration was not independently established; it is not a measurement of a hardware-accelerated interactive browser or of the GitHub Linux runner. Stable 60 fps is not claimed. Dense procedural figure rendering remains a performance improvement area.

A separate CDP check exercises repeated seeks, viewport changes and replay, collecting JavaScript heap and DOM counters after forced GC. [Raw memory samples](review/memory.json). This is a short stress check, not a GPU/process memory profile or proof against long-session leaks.

## Production output

Vite builds a static `/gulp-starter-basic/` site. JavaScript is approximately 253 kB before gzip, 84 kB compressed; CSS is approximately 6 kB. Fonts and licenses are local. Source MP4s, reference images and review artifacts are outside `public` and are not included in `dist`. No API or runtime CDN is used.

## Publication

The actual default branch is `master`. GitHub Pages has been configured for an Actions build. Deployment and public URL checks are recorded here after the first successful publication.

## Soundtrack verification

At the user’s explicit request, the original AAC audio stream was copied to `public/audio/reference-soundtrack.m4a` using ffmpeg stream copy. It is stereo, 48 kHz, 52.074667 seconds, approximately 824 KiB. Decoding both the source MP4’s audio and the extracted file produced the same SHA-256 PCM hash:

```text
173b01e98ddc442552ce25691c8775611c68b23ce3113734c7321ee77a58cb3d
```

Four unit tests cover user activation, drift, pause/seek/mute/hidden-tab handling and a rejected media start. A browser scenario verifies actual audio playback, pause, seek to 31.7 seconds, persistent mute through Replay, and re-enabling at the current clock time. The visual recording produced by Playwright does not capture system audio; the deployed application does play it.
