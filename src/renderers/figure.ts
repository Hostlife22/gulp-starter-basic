import type { Point, Pose } from "../animation/rig";
import type { ArtworkDefinition } from "../data/styles";
export interface Part {
  points: Point[];
  kind: "cloth" | "skin" | "white" | "shoe" | "hat" | "trouser" | "band";
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
export function figureParts(p: Pose): Part[] {
  const parts: Part[] = [];
  const add = (points: Point[], kind: Part["kind"] = "cloth") =>
    parts.push({ points, kind });
  add(limb(p.hip, p.kneeR, 11, 8), "trouser");
  add(limb(p.kneeR, p.ankleR, 8, 6), "trouser");
  add(limb(p.hip, p.kneeL, 12, 9), "trouser");
  add(limb(p.kneeL, p.ankleL, 9, 6), "trouser");
  add(limb({ x: p.ankleL.x, y: p.ankleL.y - 9 }, p.ankleL, 6, 6), "white");
  add(limb({ x: p.ankleR.x, y: p.ankleR.y - 9 }, p.ankleR, 6, 6), "white");
  add(limb(p.ankleL, p.toeL, 7, 6), "shoe");
  add(limb(p.ankleR, p.toeR, 7, 6), "shoe");
  add(limb(p.shoulder, p.elbowR, 9, 6));
  add(limb(p.elbowR, p.handR, 6, 4));
  add(ellipse(p.handR, 5, 9, 0.2), "skin");
  add([
    { x: p.shoulder.x - 20, y: p.shoulder.y - 2 },
    { x: p.shoulder.x + 20, y: p.shoulder.y },
    { x: p.hip.x + 17, y: p.hip.y + 4 },
    { x: p.hip.x - 16, y: p.hip.y + 4 },
  ]);
  add(
    [
      { x: p.shoulder.x - 7, y: p.shoulder.y },
      { x: p.shoulder.x + 5, y: p.shoulder.y + 4 },
      { x: p.hip.x - 1, y: p.hip.y - 24 },
    ],
    "white",
  );
  add(limb(p.shoulder, p.head, 6, 8), "skin");
  add(ellipse(p.head, 13, 19, p.tilt), "skin");
  add(
    [
      { x: p.head.x - 8, y: p.head.y - 14 },
      { x: p.head.x + 13, y: p.head.y - 9 },
      { x: p.head.x + 11, y: p.head.y + 10 },
      { x: p.head.x + 4, y: p.head.y + 14 },
      { x: p.head.x + 2, y: p.head.y - 5 },
    ],
    "shoe",
  );
  add(limb(p.shoulder, p.elbowL, 9, 6));
  add(limb(p.elbowL, p.handL, 6, 4));
  add(ellipse(p.handL, 6, 9, -0.6), "white");
  const hat = (x: number, y: number): Point => ({
    x: p.head.x + x * Math.cos(p.tilt) - y * Math.sin(p.tilt),
    y: p.head.y + x * Math.sin(p.tilt) + y * Math.cos(p.tilt),
  });
  add([hat(-16, -17), hat(-14, -36), hat(11, -39), hat(17, -18)], "hat");
  add([hat(-16, -21), hat(16, -22), hat(17, -17), hat(-17, -16)], "band");
  add([hat(-28, -18), hat(29, -19), hat(28, -13), hat(-28, -12)], "hat");
  return parts.map((part) => ({
    ...part,
    points: part.points.map((point) => ({ x: point.x * 1.25, y: point.y })),
  }));
}
function trace(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
}
function partColor(part: Part, art: ArtworkDefinition) {
  if (art.number === 7) return "#090c0b";
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
    if (kind === "faceted") {
      const [a, b, c] = part.points;
      trace(ctx, [a, b, c]);
      ctx.fillStyle = part.kind === "cloth" ? "#85858d" : "#d7be90";
      ctx.fill();
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
    if (kind === "patch" || art.number === 10 || art.number === 5) {
      ctx.save();
      trace(ctx, part.points);
      ctx.clip();
      ctx.strokeStyle = kind === "patch" ? "#76706f" : "#c6b99a";
      ctx.globalAlpha = 0.48;
      ctx.lineWidth = 0.55;
      const a = part.points[0];
      for (let x = a.x - 45; x < a.x + 70; x += 3) {
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
    this.canvas.width = 200;
    this.canvas.height = 535;
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.ctx = ctx;
  }
  update(parts: Part[]) {
    this.ctx.clearRect(0, 0, 200, 535);
    this.ctx.save();
    this.ctx.translate(100, 0);
    for (const part of parts) {
      trace(this.ctx, part.points);
      this.ctx.fillStyle =
        part.kind === "cloth" || part.kind === "trouser"
          ? "#555555"
          : part.kind === "white"
            ? "#ffffff"
            : part.kind === "skin"
              ? "#aaaaaa"
              : "#222222";
      this.ctx.fill();
    }
    this.ctx.restore();
    this.data = this.ctx.getImageData(0, 150, 200, 385).data;
  }
  draw(ctx: CanvasRenderingContext2D, art: ArtworkDefinition) {
    const kind = art.renderer;
    const alpha = ctx.globalAlpha;
    const step =
      kind === "pecked" ? 2 : kind === "ascii" ? 6 : kind === "mosaic" ? 4 : 5;
    ctx.font = "bold 7px monospace";
    ctx.textBaseline = "middle";
    for (let y = 150; y < 515; y += step) {
      for (let x = -85; x < 85; x += step) {
        const offset = ((y - 150) * 200 + x + 100) * 4;
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
