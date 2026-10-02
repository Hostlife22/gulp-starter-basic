export interface Point {
  x: number;
  y: number;
}
export interface Pose {
  head: Point;
  neck: Point;
  shoulder: Point;
  shoulderL: Point;
  shoulderR: Point;
  hip: Point;
  hipL: Point;
  hipR: Point;
  elbowL: Point;
  handL: Point;
  elbowR: Point;
  handR: Point;
  kneeL: Point;
  ankleL: Point;
  toeL: Point;
  kneeR: Point;
  ankleR: Point;
  toeR: Point;
  tilt: number;
}
// Measurements in the 535 px artwork coordinate system, estimated from the video.
export const anatomy = {
  floor: 505,
  pelvisHeight: 345,
  torso: 103,
  shoulderHalfWidth: 27,
  hipHalfWidth: 12,
  upperArm: 48,
  forearm: 43,
  thigh: 79,
  shin: 77,
};
/** Two-bone IK. Bend is the screen projection of the bending plane
 * (−1…1); intermediate values foreshorten a joint turning toward the camera. */
export function jointBetween(
  a: Point,
  b: Point,
  upper: number,
  lower: number,
  bend: number,
): Point {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  const distance = Math.max(0.001, Math.hypot(dx, dy));
  const d = Math.min(
    upper + lower - 0.001,
    Math.max(Math.abs(upper - lower) + 0.001, distance),
  );
  const along = (upper * upper - lower * lower + d * d) / (2 * d);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  return {
    x: a.x + (dx / distance) * along - (dy / distance) * height * bend,
    y: a.y + (dy / distance) * along + (dx / distance) * height * bend,
  };
}
