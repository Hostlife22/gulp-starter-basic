import type { ArtworkDefinition } from "../../data/styles";
import type { Part } from "./geometry";
import { trace } from "./paths";
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
