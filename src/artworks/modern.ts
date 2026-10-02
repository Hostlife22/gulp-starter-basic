import { rect, path, circle, text, line, repeat, bold } from "./svg";
export function modern(index: number): string {
  let s = "";
  if (index === 10) {
    s +=
      circle(356, 148, 139, "#cc2722") +
      path("M0 490L535 106v46L26 535H0Z", "#151616") +
      line(52, 514, 526, 170, "#b32824", 7) +
      path("M20 457l53 61-53 14Z", "#151616") +
      text(
        "ЛУННАЯ ПОХОДКА",
        275,
        29,
        17,
        "#25231d",
        `${bold} letter-spacing="4"`,
      ) +
      text("ТАНЕЦ · 1983", 268, 48, 9, "#aa3a2d", `${bold} letter-spacing="3"`);
    s +=
      text(
        "КОРОЛЬ",
        49,
        276,
        38,
        "#161717",
        'font-family="sans-serif" font-weight="900" transform="rotate(-90 49 276)"',
      ) +
      rect(353, 472, 154, 44, "#bf3028") +
      text(
        "ПОПА",
        430,
        507,
        35,
        "#f7e9c8",
        'font-family="sans-serif" font-weight="bold" text-anchor="middle"',
      ) +
      rect(462, 17, 54, 49, "#191a17") +
      text("№1", 489, 50, 29, "#fff3d0", bold);
  }
  if (index === 11) {
    s += `<defs><radialGradient id="sun"><stop stop-color="#f6dd82"/><stop offset=".25" stop-color="#ccbd74" stop-opacity=".6"/><stop offset="1" stop-color="#193552" stop-opacity="0"/></radialGradient></defs>`;
    s +=
      repeat(21, (i) => path(`M267 411L${-400 + i * 67} 0h12Z`, "#304760")) +
      circle(267, 382, 140, "url(#sun)");
    s += repeat(13, (i) => {
      const x = i < 7 ? 14 + i * 27 : 343 + (i - 7) * 29;
      const h = 80 + ((i * 43) % 170);
      return (
        rect(x, 447 - h, 24, h, "#182c43", "#365475") +
        repeat(Math.floor(h / 10) * 3, (j) =>
          rect(
            x + 3 + (j % 3) * 7,
            451 - h + Math.floor(j / 3) * 10,
            2,
            3,
            "#99b6bd",
          ),
        )
      );
    });
    s +=
      rect(14, 14, 507, 507, "none", "#c4af6b", 2) +
      rect(23, 23, 489, 489, "none", "#697663") +
      rect(23, 459, 489, 52, "#0e192c") +
      text("M O T O W N", 267, 497, 35, "#e3c577", bold);
  }
  if (index === 12) {
    s +=
      rect(0, 0, 535, 75, "#f5d649", "#312522", 3) +
      text(
        "THRILLER",
        263,
        58,
        49,
        "#c13830",
        `${bold} font-style="italic" stroke="#432927" stroke-width="1"`,
      ) +
      rect(12, 12, 30, 46, "#c93627") +
      text("1", 28, 45, 26, "#f9e890", bold) +
      circle(499, 36, 23, "#fcf0cb", "#292820", 2) +
      text("10¢", 499, 43, 16, "#292920", bold);
    s +=
      circle(394, 183, 58, "#f4db56", "#463149", 2) +
      rect(354, 94, 155, 36, "#f8ecb0", "#473047") +
      text("STARRING THE", 430, 108, 10, "#373029", bold) +
      text("KING OF POP", 430, 122, 12, "#373029", bold) +
      path("M0 416Q252 391 535 415V535H0Z", "#548044");
    s += repeat(6, (i) => {
      const x = 23 + i * 91,
        y = 387 + (i % 3) * 9;
      return (
        path(`M${x} ${y + 31}v-32q16-27 32 0v32Z`, "#b1b4a3", "#444944", 2) +
        text("RIP", x + 16, y + 5, 7, "#565957", bold)
      );
    });
    s += repeat(60 * 42, (i) =>
      circle((i % 60) * 9, 78 + Math.floor(i / 60) * 8, 0.65, "#322934"),
    );
    s += repeat(5, (i) =>
      rect(64 + i * 93, 475 + (i % 2) * 12, 9, 41, "#b3c491", "#355934", 2),
    );
  }
  if (index === 13) {
    s += repeat(23 * 9, (i) =>
      rect(
        (i % 9) * 65 - (Math.floor(i / 9) % 2) * 32,
        Math.floor(i / 9) * 24,
        63,
        22,
        ["#281b1e", "#2f1d20", "#321e20"][i % 3],
        "#161718",
        2,
      ),
    );
    s +=
      `<g style="filter:drop-shadow(0 0 4px #ff82c6)">` +
      text(
        "Billie Jean’s",
        267,
        82,
        43,
        "#ffb6da",
        `${bold} font-style="italic"`,
      ) +
      text("☆", 48, 80, 43, "#f7e3a5") +
      "</g>" +
      `<g style="filter:drop-shadow(0 0 5px #63e5f7)">` +
      text(
        "DINER",
        267,
        130,
        37,
        "#a6fbff",
        'font-family="sans-serif" font-weight="900" text-anchor="middle"',
      ) +
      "</g>" +
      line(43, 514, 481, 514, "#487d82", 3) +
      text(
        "OPEN",
        467,
        504,
        24,
        "#ffc4d6",
        `${bold} style="filter:drop-shadow(0 0 3px #ff82c6)"`,
      );
  }
  if (index === 14) {
    s += repeat(4, (i) => {
      const x = (i % 2) * 267.5,
        y = Math.floor(i / 2) * 267.5;
      return (
        rect(x, y, 268, 268, ["#ffa23e", "#36beae", "#ed6bac", "#d3f248"][i]) +
        path(`M${x + 66} ${y + 207}q8-51 65-52q59 0 72 52Z`, "#27352d") +
        `<ellipse cx="${x + 135}" cy="${y + 147}" rx="34" ry="46" fill="${["#ffe2a4", "#f070b1", "#eeed68", "#ed9a57"][i]}"/>` +
        path(
          `M${x + 92} ${y + 118}l6-53q33-19 71 0l6 53Z`,
          i % 2 ? "#23382f" : "#4d52cb",
        ) +
        `<ellipse cx="${x + 134}" cy="${y + 120}" rx="69" ry="12" fill="${i % 2 ? "#23382f" : "#4d52cb"}"/>` +
        line(x + 124, y + 146, x + 124, y + 157, "#334334", 3) +
        line(x + 144, y + 146, x + 144, y + 157, "#334334", 3) +
        path(`M${x + 127} ${y + 171}q8 8 15 0`, "none", "#334334", 2)
      );
    });
  }
  return s;
}
