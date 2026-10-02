import type { Point, Pose } from "../animation/rig";
import type { ArtworkDefinition } from "../data/styles";
export interface Part {
  points: Point[];
  kind:
    | "cloth"
    | "skin"
    | "white"
    | "shirt"
    | "lapel"
    | "shoe"
    | "hat"
    | "trouser"
    | "band";
}
function limb(a: Point, b: Point, wa: number, wb: number): Point[] {
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
function ellipse(p: Point, rx: number, ry: number, angle = 0) {
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
function rounded(points: Point[], radius = 5): Point[] {
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
function articulated(
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
export function figureParts(p: Pose): Part[] {
  const parts: Part[] = [];
  const add = (points: Point[], kind: Part["kind"] = "cloth") =>
    parts.push({ points, kind });
  const shoe = (ankle: Point, toe: Point) => {
    const angle = Math.atan2(toe.y - ankle.y, toe.x - ankle.x);
    const length = Math.hypot(toe.x - ankle.x, toe.y - ankle.y);
    const direction = toe.x < ankle.x ? -1 : 1;
    const transform = (x: number, y: number) => ({
      x: ankle.x + x * Math.cos(angle) - y * Math.sin(angle) * direction,
      y: ankle.y + x * Math.sin(angle) + y * Math.cos(angle) * direction,
    });
    add(
      rounded(
        [
          transform(-9, -7),
          transform(4, -9),
          transform(10, -3),
          transform(length + 7, -2),
          transform(length + 10, 4),
          transform(length + 5, 9),
          transform(-9, 9),
        ],
        6,
      ),
      "shoe",
    );
  };
  for (const side of ["R", "L"] as const) {
    const hip = p[`hip${side}`],
      knee = p[`knee${side}`],
      ankle = p[`ankle${side}`];
    const d = Math.hypot(ankle.x - knee.x, ankle.y - knee.y);
    const cuff = {
      x: ankle.x - ((ankle.x - knee.x) / d) * 15,
      y: ankle.y - ((ankle.y - knee.y) / d) * 15,
    };
    add(articulated(hip, knee, cuff, [16, 12, 10]), "trouser");
    add(rounded(limb(cuff, ankle, 8, 7), 4), "white");
    shoe(ankle, p[`toe${side}`]);
  }
  // Rear sleeve first; front sleeve and gloved hand overlap the jacket.
  add(articulated(p.shoulderR, p.elbowR, p.handR, [14, 11, 7]));
  const left = p.shoulderL,
    right = p.shoulderR;
  add(
    rounded(
      [
        { x: left.x - 5, y: left.y - 4 },
        { x: p.shoulder.x - 12, y: p.shoulder.y - 5 },
        { x: p.shoulder.x, y: p.shoulder.y + 4 },
        { x: p.shoulder.x + 13, y: p.shoulder.y - 6 },
        { x: right.x + 5, y: right.y - 3 },
        { x: p.hip.x + 21, y: p.hip.y - 29 },
        { x: p.hip.x + 25, y: p.hip.y + 9 },
        { x: p.hip.x - 26, y: p.hip.y + 9 },
        { x: p.hip.x - 21, y: p.hip.y - 28 },
      ],
      7,
    ),
  );
  add(
    [
      { x: p.shoulder.x - 12, y: p.shoulder.y },
      { x: p.shoulder.x + 9, y: p.shoulder.y },
      { x: p.hip.x + 5, y: p.hip.y - 37 },
      { x: p.hip.x - 6, y: p.hip.y - 37 },
    ],
    "shirt",
  );
  for (const side of [-1, 1]) {
    add(
      [
        { x: p.shoulder.x + side * 25, y: p.shoulder.y + 22 },
        { x: p.shoulder.x + side * 6, y: p.shoulder.y + 39 },
        { x: p.shoulder.x + side * 6, y: p.shoulder.y + 43 },
        { x: p.shoulder.x + side * 25, y: p.shoulder.y + 26 },
      ],
      "lapel",
    );
  }
  add(
    rounded(limb(p.neck, { x: p.head.x, y: p.head.y + 15 }, 7, 8), 4),
    "skin",
  );
  const head = (x: number, y: number): Point => ({
    x: p.head.x + x * Math.cos(p.tilt) - y * Math.sin(p.tilt),
    y: p.head.y + x * Math.sin(p.tilt) + y * Math.cos(p.tilt),
  });
  add(ellipse(p.head, 23, 27, p.tilt), "shoe");
  for (const [x, y] of [
    [-18, -9],
    [-21, 2],
    [-19, 12],
    [-13, 21],
    [18, -8],
    [21, 3],
    [18, 15],
  ])
    add(ellipse(head(x, y), 6, 8, p.tilt), "shoe");
  add(
    rounded(
      [
        head(-13, -17),
        head(9, -18),
        head(16, -8),
        head(15, 1),
        head(19, 5),
        head(13, 9),
        head(10, 19),
        head(1, 24),
        head(-10, 20),
        head(-15, 8),
      ],
      5,
    ),
    "skin",
  );
  add(articulated(p.shoulderL, p.elbowL, p.handL, [14, 10, 6]));
  const hand = (elbow: Point, wrist: Point, glove: boolean) => {
    const angle =
      Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) - Math.PI / 2;
    add(
      ellipse(wrist, glove ? 8 : 7, glove ? 14 : 12, angle),
      glove ? "white" : "skin",
    );
  };
  hand(p.elbowL, p.handL, false);
  hand(p.elbowR, p.handR, true);
  // Indented crown and an oval brim, both rotating with the head.
  add(
    rounded(
      [
        head(-24, -20),
        head(-22, -39),
        head(-12, -42),
        head(-4, -38),
        head(7, -45),
        head(20, -40),
        head(25, -20),
      ],
      4,
    ),
    "hat",
  );
  add([head(-24, -25), head(24, -25), head(25, -19), head(-25, -19)], "band");
  add(ellipse(head(0, -18), 40, 5, p.tilt), "hat");
  return parts;
}
function trace(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
}
function partColor(part: Part, art: ArtworkDefinition) {
  if (art.number === 7) return "#090c0b";
  if (part.kind === "shirt")
    return [13, 20].includes(art.number)
      ? "#171719"
      : [2, 5, 12].includes(art.number)
        ? "#dbc16e"
        : "#eee6d2";
  if (part.kind === "lapel")
    return art.number === 13 ? "#201719" : art.palette[1];
  if (part.kind === "cloth") return art.palette[1];
  if (part.kind === "trouser")
    return art.number === 5 ? "#171a1b" : art.palette[1];
  if (part.kind === "skin") return art.palette[2];
  if (part.kind === "white") return art.number === 17 ? "#8bac0f" : "#f1ebd9";
  if (part.kind === "band")
    return [5, 8, 19].includes(art.number) ? "#a83c2c" : "#bd9b57";
  return art.number === 5 && part.kind === "hat" ? "#963329" : "#151919";
}
export function drawVector(
  ctx: CanvasRenderingContext2D,
  parts: Part[],
  art: ArtworkDefinition,
) {
  const kind = art.renderer;
  ctx.lineJoin = "round";
  if (kind === "patch") {
    ctx.strokeStyle = "#e8dec0";
    ctx.lineWidth = 11;
    for (const part of parts) {
      trace(ctx, part.points);
      ctx.stroke();
    }
  }
  for (const part of parts) {
    trace(ctx, part.points);
    const color = partColor(part, art);
    if (kind === "neon") {
      const neon =
        part.kind === "cloth" || part.kind === "trouser"
          ? "#ff8acb"
          : part.kind === "shoe"
            ? "#71f4fa"
            : "#fffbb4";
      ctx.strokeStyle = neon;
      ctx.lineWidth = 3;
      ctx.shadowColor = neon;
      ctx.shadowBlur = 9 * Math.min(1, ctx.getTransform().a);
      ctx.stroke();
      ctx.shadowBlur = 0;
      continue;
    }
    if (kind === "outline" || kind === "sketch") {
      ctx.strokeStyle = kind === "sketch" ? "#78613d" : "#182b28";
      ctx.lineWidth = kind === "sketch" ? 0.9 : 1.5;
      ctx.stroke();
      continue;
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle =
      kind === "glass" ? "#201f32" : art.number === 13 ? "#202322" : color;
    ctx.lineWidth = kind === "glass" ? 2.3 : 1.2;
    ctx.stroke();
    if (kind === "patch" && part.kind === "shirt") {
      const [a, b, c, d] = part.points;
      const at = (a: Point, b: Point, t: number) => ({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      });
      trace(ctx, [
        at(a, d, 0.48),
        at(b, c, 0.48),
        at(b, c, 0.66),
        at(a, d, 0.66),
      ]);
      ctx.fillStyle = "#eae4d9";
      ctx.fill();
    }
    if (kind === "faceted") {
      const a = part.points[0];
      const b = part.points[Math.floor(part.points.length / 3)];
      const c = part.points[Math.floor((part.points.length * 2) / 3)];
      ctx.save();
      trace(ctx, part.points);
      ctx.clip();
      trace(ctx, [a, b, c]);
      ctx.fillStyle =
        part.kind === "skin"
          ? "#d7be90"
          : part.kind === "white" || part.kind === "shirt"
            ? "#d7d2c0"
            : "#555861";
      ctx.fill();
      ctx.restore();
    }
    if (kind === "glass") {
      ctx.save();
      trace(ctx, part.points);
      ctx.clip();
      ctx.strokeStyle = "#292b44";
      ctx.lineWidth = 1;
      const a = part.points[0];
      for (let y = a.y - 25; y < a.y + 100; y += 15) {
        ctx.beginPath();
        ctx.moveTo(a.x - 30, y);
        ctx.lineTo(a.x + 40, y + 24);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (
      (kind === "patch" || art.number === 10 || art.number === 5) &&
      (part.kind === "cloth" || part.kind === "trouser")
    ) {
      ctx.save();
      trace(ctx, part.points);
      ctx.clip();
      ctx.strokeStyle = kind === "patch" ? "#76706f" : "#c6b99a";
      ctx.globalAlpha = 0.48;
      ctx.lineWidth = 0.55;
      const a = part.points[0];
      if (art.number === 5) {
        ctx.fillStyle = "#e3c56d";
        for (let y = a.y - 80; y < a.y + 145; y += 7)
          for (let x = a.x - 45; x < a.x + 70; x += 7)
            ctx.fillRect(x + (Math.floor(y / 7) % 2) * 3, y, 1.6, 1.6);
      }
      for (let x = a.x - 45; art.number !== 5 && x < a.x + 70; x += 3) {
        ctx.beginPath();
        ctx.moveTo(x, a.y - 80);
        ctx.lineTo(x + 9, a.y + 145);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  if (kind === "sketch") {
    ctx.strokeStyle = "#8e7548";
    ctx.lineWidth = 0.6;
    for (const part of parts) {
      const p = part.points[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
// One shared material-index raster per pose, sampled by the four discrete renderers.
export class FigureRaster {
  private canvas = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D;
  private data = new Uint8ClampedArray(0);
  constructor() {
    this.canvas.width = 280;
    this.canvas.height = 535;
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.ctx = ctx;
  }
  update(parts: Part[]) {
    this.ctx.clearRect(0, 0, 280, 535);
    this.ctx.save();
    this.ctx.translate(140, 0);
    for (const part of parts) {
      trace(this.ctx, part.points);
      this.ctx.fillStyle =
        part.kind === "cloth" || part.kind === "trouser"
          ? "#555555"
          : part.kind === "white" || part.kind === "shirt"
            ? "#ffffff"
            : part.kind === "skin"
              ? "#aaaaaa"
              : "#222222";
      this.ctx.fill();
    }
    this.ctx.restore();
    this.data = this.ctx.getImageData(0, 150, 280, 385).data;
  }
  draw(ctx: CanvasRenderingContext2D, art: ArtworkDefinition) {
    const kind = art.renderer;
    const alpha = ctx.globalAlpha;
    const step =
      kind === "pecked" ? 2 : kind === "ascii" ? 6 : kind === "mosaic" ? 4 : 5;
    ctx.font = "bold 7px monospace";
    ctx.textBaseline = "middle";
    for (let y = 150; y < 515; y += step) {
      for (let x = -135; x < 135; x += step) {
        const offset = ((y - 150) * 280 + x + 140) * 4;
        if (this.data[offset + 3] < 100) continue;
        const material = this.data[offset];
        ctx.fillStyle =
          kind === "pecked"
            ? "#d8c190"
            : material > 220
              ? art.number === 17
                ? "#8bac0f"
                : "#e8dfc4"
              : material > 130
                ? art.palette[2]
                : art.palette[1];
        if (kind === "ascii") {
          ctx.fillStyle = "#304b39";
          const chars =
            material > 220 ? "+:." : material > 130 ? "@o0" : "MW#%";
          ctx.fillText(
            chars[
              (Math.floor((x + 85) / step) * 7 + Math.floor(y / step) * 11) %
                chars.length
            ],
            x,
            y,
          );
        } else if (kind === "stitch") {
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 3.6, y + 3.6);
          ctx.moveTo(x + 3.6, y);
          ctx.lineTo(x, y + 3.6);
          ctx.stroke();
        } else if (kind === "pecked") {
          const n =
            ((Math.imul(x + 101, 374761393) ^ Math.imul(y, 668265263)) >>> 0) %
            17;
          ctx.globalAlpha = alpha * (0.65 + n / 50);
          ctx.fillRect(x + n / 12, y + n / 17, 1.1 + n / 18, 1.1 + n / 20);
        } else
          ctx.fillRect(
            x,
            y,
            step - (kind === "mosaic" ? 0.8 : 0),
            step - (kind === "mosaic" ? 0.8 : 0),
          );
      }
    }
    ctx.globalAlpha = alpha;
  }
}
