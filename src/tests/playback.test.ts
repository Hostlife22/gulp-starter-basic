import { expect, it, vi } from "vitest";
import { PlaybackController } from "../playback/PlaybackController";
import { DURATION } from "../animation/timeline";
import { Media } from "./helpers/Media";
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const paused = () =>
  new PlaybackController({ initialTime: 5, reducedMotion: false });

it("publishes immediate commands, throttles clock updates, and unsubscribes", () => {
  const controller = paused();
  const listener = vi.fn();
  const unsubscribe = controller.subscribe(listener);
  const initial = controller.getSnapshot();
  controller.seek(5);
  expect(controller.getSnapshot()).toBe(initial);
  expect(listener).not.toHaveBeenCalled();
  controller.toggle();
  expect(controller.getSnapshot().playing).toBe(true);
  controller.advance(1000);
  controller.advance(1020);
  expect(controller.getSnapshot().time).toBe(5);
  controller.advance(1090);
  expect(controller.getSnapshot().time).toBeCloseTo(5.09);
  unsubscribe();
  listener.mockClear();
  controller.seek(12);
  expect(listener).not.toHaveBeenCalled();
});
it("uses the same audio preference through mute, replay, overview and reconnect", async () => {
  const controller = paused(),
    media = new Media();
  const disconnect = controller.connectAudio(media);
  controller.toggle();
  await flush();
  expect(media.paused).toBe(false);
  controller.toggleSound();
  controller.replay();
  expect(controller.getSnapshot()).toMatchObject({
    time: 0,
    playing: true,
    sound: "off",
  });
  expect(media.paused).toBe(true);
  expect(media.muted).toBe(true);
  controller.overview();
  expect(controller.getSnapshot()).toMatchObject({ time: 48, playing: false });
  disconnect();
  const replacement = new Media();
  controller.connectAudio(replacement);
  controller.replay();
  expect(replacement.muted).toBe(true);
  expect(replacement.play).not.toHaveBeenCalled();
});
it("recovers blocked autoplay with one sound command and waits for the media event", async () => {
  const controller = new PlaybackController({
    initialTime: null,
    reducedMotion: false,
  });
  const media = new Media();
  media.play.mockRejectedValueOnce(
    new DOMException("Blocked", "NotAllowedError"),
  );
  controller.connectAudio(media);
  controller.advance(1000);
  await flush();
  expect(controller.getSnapshot().sound).toBe("blocked");
  controller.toggleSound();
  await flush();
  expect(media.play).toHaveBeenCalledTimes(2);
  expect(media.paused).toBe(false);
  expect(controller.getSnapshot().sound).toBe("blocked");
  controller.mediaPlaying();
  expect(controller.getSnapshot()).toMatchObject({ sound: "on", message: "" });
});
it("suspends a hidden clock and stops both media and motion at the final gallery", async () => {
  const controller = paused(),
    media = new Media();
  controller.connectAudio(media);
  controller.toggle();
  controller.advance(1000);
  await flush();
  controller.visibility(true);
  expect(media.paused).toBe(true);
  controller.advance(100000);
  expect(controller.getSnapshot().time).toBe(5);
  controller.visibility(false);
  controller.seek(DURATION - 0.01);
  controller.advance(200000);
  controller.advance(200100);
  expect(controller.getSnapshot()).toMatchObject({
    time: DURATION,
    playing: false,
  });
  expect(media.paused).toBe(true);
  controller.toggle();
  expect(controller.getSnapshot()).toMatchObject({ time: 0, playing: true });
});
it("ignores failed media promises after the audio connection has been disposed", async () => {
  const controller = paused(),
    media = new Media();
  let reject!: (error: Error) => void;
  media.play.mockImplementation(
    () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      }),
  );
  const disconnect = controller.connectAudio(media);
  controller.toggle();
  disconnect();
  reject(new Error("Late failure"));
  await flush();
  expect(controller.getSnapshot().sound).toBe("on");
  expect(controller.getSnapshot().message).toBe("");
  expect(media.paused).toBe(true);
});
