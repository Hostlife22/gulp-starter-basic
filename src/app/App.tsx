import { useState } from "react";
import { timelineAt } from "../animation/timeline";
import { PlaybackControls } from "../components/PlaybackControls";
import { ArtworkCatalogue } from "../components/ArtworkCatalogue";
import { GalleryStage } from "../components/GalleryStage";
import { usePlayback } from "../hooks/usePlayback";
import { useGalleryShortcuts } from "../hooks/useGalleryShortcuts";
import { readGalleryOptions } from "./options";

export function App() {
  const [options] = useState(() =>
    readGalleryOptions(
      location.search,
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  );
  const [hidden, setHidden] = useState(options.controlsHidden);
  const { controller, status, audioRef } = usePlayback(options);
  useGalleryShortcuts(controller, setHidden);
  const state = timelineAt(status.time);
  return (
    <main className={hidden ? "reference-view" : undefined}>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/reference-soundtrack.m4a`}
        preload="metadata"
        hidden
        onPlaying={controller.mediaPlaying}
        onError={controller.mediaFailed}
      />
      <a className="skip-link" href="#catalogue">
        Skip to artwork catalogue
      </a>
      <GalleryStage playback={controller} seed={options.seed} />
      <PlaybackControls
        time={status.time}
        playing={status.playing}
        hidden={hidden}
        sound={status.sound}
        onSound={controller.toggleSound}
        active={state.index}
        onToggle={controller.toggle}
        onSeek={controller.seek}
        onReplay={controller.replay}
        onOverview={controller.overview}
        onHide={() => setHidden((value) => !value)}
      />
      {status.message && !hidden && (
        <p className="media-note" role="status">
          {status.message}
        </p>
      )}
      <ArtworkCatalogue
        hidden={hidden}
        activeIndex={state.grid < 0.5 ? state.index : null}
        onSelect={controller.seek}
      />
    </main>
  );
}
