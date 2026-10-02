export interface Point {
  x: number;
  y: number;
}
export interface Pose {
  head: Point;
  neck: Point;
  shoulder: Point;
  hip: Point;
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
