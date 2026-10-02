import { expect, it, vi } from "vitest";
import { GalleryRenderer } from "../renderers/gallery";
import { boundaries } from "../animation/timeline";
import { artworks } from "../data/styles";

// Isolate background compositing from the independent dancer material renderers.
vi.mock("../renderers/figure", () => ({
  figureParts: () => [],
  drawVector: () => {},
  FigureRaster: class {
    update() {}
    draw() {}
  },
}));

it.each(Array.from({ length: 19 }, (_, index) => index))(
  "incoming card %i always paints its own background, without a previous-card overlay",
  (index) => {
    const backgrounds = artworks.map(() => ({}) as HTMLCanvasElement);
    const renderer = new GalleryRenderer(backgrounds);
    const drawImage = vi.fn();
    const context = new Proxy(
      { drawImage },
      {
        get: (target, key) => Reflect.get(target, key) ?? (() => {}),
      },
    ) as unknown as CanvasRenderingContext2D;
    for (
      let time = boundaries[index];
      time <= boundaries[index + 1] + 0.1;
      time += 0.1
    ) {
      drawImage.mockClear();
      renderer.render(context, 1280, 720, time, false);
      // Every visible card has exactly one background, belonging to that card.
      expect(drawImage.mock.calls).toEqual(
        renderer.hits.map((hit) => [
          backgrounds[hit.index],
          hit.x,
          hit.y,
          hit.width,
          hit.width,
        ]),
      );
      expect(renderer.hits.some((hit) => hit.index === index + 1)).toBe(true);
    }
  },
);
