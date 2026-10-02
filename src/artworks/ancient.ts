import { rect, path, circle, text, line, repeat, bold, serif } from "./svg";
import { random } from "../textures/random";
export function ancient(index: number): string {
  const r = random(340 + index);
  let s = "";
  if (index === 0) {
    s += path(
      "M42 80l14-14 14 14 14-14 14 14 14-14 14 14M240 43v52m-20-26h40M493 204l-8 12 8 12-8 12 8 12-8 12 8 12",
      "none",
      "#c7af7b",
      2,
    );
    s +=
      circle(428, 73, 20, "none", "#c7af7b", 2) +
      circle(428, 73, 8, "none", "#c7af7b", 2) +
      repeat(12, (i) => {
        const a = (i * Math.PI) / 6;
        return line(
          428 + 27 * Math.cos(a),
          73 + 27 * Math.sin(a),
          428 + 39 * Math.cos(a),
          73 + 39 * Math.sin(a),
          "#c7af7b",
          2,
        );
      });
    let d = "";
    for (let i = 0; i < 160; i++) {
      const a = i * 0.14,
        rad = i * 0.31;
      d += `${i ? "L" : "M"}${88 + rad * Math.cos(a)} ${302 + rad * Math.sin(a)} `;
    }
    s += path(d, "none", "#c5ad7e", 2.5);
    s += `<g transform="translate(159 115) rotate(-30)" fill="#a34e32"><ellipse rx="12" ry="17"/>${repeat(5, (i) => rect(-18 + i * 7, -34 + (i === 0 ? 8 : 0), 5, 29, "#a34e32"))}</g>`;
    s += repeat(5, (i) =>
      path(
        `M${360 + i * 30} 477v24m-8-24 8 7 8-7m-8 24-6 8m6-8 6 8`,
        "none",
        "#b49b6b",
        2,
      ),
    );
    s += path(
      "M49 482h54l-6-15m6 15 9-11M58 482v22m31-22v22M47 482l-7-10",
      "none",
      "#c9ae7d",
      2,
    );
  }
  if (index === 1) {
    s += rect(13, 13, 509, 509, "none", "#374b51", 3);
    s += repeat(
      82,
      (i) =>
        rect(15 + i * 6.2, 3, 4, 11, ["#b14233", "#365b83", "#d3ad39"][i % 3]) +
        rect(
          15 + i * 6.2,
          521,
          4,
          11,
          ["#b14233", "#365b83", "#d3ad39"][i % 3],
        ),
    );
    s +=
      rect(20, 25, 27, 479, "none", "#a9663e") +
      repeat(20, (i) =>
        text(
          ["☥", "𓂀", "𓆣", "♆", "⊙"][i % 5],
          25,
          43 + i * 23,
          17,
          ["#aa5c38", "#466b6c", "#bd9c31"][i % 3],
        ),
      );
    s += path(
      "M365 83Q330 61 303 79Q321 89 365 83M397 83Q431 62 464 79Q436 91 397 83",
      "#366090",
    );
    s += circle(382, 81, 30, "#dda835", "#a06435", 2);
    s +=
      `<rect x="479" y="172" width="29" height="148" rx="13" fill="none" stroke="#946847"/>` +
      repeat(6, (i) =>
        text(
          ["☥", "⊙", "♆"][i % 3],
          484,
          196 + i * 21,
          18,
          ["#a95b36", "#4b7778"][i % 2],
        ),
      );
  }
  if (index === 2) {
    s +=
      rect(12, 12, 511, 511, "none", "#373a32", 9) +
      rect(26, 26, 483, 483, "none", "#34372f", 3);
    s += repeat(
      78,
      (i) =>
        rect(8 + i * 6.65, 14, 4, 9, i % 2 ? "#e4ddc3" : "#242722") +
        rect(8 + i * 6.65, 512, 4, 9, i % 2 ? "#e4ddc3" : "#242722") +
        rect(14, 8 + i * 6.65, 9, 4, i % 2 ? "#e4ddc3" : "#242722") +
        rect(512, 8 + i * 6.65, 9, 4, i % 2 ? "#e4ddc3" : "#242722"),
    );
    s += text("REX POPVLI", 267, 65, 39, "#9d4a3b", bold);
    s += repeat(72 * 70, (i) => {
      const x = 30 + (i % 72) * 6.6,
        y = 74 + Math.floor(i / 72) * 6.1;
      return rect(
        x + r(),
        y + r(),
        5.3,
        4.8,
        `rgba(82,78,57,${0.05 + r() * 0.2})`,
      );
    });
  }
  if (index === 3) {
    s +=
      `<defs><clipPath id="lancet"><path d="M67 498V222Q65 82 267-20Q469 82 468 222V498Z"/></clipPath></defs><g clip-path="url(#lancet)">` +
      rect(50, 0, 435, 510, "#5376b3");
    const vertices = Array.from({ length: 22 }, (_, row) =>
      Array.from({ length: 19 }, (_, col) => ({
        x: 42 + col * 25 + (r() - 0.5) * 22,
        y: row * 25 + (r() - 0.5) * 22,
      })),
    );
    s += repeat(21 * 18, (i) => {
      const row = Math.floor(i / 18),
        col = i % 18;
      const a = vertices[row][col],
        b = vertices[row][col + 1],
        c = vertices[row + 1][col],
        d = vertices[row + 1][col + 1];
      return (
        path(
          `M${a.x} ${a.y}L${b.x} ${b.y}L${c.x} ${c.y}Z`,
          ["#536cb1", "#687fc1", "#44669d", "#757abb", "#405986"][i % 5],
          "#252d43",
          1.6,
        ) +
        path(
          `M${b.x} ${b.y}L${d.x} ${d.y}L${c.x} ${c.y}Z`,
          ["#678cbe", "#4b70ac", "#697fa6"][i % 3],
          "#252d43",
          1.6,
        )
      );
    });
    s +=
      rect(62, 468, 407, 38, "#a65368") +
      repeat(18, (i) =>
        path(
          `M${64 + i * 23} 470l23 33-23 0Z`,
          i % 2 ? "#d0ab56" : "#718b99",
          "#232323",
          2,
        ),
      );
    s +=
      "</g>" +
      path(
        "M67 498V222Q65 82 267-20Q469 82 468 222V498Z",
        "none",
        "#17181a",
        10,
      ) +
      line(67, 287, 468, 287, "#161d26", 7) +
      rect(86, 473, 365, 27, "#e6d5a0", "#302523", 3) +
      text("♧  KING OF POP  ♧", 267, 493, 17, "#342725", bold);
  }
  if (index === 4) {
    s +=
      rect(24, 24, 487, 487, "none", "#ab7050", 1) +
      rect(38, 38, 130, 117, "#294a8a", "#bc9c4f", 5) +
      text("𝕸", 44, 140, 120, "#d2b349", serif);
    s += repeat(7, (i) =>
      text(
        [
          "Michael cantat rex",
          "et motus mirabilis",
          "super terram est",
          "cantus bonus",
          "Billie Jean non est",
          "amica mea · rex",
          "in aeternum",
        ][i],
        180,
        48 + i * 15,
        13,
        "#514529",
        serif,
      ),
    );
    s +=
      path(
        "M493 28Q475 80 492 122T489 220T493 314T487 420T493 507",
        "none",
        "#567349",
        2,
      ) +
      repeat(26, (i) => {
        const y = 35 + i * 18;
        return path(
          `M489 ${y}q${i % 2 ? 20 : -19} -13 ${i % 2 ? 9 : -9} -18q-10 0 0 18`,
          i % 3 ? "#557547" : "#aa4f42",
        );
      });
    s +=
      text("Thou art no Billie wooer", 267, 486, 14, "#6a452a", bold) +
      text("Dance, dance, illumine.", 267, 503, 14, "#a95743", bold);
  }
  return s;
}
