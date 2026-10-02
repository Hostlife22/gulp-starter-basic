import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { PlaybackController } from "../playback/PlaybackController";
export function useGalleryShortcuts(
  playback: PlaybackController,
  setHidden: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.matches("input,button,select,textarea,a")
      )
        return;
      if (event.code === "Space") {
        event.preventDefault();
        playback.toggle();
      }
      if (event.key.toLowerCase() === "h") setHidden((value) => !value);
      if (event.key === "Escape") setHidden(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playback, setHidden]);
}
