import type { Point } from "../../animation/rig";
export function limb(a: Point, b: Point, wa: number, wb: number): Point[] {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1,
    nx = -(b.y - a.y) / d,
    ny = (b.x - a.x) / d;
  return [
    { x: a.x + nx * wa, y: a.y + ny * wa },
    { x: b.x + nx * wb, y: b.y + ny * wb },
    { x: b.x - nx * wb, y: b.y - ny * wb },
    { x: a.x - nx * wa, y: a.y - ny * wa },
  ];
}
export function ellipse(p: Point, rx: number, ry: number, angle = 0) {
  return Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6,
      x = Math.cos(a) * rx,
      y = Math.sin(a) * ry;
    return {
      x: p.x + x * Math.cos(angle) - y * Math.sin(angle),
      y: p.y + x * Math.sin(angle) + y * Math.cos(angle),
    };
  });
}
// Rounded contours keep the cartoon silhouette intact in vector and raster styles.
export function rounded(points: Point[], radius = 5): Point[] {
  return points.flatMap((p, i) => {
    const before = points[(i + points.length - 1) % points.length];
    const after = points[(i + 1) % points.length];
    const inset = (other: Point) => {
      const d = Math.hypot(other.x - p.x, other.y - p.y);
      const t = Math.min(0.35, radius / Math.max(0.01, d));
      return { x: p.x + (other.x - p.x) * t, y: p.y + (other.y - p.y) * t };
    };
    const a = inset(before),
      b = inset(after);
    return [0, 0.33, 0.67, 1].map((t) => ({
      x: (1 - t) ** 2 * a.x + 2 * t * (1 - t) * p.x + t * t * b.x,
      y: (1 - t) ** 2 * a.y + 2 * t * (1 - t) * p.y + t * t * b.y,
    }));
  });
}
export function articulated(
  a: Point,
  b: Point,
  c: Point,
  widths: [number, number, number],
) {
  const normal = (a: Point, b: Point) => {
    const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { x: -(b.y - a.y) / d, y: (b.x - a.x) / d };
  };
  const n1 = normal(a, b),
    n2 = normal(b, c);
  const mid = { x: (n1.x + n2.x) / 2, y: (n1.y + n2.y) / 2 };
  const point = (p: Point, n: Point, w: number) => ({
    x: p.x + n.x * w,
    y: p.y + n.y * w,
  });
  return rounded(
    [
      point(a, n1, widths[0]),
      point(b, mid, widths[1]),
      point(c, n2, widths[2]),
      point(c, n2, -widths[2]),
      point(b, mid, -widths[1]),
      point(a, n1, -widths[0]),
    ],
    9,
  );
}
export function trace(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
}
