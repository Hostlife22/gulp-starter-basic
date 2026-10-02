import type { Pose, Point } from "./rig";
import { mix, smooth } from "./timeline";
// Observed accents: hat touch, straight support leg, bent knee, heel lift, compact dip.
const keys = [
  [
    0, 0, -6, -33, 26, -47, 5, 24, 45, 12, 65, -18, 58, -32, 119, 23, 64, 36,
    123, -0.22,
  ],
  [
    8, 9, -15, -37, 18, -20, -18, 31, 34, 2, 55, -27, 65, -7, 116, 32, 66, 11,
    119, -0.48,
  ],
  [
    0, 1, -4, -29, 39, -46, 35, 25, 28, 10, -3, -8, 62, -27, 124, 17, 61, 37,
    124, -0.18,
  ],
  [
    -5, 7, -9, -24, 35, -9, 60, 30, 20, 11, -23, 20, 54, -7, 118, -25, 65, -35,
    108, 0.06,
  ],
  [
    1, 13, -17, -43, 28, -24, -17, 34, 42, 12, 59, -29, 65, -35, 115, 28, 55, 4,
    121, -0.4,
  ],
  [
    0, 0, -6, -33, 26, -47, 5, 24, 45, 12, 65, -18, 58, -32, 119, 23, 64, 36,
    123, -0.22,
  ],
];
const phaseAnchors = [
  [0, 0],
  [5, 0],
  [7.1, 0.4],
  [9.15, 0.2],
  [11.2, 0.6],
  [13.25, 0.8],
  [15.3, 0.6],
  [17.35, 0],
  [19.4, 0.4],
  [21.45, 0.6],
  [23.5, 0.6],
  [25.55, 0],
  [27.6, 0.2],
  [29.65, 0.8],
  [31.7, 0.2],
  [33.75, 0.2],
  [35.8, 0],
  [37.85, 0.6],
  [39.9, 0],
  [41.95, 0.4],
  [44, 0.2],
  [45, 0.2],
  [46, 0.2],
  [48, 0.4],
  [50, 0.8],
  [52.017, 0],
].map(([time, phase]) => ({ time, phase: Math.floor(time * 0.85) + phase }));
function phaseAt(time: number) {
  const next = phaseAnchors.findIndex((a) => a.time > time);
  const i = next < 0 ? phaseAnchors.length - 2 : Math.max(0, next - 1);
  const a = phaseAnchors[i],
    b = phaseAnchors[i + 1];
  return mix(
    a.phase,
    b.phase,
    Math.min(1, Math.max(0, (time - a.time) / (b.time - a.time))),
  );
}
export function poseAt(time: number): Pose {
  const p = (phaseAt(time) % 1) * 5;
  const k = Math.floor(p);
  const a = keys[k],
    b = keys[k + 1];
  const t = smooth(p - k);
  const v = a.map((n, i) => mix(n, b[i], t));
  const hip: Point = { x: v[0], y: 490 - Math.max(v[14], v[18]) };
  const shoulder = { x: hip.x + v[2], y: hip.y - 110 };
  const relative = (i: number, origin: Point): Point => ({
    x: origin.x + v[i],
    y: origin.y + v[i + 1],
  });
  return {
    hip,
    shoulder,
    neck: { x: shoulder.x - 2, y: shoulder.y - 13 },
    head: { x: shoulder.x - 7, y: shoulder.y - 34 },
    elbowL: relative(3, shoulder),
    handL: relative(5, shoulder),
    elbowR: relative(7, shoulder),
    handR: relative(9, shoulder),
    kneeL: relative(11, hip),
    ankleL: relative(13, hip),
    toeL: { x: hip.x + v[13] - 19, y: hip.y + v[14] + 10 },
    kneeR: relative(15, hip),
    ankleR: relative(17, hip),
    toeR: { x: hip.x + v[17] + 17, y: hip.y + v[18] + 10 },
    tilt: v[19],
  };
}
