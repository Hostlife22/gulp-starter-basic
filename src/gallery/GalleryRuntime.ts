import { loadBackgrounds } from "../artworks/backgrounds";
import { GalleryRenderer } from "../renderers/gallery";
import { timelineAt } from "../animation/timeline";
import { layout } from "../animation/galleryLayout";
import type { PlaybackController } from "../playback/PlaybackController";

export type GalleryLoadState =
  | { state: "loading" }
  | { state: "ready" }
  | { state: "error"; message: string };
interface Elements {
  canvas: HTMLCanvasElement;
  stage: HTMLDivElement;
  title: HTMLDivElement;
}
const MAX_PIXEL_RATIO = 2;
const MOBILE_BREAKPOINT = 640;

/** Owns the single RAF, resize/visibility listeners, and asynchronous resources. */
export class GalleryRuntime {
  private disposed = false;
  private frame = 0;
  private lastTime = -1;
  private dirty = true;
  private width = layout.width;
  private height = layout.height;
  private renderer: GalleryRenderer | null = null;
  private observer: ResizeObserver | null = null;
  private context: CanvasRenderingContext2D | null = null;

  constructor(
    private elements: Elements,
    private playback: PlaybackController,
    private seed: number,
    private onLoad: (state: GalleryLoadState) => void,
  ) {}

  async start() {
    const ctx = this.elements.canvas.getContext("2d");
    if (!ctx) {
      this.onLoad({
        state: "error",
        message:
          "This browser cannot display the canvas gallery. The complete catalogue remains available below.",
      });
      return;
    }
    this.context = ctx;
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(this.elements.stage);
    document.addEventListener("visibilitychange", this.visibility);
    try {
      const [backgrounds] = await Promise.all([
        loadBackgrounds(this.seed),
        document.fonts.ready,
      ]);
      if (this.disposed) return;
      this.renderer = new GalleryRenderer(backgrounds);
      this.resize();
      this.onLoad({ state: "ready" });
      this.frame = requestAnimationFrame(this.render);
    } catch (error: unknown) {
      if (!this.disposed)
        this.onLoad({
          state: "error",
          message:
            error instanceof Error ? error.message : "Unable to render gallery",
        });
    }
  }
  private resize = () => {
    const bounds = this.elements.stage.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1, MAX_PIXEL_RATIO);
    this.elements.canvas.width = Math.round(this.width * dpr);
    this.elements.canvas.height = Math.round(this.height * dpr);
    this.context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dirty = true;
  };
  private visibility = () => this.playback.visibility(document.hidden);
  private render = (now: number) => {
    if (this.disposed || !this.context) return;
    const time = this.playback.advance(now);
    const state = timelineAt(time);
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    this.elements.stage.classList.toggle(
      "mobile-grid",
      mobile && state.grid > 0.99,
    );
    if (this.renderer && (this.dirty || time !== this.lastTime)) {
      this.renderer.render(this.context, this.width, this.height, time, mobile);
      this.dirty = false;
      this.lastTime = time;
    }
    this.elements.title.style.opacity = String(state.title);
    this.frame = requestAnimationFrame(this.render);
  };
  artworkAt(clientX: number, clientY: number) {
    const box = this.elements.canvas.getBoundingClientRect();
    const x = clientX - box.left,
      y = clientY - box.top;
    return this.renderer?.hits.find(
      (hit) =>
        x >= hit.x &&
        x <= hit.x + hit.width &&
        y >= hit.y &&
        y <= hit.y + hit.height,
    )?.index;
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    document.removeEventListener("visibilitychange", this.visibility);
    this.renderer = null;
    this.context = null;
  }
}
