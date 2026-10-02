import type { Point } from "../../animation/rig";
import type { ArtworkDefinition } from "../../data/styles";
import type { Part } from "./geometry";
import { trace } from "./paths";
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
