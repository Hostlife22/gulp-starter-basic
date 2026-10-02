import { anatomy, jointBetween, type Pose, type Point } from "./rig";
import { mix, smooth } from "./timeline";
import { steps, phaseControls, gestures } from "../data/choreography";

const phases = phaseControls.map(([time, phase]) => ({ time, phase }));
for (let i = 1; i < phases.length; i++) {
  const prev = phases[i - 1];
  const expected = prev.phase + (phases[i].time - prev.time) / 1.6;
  phases[i].phase += Math.max(0, Math.round(expected - phases[i].phase));
  while (phases[i].phase <= prev.phase) phases[i].phase++;
}

const phaseTimes = phases.map((frame) => frame.time);
const gestureTimes = gestures.map((frame) => frame.time);

function interval(times: number[], time: number) {
  const next = times.findIndex((t) => t > time);
  return next < 0 ? times.length - 2 : Math.max(0, next - 1);
}
export function poseAt(time: number): Pose {
  const i = interval(phaseTimes, time);
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
  const g = interval(gestureTimes, time);
  const ga = gestures[g],
    gb = gestures[g + 1];
  const gt = smooth((time - ga.time) / (gb.time - ga.time));
  const gv = (index: Exclude<keyof typeof ga, "time">) =>
    mix(ga[index], gb[index], gt);
  const hip = {
    x: Math.sin(phase * Math.PI * 2) * 3,
    y: anatomy.pelvisHeight + value("dip"),
  };
  const shoulder = { x: hip.x + gv("lean"), y: hip.y - anatomy.torso };
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
  const handL = hand(gv("handLeftX"), gv("handLeftY"), shoulderL),
    handR = hand(gv("handRightX"), gv("handRightY"), shoulderR);
  return {
    hip,
    hipL,
    hipR,
    shoulder,
    shoulderL,
    shoulderR,
    neck: { x: shoulder.x + 1, y: shoulder.y - 11 },
    head: { x: shoulder.x + gv("tilt") * 17, y: shoulder.y - 33 },
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
      Math.max(-1, Math.min(1, 0.2 - gv("tilt") * 2.4)),
    ),
    ankleL: l.ankle,
    toeL: l.toe,
    kneeR: jointBetween(
      hipR,
      r.ankle,
      anatomy.thigh,
      anatomy.shin,
      Math.max(-1, Math.min(1, 0.2 - gv("tilt") * 2.4)),
    ),
    ankleR: r.ankle,
    toeR: r.toe,
    tilt: gv("tilt"),
  };
}
