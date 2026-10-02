/** Shared poster dimensions and the reference-derived travel rhythm. */
export const stripMetrics = {
  poster: 535,
  pitch: 580,
  entry: 20,
  centre: 535 / 2,
} as const;

// Optical-flow samples from the supplied video (16.4–18.5 s) show roughly
// 450 px/s at a crossing and 115 px/s around the artwork centre. Relative to
// a 580 px / ~2.1 s traversal, these are about 1.6× and 0.4× the mean speed.
const CROSSING_SPEED = 1.6 * stripMetrics.pitch;
const CENTRE_SPEED = 0.4 * stripMetrics.pitch;

function hermite(
  t: number,
  start: number,
  end: number,
  startSlope: number,
  endSlope: number,
) {
  const t2 = t * t,
    t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * start +
    (t3 - 2 * t2 + t) * startSlope +
    (-2 * t3 + 3 * t2) * end +
    (t3 - t2) * endSlope
  );
}

/** Continuous position and velocity: arrive, slow at the centre, then leave. */
export function travelAcrossArtwork(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const half = 0.5;
  return p <= half
    ? hermite(
        p / half,
        stripMetrics.entry,
        stripMetrics.centre,
        CROSSING_SPEED * half,
        CENTRE_SPEED * half,
      )
    : hermite(
        (p - half) / half,
        stripMetrics.centre,
        stripMetrics.pitch + stripMetrics.entry,
        CENTRE_SPEED * half,
        CROSSING_SPEED * half,
      );
}
