import { artworks } from "../data/styles";
import { cardAt, layout } from "../animation/galleryLayout";
import { timelineAt, mix, cameraAt } from "../animation/timeline";
import { poseAt } from "../animation/choreography";
import { drawVector, figureParts, FigureRaster } from "./figure";
export interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}
export class GalleryRenderer {
  private raster = new FigureRaster();
  hits: HitBox[] = [];
  constructor(private backgrounds: HTMLCanvasElement[]) {}
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    mobile: boolean,
  ) {
    const state = timelineAt(time);
    const worldWidth = mobile ? (state.grid > 0.99 ? 384 : 660) : 1280;
    const worldHeight = mobile && state.grid > 0.99 ? 2370 : 720;
    const scale = Math.min(width / worldWidth, height / worldHeight);
    const viewStart = mobile && state.grid <= 0.99 ? 350 : 0;
    const ox = (width - worldWidth * scale) / 2 - viewStart * scale;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(ox, 0);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 1;
    const pose = poseAt(time);
    const parts = figureParts(pose);
    this.raster.update(parts);
    this.hits = [];
    // Figure drawn once in world space through disjoint masks, including the gutter.
    const camera = cameraAt(time);
    const rootScreen = 425 + state.root - camera;
    artworks.forEach((art, index) => {
      const card = cardAt(index, time, mobile && state.grid > 0.99);
      if (
        card.x + card.size < viewStart ||
        card.x > worldWidth + viewStart ||
        card.alpha === 0
      )
        return;
      ctx.save();
      ctx.globalAlpha = card.alpha;
      ctx.shadowColor = "rgba(58,42,24,.18)";
      ctx.shadowBlur = card.size * 0.018;
      ctx.shadowOffsetY = card.size * 0.009;
      ctx.drawImage(
        this.backgrounds[index],
        card.x,
        card.y,
        card.size,
        card.size,
      );
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "rgba(68,54,36,.16)";
      ctx.lineWidth = 0.7;
      ctx.strokeRect(card.x, card.y, card.size, card.size);
      const gridFigure = state.grid > 0.001;
      ctx.save();
      if (gridFigure) {
        ctx.beginPath();
        ctx.rect(card.x, card.y, card.size, card.size);
        ctx.clip();
        const active = index === state.index;
        const localRoot = active
          ? mix(state.root - index * layout.pitch, 278, state.grid)
          : 278;
        if (!active) ctx.globalAlpha *= state.grid;
        ctx.translate(card.x + (localRoot * card.size) / 535, card.y);
        ctx.scale(card.size / 535, card.size / 535);
      } else {
        ctx.beginPath();
        ctx.rect(card.x, card.y - 40, layout.pitch, card.size + 80);
        ctx.clip();
        ctx.translate(rootScreen, card.y);
      }
      if (gridFigure || Math.abs(rootScreen - (card.x + 267)) < 390) {
        if (
          ["pecked", "mosaic", "stitch", "ascii", "pixel"].includes(
            art.renderer,
          )
        )
          this.raster.draw(ctx, art);
        else drawVector(ctx, parts, art);
      }
      ctx.restore();
      const ratio = card.size / 535;
      const captionScale = Math.max(ratio, mobile ? 0.52 : 0.2);
      ctx.save();
      ctx.translate(card.x, card.y + card.size + 17 * captionScale);
      ctx.scale(captionScale, captionScale);
      ctx.fillStyle = "#9c3832";
      ctx.font = 'italic 16px "Cormorant Garamond",Georgia,serif';
      ctx.fillText(String(index + 1).padStart(2, "0"), 0, 0);
      ctx.fillStyle = "#302e28";
      ctx.font = "10px Arial,sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText(art.title, 34, 0);
      ctx.letterSpacing = "0px";
      ctx.font = 'italic 13px "Cormorant Garamond",Georgia,serif';
      ctx.fillText(art.caption, 34, 17);
      ctx.restore();
      ctx.restore();
      this.hits.push({
        x: ox + card.x * scale,
        y: card.y * scale,
        width: card.size * scale,
        height: (card.size + 35 * captionScale) * scale,
        index,
      });
    });
    ctx.restore();
  }
}
