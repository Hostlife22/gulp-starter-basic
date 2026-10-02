import { useEffect, useRef, useState } from "react";
import {
  GalleryRuntime,
  type GalleryLoadState,
} from "../gallery/GalleryRuntime";
import type { PlaybackController } from "../playback/PlaybackController";
import { artworks } from "../data/styles";
import { Title } from "./Title";

export function GalleryStage({
  playback,
  seed,
}: {
  playback: PlaybackController;
  seed: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const runtime = useRef<GalleryRuntime | null>(null);
  const [load, setLoad] = useState<GalleryLoadState>({ state: "loading" });
  useEffect(() => {
    if (!canvas.current || !stage.current || !title.current) return;
    const session = new GalleryRuntime(
      { canvas: canvas.current, stage: stage.current, title: title.current },
      playback,
      seed,
      setLoad,
    );
    runtime.current = session;
    void session.start();
    return () => {
      session.dispose();
      runtime.current = null;
    };
  }, [playback, seed]);
  return (
    <div
      className="stage"
      ref={stage}
      aria-label="The King of Pop animated art gallery"
    >
      <canvas
        ref={canvas}
        role="img"
        aria-label="One dancer travels through twenty art styles, from petroglyphs to embroidered denim. Use the catalogue to select an artwork."
        onClick={(event) => {
          const index = runtime.current?.artworkAt(
            event.clientX,
            event.clientY,
          );
          if (index !== undefined) playback.seek(artworks[index].time);
        }}
      />
      <div ref={title} className="title-layer">
        <Title />
      </div>
      {load.state === "loading" && (
        <p className="loading" role="status">
          Preparing the gallery…
        </p>
      )}
      {load.state === "error" && (
        <p className="error" role="alert">
          {load.message}
        </p>
      )}
    </div>
  );
}
