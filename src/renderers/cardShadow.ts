import { stripMetrics } from "../animation/travel";

/** Rasterize the static shadow once instead of blurring each poster every frame. */
export class CardShadow {
  private image: HTMLCanvasElement | null = null;
  private readonly padding = 32;

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const poster = stripMetrics.poster;
    if (!this.image) {
      const image = document.createElement("canvas");
      image.width = image.height = poster + this.padding * 2;
      const shadow = image.getContext("2d");
      if (!shadow) return;
      shadow.shadowColor = "rgba(58,42,24,.18)";
      shadow.shadowBlur = poster * 0.018;
      shadow.shadowOffsetY = poster * 0.009;
      shadow.fillStyle = "#000";
      shadow.fillRect(this.padding, this.padding, poster, poster);
      // Only retain the outside shadow; the artwork supplies its own interior.
      shadow.clearRect(this.padding, this.padding, poster, poster);
      this.image = image;
    }
    const padding = (this.padding * size) / poster;
    ctx.drawImage(
      this.image,
      x - padding,
      y - padding,
      size + padding * 2,
      size + padding * 2,
    );
  }
}
