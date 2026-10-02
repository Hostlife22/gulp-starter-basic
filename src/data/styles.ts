export type RendererKind =
  | "vector"
  | "pecked"
  | "mosaic"
  | "glass"
  | "sketch"
  | "stitch"
  | "neon"
  | "outline"
  | "ascii"
  | "pixel"
  | "faceted"
  | "patch";
export interface ArtworkDefinition {
  id: string;
  number: number;
  title: string;
  caption: string;
  time: number;
  renderer: RendererKind;
  palette: readonly [string, string, string];
}
const entries: readonly (readonly [
  string,
  string,
  number,
  RendererKind,
  string,
  string,
  string,
])[] = [
  [
    "PETROGLYPH",
    "Pecked sandstone, c. 3000 BC",
    5,
    "pecked",
    "#68472f",
    "#dfc693",
    "#d0bc88",
  ],
  [
    "TOMB PAINTING",
    "Thebes, c. 1300 BC",
    7.1,
    "vector",
    "#e8d39a",
    "#171717",
    "#bd8546",
  ],
  [
    "MOSAIC",
    "Pompeii, c. 79 AD",
    9.15,
    "mosaic",
    "#ded7bd",
    "#32322b",
    "#a48465",
  ],
  [
    "STAINED GLASS",
    "Gothic lancet, c. 1250",
    11.2,
    "glass",
    "#24201d",
    "#63549c",
    "#e1bb76",
  ],
  [
    "ILLUMINATED INITIAL",
    "Book of hours, c. 1400",
    13.25,
    "vector",
    "#ebdfb5",
    "#234b90",
    "#dfb684",
  ],
  [
    "PROPORTION STUDY",
    "After Leonardo, c. 1490",
    15.3,
    "sketch",
    "#e3d3a2",
    "#705b37",
    "#705b37",
  ],
  [
    "SILHOUETTE",
    "Cut paper, c. 1790",
    17.35,
    "vector",
    "#174a3c",
    "#10100f",
    "#10100f",
  ],
  [
    "UKIYO-E",
    "After Hokusai, c. 1831",
    19.4,
    "vector",
    "#d8c795",
    "#234574",
    "#e4cca5",
  ],
  [
    "SAMPLER",
    "Cross-stitch, c. 1843",
    21.45,
    "stitch",
    "#e5dfbe",
    "#565750",
    "#b99175",
  ],
  [
    "STRONGMAN BILL",
    "Letterpress, c. 1890",
    23.5,
    "vector",
    "#eadcb2",
    "#222322",
    "#d3b58c",
  ],
  [
    "CONSTRUCTIVISM",
    "Moscow, c. 1925",
    25.55,
    "vector",
    "#e9dfbf",
    "#141414",
    "#d6b18d",
  ],
  [
    "ART DECO",
    "Streamline poster, c. 1935",
    27.6,
    "faceted",
    "#122a43",
    "#182334",
    "#d7bc78",
  ],
  [
    "GOLDEN AGE",
    "Newsprint, c. 1938",
    29.65,
    "vector",
    "#765273",
    "#bd3434",
    "#dab287",
  ],
  [
    "NEON",
    "Diner sign, c. 1955",
    31.7,
    "neon",
    "#211719",
    "#ff8bd1",
    "#ffffb2",
  ],
  [
    "SILKSCREEN",
    "After Warhol, c. 1964",
    33.75,
    "outline",
    "#ef76a8",
    "#182c29",
    "#182c29",
  ],
  [
    "LINE PRINTER",
    "ASCII art, c. 1975",
    35.8,
    "ascii",
    "#f1f3de",
    "#3e6650",
    "#466e59",
  ],
  [
    "HANDHELD",
    "Four shades of green, c. 1989",
    37.85,
    "pixel",
    "#9bbc0f",
    "#0f380f",
    "#306230",
  ],
  [
    "LOW POLY",
    "Polygon era, c. 1997",
    39.9,
    "faceted",
    "#6ea7dc",
    "#51535c",
    "#b99a80",
  ],
  [
    "STENCIL",
    "Spray paint, c. 2005",
    41.95,
    "vector",
    "#aaa99f",
    "#181a18",
    "#181a18",
  ],
  ["PATCH", "Embroidered, 2020s", 44, "patch", "#244773", "#23242e", "#c79877"],
];
export const artworks: readonly ArtworkDefinition[] = entries.map(
  ([title, caption, time, renderer, ...palette], index) => ({
    id: title.toLowerCase().replaceAll(" ", "-"),
    number: index + 1,
    title,
    caption,
    time,
    renderer,
    palette: palette as [string, string, string],
  }),
);
