import type { Point, Pose } from "../../animation/rig";
import { limb, ellipse, rounded, articulated } from "./paths";
export interface Part {
  points: Point[];
  kind:
    | "cloth"
    | "skin"
    | "white"
    | "shirt"
    | "lapel"
    | "shoe"
    | "hat"
    | "trouser"
    | "band";
}
export function figureParts(p: Pose): Part[] {
  const parts: Part[] = [];
  const add = (points: Point[], kind: Part["kind"] = "cloth") =>
    parts.push({ points, kind });
  const shoe = (ankle: Point, toe: Point) => {
    const angle = Math.atan2(toe.y - ankle.y, toe.x - ankle.x);
    const length = Math.hypot(toe.x - ankle.x, toe.y - ankle.y);
    const direction = toe.x < ankle.x ? -1 : 1;
    const transform = (x: number, y: number) => ({
      x: ankle.x + x * Math.cos(angle) - y * Math.sin(angle) * direction,
      y: ankle.y + x * Math.sin(angle) + y * Math.cos(angle) * direction,
    });
    add(
      rounded(
        [
          transform(-9, -7),
          transform(4, -9),
          transform(10, -3),
          transform(length + 7, -2),
          transform(length + 10, 4),
          transform(length + 5, 9),
          transform(-9, 9),
        ],
        6,
      ),
      "shoe",
    );
  };
  for (const side of ["R", "L"] as const) {
    const hip = p[`hip${side}`],
      knee = p[`knee${side}`],
      ankle = p[`ankle${side}`];
    const d = Math.hypot(ankle.x - knee.x, ankle.y - knee.y);
    const cuff = {
      x: ankle.x - ((ankle.x - knee.x) / d) * 15,
      y: ankle.y - ((ankle.y - knee.y) / d) * 15,
    };
    add(articulated(hip, knee, cuff, [16, 12, 10]), "trouser");
    add(rounded(limb(cuff, ankle, 8, 7), 4), "white");
    shoe(ankle, p[`toe${side}`]);
  }
  // Rear sleeve first; front sleeve and gloved hand overlap the jacket.
  add(articulated(p.shoulderR, p.elbowR, p.handR, [14, 11, 7]));
  const left = p.shoulderL,
    right = p.shoulderR;
  add(
    rounded(
      [
        { x: left.x - 5, y: left.y - 4 },
        { x: p.shoulder.x - 12, y: p.shoulder.y - 5 },
        { x: p.shoulder.x, y: p.shoulder.y + 4 },
        { x: p.shoulder.x + 13, y: p.shoulder.y - 6 },
        { x: right.x + 5, y: right.y - 3 },
        { x: p.hip.x + 21, y: p.hip.y - 29 },
        { x: p.hip.x + 25, y: p.hip.y + 9 },
        { x: p.hip.x - 26, y: p.hip.y + 9 },
        { x: p.hip.x - 21, y: p.hip.y - 28 },
      ],
      7,
    ),
  );
  add(
    [
      { x: p.shoulder.x - 12, y: p.shoulder.y },
      { x: p.shoulder.x + 9, y: p.shoulder.y },
      { x: p.hip.x + 5, y: p.hip.y - 37 },
      { x: p.hip.x - 6, y: p.hip.y - 37 },
    ],
    "shirt",
  );
  for (const side of [-1, 1]) {
    add(
      [
        { x: p.shoulder.x + side * 25, y: p.shoulder.y + 22 },
        { x: p.shoulder.x + side * 6, y: p.shoulder.y + 39 },
        { x: p.shoulder.x + side * 6, y: p.shoulder.y + 43 },
        { x: p.shoulder.x + side * 25, y: p.shoulder.y + 26 },
      ],
      "lapel",
    );
  }
  add(
    rounded(limb(p.neck, { x: p.head.x, y: p.head.y + 15 }, 7, 8), 4),
    "skin",
  );
  const head = (x: number, y: number): Point => ({
    x: p.head.x + x * Math.cos(p.tilt) - y * Math.sin(p.tilt),
    y: p.head.y + x * Math.sin(p.tilt) + y * Math.cos(p.tilt),
  });
  add(ellipse(p.head, 23, 27, p.tilt), "shoe");
  for (const [x, y] of [
    [-18, -9],
    [-21, 2],
    [-19, 12],
    [-13, 21],
    [18, -8],
    [21, 3],
    [18, 15],
  ])
    add(ellipse(head(x, y), 6, 8, p.tilt), "shoe");
  add(
    rounded(
      [
        head(-13, -17),
        head(9, -18),
        head(16, -8),
        head(15, 1),
        head(19, 5),
        head(13, 9),
        head(10, 19),
        head(1, 24),
        head(-10, 20),
        head(-15, 8),
      ],
      5,
    ),
    "skin",
  );
  add(articulated(p.shoulderL, p.elbowL, p.handL, [14, 10, 6]));
  const hand = (elbow: Point, wrist: Point, glove: boolean) => {
    const angle =
      Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) - Math.PI / 2;
    add(
      ellipse(wrist, glove ? 8 : 7, glove ? 14 : 12, angle),
      glove ? "white" : "skin",
    );
  };
  hand(p.elbowL, p.handL, false);
  hand(p.elbowR, p.handR, true);
  // Indented crown and an oval brim, both rotating with the head.
  add(
    rounded(
      [
        head(-24, -20),
        head(-22, -39),
        head(-12, -42),
        head(-4, -38),
        head(7, -45),
        head(20, -40),
        head(25, -20),
      ],
      4,
    ),
    "hat",
  );
  add([head(-24, -25), head(24, -25), head(25, -19), head(-25, -19)], "band");
  add(ellipse(head(0, -18), 40, 5, p.tilt), "hat");
  return parts;
}
