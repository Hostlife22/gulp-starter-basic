import { artworks } from "../data/styles";
import { ancient } from "./ancient";
import { historic } from "./historic";
import { modern } from "./modern";
import { contemporary } from "./contemporary";
import { rect, circle, repeat } from "./svg";
import { random } from "../textures/random";
export function backgroundSvg(index: number, seed = 1983) {
  const art = artworks[index];
  const r = random(seed + index);
  const grain =
    index === 16
      ? ""
      : repeat(index === 0 ? 5000 : 1800, () =>
          circle(
            r() * 535,
            r() * 535,
            0.2 + r() * (index === 0 ? 1.4 : 0.7),
            `rgba(${index === 0 ? "233,192,137" : "55,40,22"},${0.03 + r() * 0.1})`,
          ),
        );
  const marks =
    index < 5
      ? ancient(index)
      : index < 10
        ? historic(index)
        : index < 15
          ? modern(index)
          : contemporary(index);
  const stains = [0, 1, 4, 5, 7, 8, 9, 18].includes(index)
    ? repeat(25, () =>
        circle(r() * 535, r() * 535, 8 + r() * 65, "rgba(82,62,34,.017)"),
      )
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="535" height="535" viewBox="0 0 535 535">${rect(0, 0, 535, 535, art.palette[0])}${stains}${marks}${grain}</svg>`;
}
export async function loadBackgrounds(seed: number) {
  return Promise.all(
    artworks.map(async (_, index) => {
      const image = new Image();
      const url = URL.createObjectURL(
        new Blob([backgroundSvg(index, seed)], { type: "image/svg+xml" }),
      );
      try {
        image.src = url;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 535;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D is unavailable");
        ctx.drawImage(image, 0, 0);
        if (index === 16) {
          const imageData = ctx.getImageData(0, 0, 535, 535);
          const colors = [
            [15, 56, 15],
            [48, 98, 48],
            [139, 172, 15],
            [155, 188, 15],
          ];
          for (let i = 0; i < imageData.data.length; i += 4) {
            let nearest = colors[0],
              distance = Infinity;
            for (const color of colors) {
              const delta = color.reduce(
                (sum, c, j) => sum + (c - imageData.data[i + j]) ** 2,
                0,
              );
              if (delta < distance) {
                distance = delta;
                nearest = color;
              }
            }
            imageData.data[i] = nearest[0];
            imageData.data[i + 1] = nearest[1];
            imageData.data[i + 2] = nearest[2];
          }
          ctx.putImageData(imageData, 0, 0);
        }
        return canvas;
      } finally {
        URL.revokeObjectURL(url);
      }
    }),
  );
}
