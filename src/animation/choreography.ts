import { anatomy, jointBetween, type Pose, type Point } from "./rig";
import { mix, smooth } from "./timeline";

// Foot contacts transcribed from the silhouette sequence at 16.75–18.25 s.
// A raised heel and a lifted foot are separate controls: the toe stays planted
// during a heel rise, while the whole shoe leaves the floor during the pickup.
const steps = [
  { left: -48, right: 49, liftL: 0, liftR: 0, heelL: 5, heelR: 16, dip: 2 },
  { left: -20, right: 26, liftL: 0, liftR: 0, heelL: 12, heelR: 20, dip: 0 },
  { left: -27, right: 8, liftL: 0, liftR: 0, heelL: 2, heelR: 8, dip: 7 },
  { left: -25, right: 30, liftL: 0, liftR: 0, heelL: 0, heelR: 16, dip: 3 },
  { left: 7, right: 27, liftL: 0, liftR: 58, heelL: 0, heelR: 22, dip: 7 },
  { left: -24, right: 45, liftL: 0, liftR: 22, heelL: 0, heelR: 16, dip: 3 },
  { left: -42, right: 50, liftL: 0, liftR: 0, heelL: 0, heelR: 20, dip: 1 },
  { left: -47, right: 39, liftL: 28, liftR: 0, heelL: 17, heelR: 9, dip: 7 },
];
// Phase anchors retain observed crossed legs, pickup, and open stance at the
// twenty reference moments. Between them the gait stays continuous.
const phaseControls = [
  [0, 0],
  [5, 0],
  [7.1, 0.75],
  [9.15, 0.125],
  [11.2, 0.375],
  [13.25, 0.25],
  [15.3, 0.375],
  [16.75, 0],
  [17.35, 0.375],
  [18.25, 0.9375],
  [19.4, 0.125],
  [21.45, 0.875],
  [23.5, 0.875],
  [25.55, 0],
  [27.6, 0.75],
  [29.65, 0.75],
  [31.7, 0.25],
  [33.75, 0],
  [35.8, 0.125],
  [37.85, 0.375],
  [39.9, 0.125],
  [41.95, 0],
  [44, 0.25],
  [48, 0.375],
  [50, 0.75],
  [52.017, 0],
];
const phases = phaseControls.map(([time, phase], i) => ({ time, phase, i }));
for (let i = 1; i < phases.length; i++) {
  const prev = phases[i - 1];
  const expected = prev.phase + (phases[i].time - prev.time) / 1.6;
  phases[i].phase += Math.max(0, Math.round(expected - phases[i].phase));
  while (phases[i].phase <= prev.phase) phases[i].phase++;
}
// Hands are relative to the shoulder centre. The reference alternates a low
// palm, the hand at the collar, open arms and a relaxed hand beside the jacket.
const gestures = [
  [0, -36, 76, 20, 24, -8, -0.2],
  [5, -45, 54, 18, 100, -8, -0.18],
  [7.1, -19, 6, 41, 85, -3, 0.18],
  [9.15, -14, 5, 29, 18, -16, -0.25],
  [11.2, -76, 65, 89, 25, -12, 0.55],
  [13.25, -13, 16, 29, 25, -4, -0.1],
  [15.3, -43, 11, 29, 12, 0, -0.18],
  [16.75, -32, 81, 28, 18, -8, -0.3],
  [17.15, -96, 65, 28, 18, -8, -0.3],
  [18.25, -76, 49, 28, 18, -7, -0.26],
  [19.4, -80, 75, 28, 18, -3, -0.12],
  [21.45, -62, 40, 27, 18, -12, -0.25],
  [23.5, -27, 81, 38, 52, -8, -0.26],
  [25.55, -90, 61, 28, 18, -8, -0.35],
  [27.6, -40, 86, 39, 98, 4, 0.4],
  [29.65, -26, 78, 68, 80, -11, 0.42],
  [31.7, -36, 83, 26, 16, 7, 0.4],
  [33.75, -18, 14, 28, 20, -9, -0.32],
  [35.8, -42, 73, 28, 18, -8, -0.25],
  [37.85, -16, 18, 28, 18, -7, -0.15],
  [39.9, -30, 96, 74, 32, 7, 0.25],
  [41.95, -46, 29, 29, 18, -3, -0.12],
  [44, -37, 83, 28, 16, 12, 0.55],
  [46, -58, 66, 24, 20, -6, -0.3],
  [48, -18, 16, 32, 42, -6, -0.2],
  [50, -76, 63, 28, 18, -8, -0.28],
  [52.017, -36, 76, 20, 24, -8, -0.2],
];
function interval(times: number[], time: number) {
  const next = times.findIndex((t) => t > time);
  return next < 0 ? times.length - 2 : Math.max(0, next - 1);
}
export function poseAt(time: number): Pose {
  const i = interval(
    phases.map((a) => a.time),
    time,
  );
  const a = phases[i],
    b = phases[i + 1];
  const phase = mix(
    a.phase,
    b.phase,
    Math.max(0, Math.min(1, (time - a.time) / (b.time - a.time))),
  );
  const cycle = (((phase % 1) + 1) % 1) * steps.length;
  const step = Math.floor(cycle),
    t = smooth(cycle - step);
  const from = steps[step],
    to = steps[(step + 1) % steps.length];
  const value = (key: keyof typeof from) => mix(from[key], to[key], t);
  const g = interval(
    gestures.map((a) => a[0]),
    time,
  );
  const ga = gestures[g],
    gb = gestures[g + 1];
  const gt = smooth((time - ga[0]) / (gb[0] - ga[0]));
  const gv = (index: number) => mix(ga[index], gb[index], gt);
  const hip = {
    x: Math.sin(phase * Math.PI * 2) * 3,
    y: anatomy.pelvisHeight + value("dip"),
  };
  const shoulder = { x: hip.x + gv(5), y: hip.y - anatomy.torso };
  const shoulderL = {
    x: shoulder.x - anatomy.shoulderHalfWidth,
    y: shoulder.y + 2,
  };
  const shoulderR = {
    x: shoulder.x + anatomy.shoulderHalfWidth,
    y: shoulder.y,
  };
  const hipL = { x: hip.x - anatomy.hipHalfWidth, y: hip.y };
  const hipR = { x: hip.x + anatomy.hipHalfWidth, y: hip.y };
  const foot = (x: number, lift: number, heel: number, direction: number) => {
    const toe = { x: hip.x + x + direction * 18, y: anatomy.floor - 7 - lift };
    return { ankle: { x: hip.x + x, y: toe.y - heel - 4 }, toe };
  };
  const l = foot(value("left"), value("liftL"), value("heelL"), -1);
  const r = foot(value("right"), value("liftR"), value("heelR"), 1);
  const hand = (x: number, y: number, origin: Point) => {
    const target = { x: shoulder.x + x, y: shoulder.y + y };
    const d = Math.hypot(target.x - origin.x, target.y - origin.y);
    const scale = Math.min(1, (anatomy.upperArm + anatomy.forearm - 1) / d);
    return {
      x: origin.x + (target.x - origin.x) * scale,
      y: origin.y + (target.y - origin.y) * scale,
    };
  };
  const handL = hand(gv(1), gv(2), shoulderL),
    handR = hand(gv(3), gv(4), shoulderR);
  return {
    hip,
    hipL,
    hipR,
    shoulder,
    shoulderL,
    shoulderR,
    neck: { x: shoulder.x + 1, y: shoulder.y - 11 },
    head: { x: shoulder.x + gv(6) * 17, y: shoulder.y - 33 },
    elbowL: jointBetween(
      shoulderL,
      handL,
      anatomy.upperArm,
      anatomy.forearm,
      1,
    ),
    handL,
    elbowR: jointBetween(
      shoulderR,
      handR,
      anatomy.upperArm,
      anatomy.forearm,
      -0.35,
    ),
    handR,
    kneeL: jointBetween(
      hipL,
      l.ankle,
      anatomy.thigh,
      anatomy.shin,
      Math.max(-1, Math.min(1, 0.2 - gv(6) * 2.4)),
    ),
    ankleL: l.ankle,
    toeL: l.toe,
    kneeR: jointBetween(
      hipR,
      r.ankle,
      anatomy.thigh,
      anatomy.shin,
      Math.max(-1, Math.min(1, 0.2 - gv(6) * 2.4)),
    ),
    ankleR: r.ankle,
    toeR: r.toe,
    tilt: gv(6),
  };
}
