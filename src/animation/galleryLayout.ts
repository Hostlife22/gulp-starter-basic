import { mix, timelineAt, cameraAt } from "./timeline";
export const layout = {
  width: 1280,
  height: 720,
  poster: 535,
  pitch: 580,
  top: 61,
  gridX: 672,
  gridY: 111,
  thumb: 102,
  stepX: 112,
  stepY: 127,
};
export function cardAt(index: number, time: number, mobile = false) {
  const state = timelineAt(time);
  const grid = state.grid;
  const camera = cameraAt(time);
  const stripX = 425 + index * layout.pitch - camera;
  const gx = mobile
    ? 24 + (index % 2) * 180
    : layout.gridX + (index % 5) * layout.stepX;
  const gy = mobile
    ? 250 + Math.floor(index / 2) * 210
    : layout.gridY + Math.floor(index / 5) * layout.stepY;
  return {
    x: mix(stripX, gx, grid),
    y: mix(layout.top, gy, grid),
    size: mix(layout.poster, mobile ? 156 : layout.thumb, grid),
    alpha:
      time < 3.3 ? Math.min(1, Math.max(0, (time - index * 0.135) / 0.25)) : 1,
  };
}
