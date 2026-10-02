import { vi } from "vitest";
import type { AudioPort } from "../../animation/audio";
export class Media implements AudioPort {
  currentTime = 0;
  duration = 52.074667;
  readyState = 4;
  paused = true;
  muted = true;
  play = vi.fn(async () => {
    this.paused = false;
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
}
