import { rect, path, circle, text, line, repeat, bold, mono } from "./svg";
export function contemporary(index: number): string {
  let s = "";
  if (index === 15) {
    s +=
      repeat(28, (i) => rect(24, i * 20, 487, 10, "#d5e5d0")) +
      repeat(
        28,
        (i) =>
          rect(7, 5 + i * 19, 8, 11, "#c7cbbb") +
          rect(521, 5 + i * 19, 8, 11, "#c7cbbb"),
      ) +
      line(22, 0, 22, 535, "#a9b5a1") +
      line(513, 0, 513, 535, "#a9b5a1");
    s +=
      text("IBM / MOONWALK GENERATOR  REV.75", 35, 20, 9, "#46604d", mono) +
      text("JOB 001983  ·  OUTPUT: KING_OF_POP", 35, 34, 8, "#46604d", mono);
    s += repeat(9, (i) =>
      text(
        repeat(78, (j) => " .:/|_+*"[Math.floor((j * j + i * 13) % 7)]),
        31,
        460 + i * 7,
        8,
        "#527259",
        mono,
      ),
    );
  }
  if (index === 16) {
    s +=
      rect(0, 0, 535, 25, "#0f380f") +
      text("SCORE: 001983", 12, 18, 15, "#9bbc0f", mono) +
      text("♥ ♥ ♥", 439, 18, 15, "#9bbc0f", mono) +
      rect(20, 40, 494, 63, "none", "#306230", 3) +
      text("WHO’S BAD?", 34, 67, 21, "#0f380f", mono) +
      text("↓", 487, 91, 16, "#306230", mono);
    s +=
      repeat(26, (i) => {
        const h = 50 + ((i * 31) % 83);
        return (
          rect(i * 21, 500 - h, 18, h, "#306230") +
          repeat(Math.floor(h / 11) * 2, (j) =>
            rect(
              i * 21 + 3 + (j % 2) * 9,
              505 - h + Math.floor(j / 2) * 11,
              4,
              6,
              "#8bac0f",
            ),
          )
        );
      }) +
      rect(0, 502, 535, 21, "#0f380f") +
      rect(0, 494, 535, 5, "#8bac0f");
  }
  if (index === 17) {
    s +=
      rect(0, 280, 535, 255, "#5c9d3b") +
      path("M-12 535L243 280h49l255 255Z", "#4f5561") +
      path(
        "M265 530l5-20m-5-19 4-17m-4-17 3-14m-3-15 3-13m-3-17 2-11m-2-13 2-10m-2-13 2-10m-2-12 1-8m-1-13 1-7",
        "none",
        "#e4dc76",
        4,
      );
    s += repeat(6, (i) => {
      const x = i < 3 ? i * 46 : 390 + (i - 3) * 49,
        h = 190 - (i % 3) * 37;
      return (
        rect(x, 280 - h, 45, h, "#c5c0ac") +
        path(`M${x + 45} 280v-${h}l9 8v${h - 8}Z`, "#969988") +
        repeat(Math.floor(h / 15) * 4, (j) =>
          rect(
            x + 5 + (j % 4) * 10,
            287 - h + Math.floor(j / 4) * 15,
            4,
            7,
            "#858e8c",
          ),
        )
      );
    });
    s += repeat(3, (i) =>
      path(
        `M${67 + i * 166} ${65 + (i % 2) * 31}l23-18 22 3 21 15Z`,
        "#e9f0ec",
      ),
    );
    s +=
      `<ellipse cx="383" cy="243" rx="32" ry="47" fill="none" stroke="#e7c752" stroke-width="10"/>` +
      text("HATS", 14, 24, 16, "#fff4af", mono) +
      text("07/12", 14, 41, 17, "#ffffff", mono) +
      text("TIME", 469, 24, 16, "#fff4af", mono) +
      text("0:42:58", 436, 41, 17, "#ffffff", mono) +
      rect(91, 510, 353, 16, "#22385a") +
      text("MOONWALK THROUGH THE AGES!", 267, 522, 10, "#fff", bold);
  }
  if (index === 18) {
    s +=
      line(267, 0, 267, 535, "#747971", 1) +
      line(0, 267, 535, 267, "#747971", 1) +
      repeat(
        12,
        (i) =>
          circle(
            43 + (i % 4) * 149,
            66 + Math.floor(i / 4) * 165,
            5,
            "#52584f",
          ) +
          circle(
            42 + (i % 4) * 149,
            65 + Math.floor(i / 4) * 165,
            9,
            "#777d72",
          ),
      );
    s +=
      text("HEE-HEE!", 421, 82, 29, "#b43437", `${bold} font-style="italic"`) +
      text("HEAL THE", 427, 463, 28, "#191e19", bold) +
      text("WORLD", 435, 491, 32, "#191e19", bold) +
      repeat(12, (i) =>
        line(
          363 + i * 12,
          498,
          363 + i * 12,
          504 + ((i * 7) % 30),
          "#30372e",
          (i % 3) + 1,
        ),
      );
    s +=
      circle(65, 454, 10, "#20251d") +
      path(
        "M57 465l-3 39 11 9 10-48ZM70 476l34-36M62 503l-4 22m9-23 3 23",
        "none",
        "#20251d",
        8,
      ) +
      path("M104 440Q138 372 125 343", "none", "#424638", 1) +
      path(
        "M125 352Q90 318 116 310Q126 311 127 322Q134 304 146 315Q156 332 125 352",
        "#bd3035",
      );
  }
  if (index === 19) {
    s +=
      repeat(670, (i) =>
        line(-535 + i * 2, 535, i * 2, 0, i % 2 ? "#335781" : "#1c3c64", 1.4),
      ) +
      rect(462, 0, 26, 535, "#294567") +
      repeat(
        57,
        (i) =>
          line(461, i * 10, 461, i * 10 + 6, "#b59d61", 1.8) +
          line(486, i * 10, 486, i * 10 + 6, "#b59d61", 1.8),
      );
    s +=
      circle(495, 40, 8, "#c99552", "#8e673c", 2) +
      circle(495, 497, 8, "#c99552", "#8e673c", 2) +
      circle(493, 38, 3, "#e4c183");
    s +=
      rect(312, 466, 119, 33, "#eee3c5", "#b09877", 3) +
      rect(316, 470, 111, 25, "none", "#a55148") +
      text("N E V E R L A N D", 372, 483, 10, "#a04c43", bold) +
      text("E S T .  1 9 8 8", 372, 493, 5, "#a04c43", bold);
  }
  return s;
}
