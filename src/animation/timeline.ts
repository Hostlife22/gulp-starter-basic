export const DURATION = 52.017;
export const boundaries = [
  4.1, 6.2, 8.2, 10.3, 12.3, 14.4, 16.4, 18.5, 20.5, 22.6, 24.6, 26.7, 28.7,
  30.8, 32.8, 34.9, 36.9, 39, 41, 43.1, 45.7,
] as const;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function sceneAt(time: number) {
  return Math.min(
    19,
    Math.max(
      0,
      boundaries.findIndex((b) => b > time) - 1 + (time >= 45.7 ? 21 : 0),
    ),
  );
}
// Continuous world-space root. Each episode includes travel through the following gutter.
export function rootAt(time: number) {
  const t = clamp(time, 4.1, 44.4);
  const index = sceneAt(t);
  const start = boundaries[index];
  const end = boundaries[index + 1];
  if (index === 19) return 19 * 580 + mix(20, 255, smooth((t - start) / 1.1));
  return index * 580 + mix(20, 600, (t - start) / (end - start));
}
export function timelineAt(time: number) {
  const t = clamp(time, 0, DURATION);
  return {
    time: t,
    index: sceneAt(t),
    grid:
      t < 3.3
        ? 1
        : t < 4.1
          ? 1 - smooth((t - 3.3) / 0.8)
          : 1 - Math.pow(1 - smooth((t - 46) / 0.7), 4),
    title:
      t < 3.3
        ? smooth(t / 1.1)
        : t < 4.1
          ? 1 - smooth((t - 3.3) / 0.5)
          : smooth((t - 46.7) / 0.8),
    fade: 1 - smooth((t - 51.2) / 0.817),
    root: rootAt(t),
  };
}

export function cameraAt(time: number) {
  return time < 43.1
    ? Math.max(0, rootAt(time) - 250)
    : mix(19 * 580 - 230, 19 * 580, smooth((time - 43.1) / 0.6));
}
