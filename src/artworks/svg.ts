export const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  stroke = "none",
  sw = 1,
) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const path = (d: string, fill: string, stroke = "none", sw = 1) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const circle = (
  x: number,
  y: number,
  r: number,
  fill: string,
  stroke = "none",
  sw = 1,
) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const text = (
  value: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  extra = "",
) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${value.replaceAll("&", "&amp;")}</text>`;
export const line = (
  x: number,
  y: number,
  x2: number,
  y2: number,
  c: string,
  w = 1,
) => path(`M${x} ${y}L${x2} ${y2}`, "none", c, w);
export const repeat = (n: number, fn: (i: number) => string) =>
  Array.from({ length: n }, (_, i) => fn(i)).join("");
export const serif = 'font-family="Georgia,serif"';
export const bold =
  'font-family="Georgia,serif" font-weight="bold" text-anchor="middle"';
export const mono = 'font-family="monospace"';
