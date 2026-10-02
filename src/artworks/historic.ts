import {
  rect,
  path,
  circle,
  text,
  line,
  repeat,
  bold,
  serif,
  mono,
} from "./svg";
export function historic(index: number): string {
  let s = "";
  if (index === 5) {
    s +=
      circle(267, 282, 225, "none", "#8e7e52", 1.5) +
      rect(91, 139, 352, 358, "none", "#786e49", 1.4) +
      line(267, 50, 267, 519, "#aa9867") +
      line(32, 282, 507, 282, "#aa9867");
    s +=
      repeat(19, (i) => line(85 + i * 20, 495, 85 + i * 20, 501, "#776b49")) +
      repeat(6, (i) =>
        text(
          [
            "motus et corpus · proportione divina",
            "il passo della luna — studium",
            "mensura manus et corporis",
          ][i % 3],
          131 + (i % 2) * 27,
          31 + i * 12,
          10,
          "#796442",
          `${serif} font-style="italic"`,
        ),
      );
    s += text(
      "Figura in movimento · studio delle proporzioni",
      267,
      523,
      9,
      "#766648",
      bold,
    );
  }
  if (index === 6) {
    s += repeat(10 * 10, (i) =>
      text(
        "♠",
        15 + (i % 10) * 54,
        35 + Math.floor(i / 10) * 54,
        31,
        "#215442",
        serif,
      ),
    );
    s += `<ellipse cx="267" cy="278" rx="215" ry="247" fill="#c0a258"/><ellipse cx="267" cy="278" rx="208" ry="241" fill="#f2e9c8" stroke="#503f26" stroke-width="3"/>`;
    s += path(
      "M267 29q-38-39-42-14q15 11 42 14q38-39 42-14q-15 11-42 14",
      "#e3ca8a",
    );
    s +=
      rect(184, 503, 165, 23, "#c8ad6b", "#665137") +
      text(
        "Le roi de la danse",
        267,
        519,
        12,
        "#6c5532",
        `${bold} font-style="italic"`,
      );
  }
  if (index === 7) {
    s += path(
      "M0 439Q34 201 124 130Q224 40 347 143Q267 104 249 167Q254 195 291 188Q189 270 186 410L274 441Z",
      "#204e86",
    );
    s += repeat(17, (i) =>
      path(
        `M${8 + i * 10} 425Q${68 + i * 9} ${170 - i * 3} ${246 + i * 4} 127`,
        "none",
        "#6789a5",
        1.3,
      ),
    );
    s +=
      path(
        "M119 133Q245 67 347 143Q291 115 238 117Q179 109 119 133",
        "#f1ebd6",
      ) +
      repeat(40, (i) =>
        circle(255 + ((i * 37) % 134), 100 + ((i * 17) % 94), 1.8, "#f2ecd9"),
      );
    s +=
      path("M331 416l67-66 63 66Z", "#234d7c") +
      path("M381 367l17-17 18 19-15-7-8 7Z", "#eee9d5") +
      rect(0, 429, 535, 106, "#285b8d");
    s += repeat(9 * 19, (i) =>
      path(
        `M${(i % 19) * 30 - 10} ${437 + Math.floor(i / 19) * 12}q8-13 16 0`,
        "none",
        "#afc0be",
        1.3,
      ),
    );
    s +=
      rect(477, 20, 36, 189, "#eee2b3", "#8d794c") +
      repeat(7, (i) =>
        text("月舞神君之王印"[i], 485, 41 + i * 22, 17, "#383f34", serif),
      ) +
      rect(452, 20, 18, 27, "#af4234") +
      text("印", 453, 39, 15, "#e9d9b0");
  }
  if (index === 8) {
    s +=
      repeat(124, (i) =>
        text(
          "×",
          10 + (i % 62) * 8.4,
          15 + Math.floor(i / 62) * 503,
          10,
          "#6b7955",
          mono,
        ),
      ) +
      repeat(
        58,
        (i) =>
          text("×", 8, 27 + i * 8.3, 10, "#77835b", mono) +
          text("×", 519, 27 + i * 8.3, 10, "#77835b", mono),
      );
    s +=
      text("ABCDEFGHIJKLM", 41, 48, 27, "#ae7770", mono) +
      text("NOPQRSTUVWXYZ", 41, 78, 27, "#7c8290", mono) +
      text("1958", 406, 145, 27, "#a57068", mono) +
      text("♥", 47, 154, 31, "#ad7067") +
      text("♥", 453, 184, 29, "#ad7067");
    s += repeat(2, (i) => {
      const x = 40 + i * 431;
      return (
        path(`M${x} 289l20-23 20 23v37h-40Z`, "#ac8272") +
        rect(x + 17, 304, 8, 22, "#e1d6b2") +
        text("♠", x, 395, 42, "#7b9065")
      );
    });
    s += text("BILLIE JEAN HER WORK", 25, 514, 23, "#73735a", mono);
  }
  if (index === 9) {
    s +=
      rect(31, 25, 473, 25, "#b0382d") +
      text("★  ONE WEEK ONLY  ★", 267, 44, 17, "#f6e8c5", bold) +
      text("THE KING", 267, 94, 43, "#171815", bold) +
      text(
        "THE MOST ASTOUNDING MOONWALKER ON EARTH",
        267,
        114,
        10,
        "#22221e",
        bold,
      ) +
      line(38, 123, 497, 123, "#25241d", 2) +
      text("OF POP", 267, 150, 31, "#ab3b2a", bold);
    s += repeat(2, (i) => {
      const x = i ? 447 : 70;
      return (
        ["WALKS", "BACK", "WARDS!"]
          .map((v, j) =>
            text(
              i ? ["SPINS", "LIKE A", "TOP!"][j] : v,
              x,
              219 + j * 21,
              17,
              "#23231e",
              bold,
            ),
          )
          .join("") +
        text(i ? "ADMISSION" : "DEFIES", x, 316, 15, "#b53c29", bold) +
        text(i ? "10¢" : "GRAVITY", x, 335, 18, "#b53c29", bold)
      );
    });
    s += text("TWICE NIGHTLY · 8 & 10", 267, 516, 15, "#24231e", bold);
  }
  return s;
}
