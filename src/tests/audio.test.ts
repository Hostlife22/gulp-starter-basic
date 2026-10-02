import { it, expect, vi } from "vitest";
import { AudioSync, type AudioPort } from "../animation/audio";
class Media implements AudioPort {
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
it("stays silent until explicitly enabled and seeks before playback", () => {
  const media = new Media();
  const audio = new AudioSync(media, vi.fn());
  audio.sync(20, true);
  expect(media.play).not.toHaveBeenCalled();
  audio.setEnabled(true, 20, true);
  expect(media.currentTime).toBe(20);
  expect(media.muted).toBe(false);
  expect(media.play).toHaveBeenCalledTimes(1);
});
it("pauses, seeks, mutes and suspends with the visual clock", async () => {
  const media = new Media();
  const audio = new AudioSync(media, vi.fn());
  audio.setEnabled(true, 10, true);
  await Promise.resolve();
  audio.sync(10, false);
  expect(media.paused).toBe(true);
  audio.sync(25, false);
  expect(media.currentTime).toBe(25);
  audio.setEnabled(false, 25, true);
  expect(media.muted).toBe(true);
  expect(media.paused).toBe(true);
  audio.setEnabled(true, 25, true);
  audio.sync(25, true, true);
  expect(media.paused).toBe(true);
  audio.dispose();
  expect(media.paused).toBe(true);
});
it("corrects drift without seeking for ordinary frame jitter", () => {
  const media = new Media();
  const audio = new AudioSync(media, vi.fn());
  audio.setEnabled(true, 10, true);
  audio.sync(10.02, true);
  expect(media.currentTime).toBe(10);
  audio.sync(11, true);
  expect(media.currentTime).toBe(11);
});
it("reports a rejected audio start without breaking the visual clock", async () => {
  const media = new Media();
  media.play.mockRejectedValue(new Error("blocked"));
  const error = vi.fn();
  const audio = new AudioSync(media, error);
  audio.setEnabled(true, 0, true);
  await Promise.resolve();
  await Promise.resolve();
  expect(error).toHaveBeenCalledOnce();
  expect(audio.enabled).toBe(false);
});
