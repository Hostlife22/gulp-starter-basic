import { useEffect, useRef, useState } from "react";
import { AudioSync } from "../animation/audio";
import { Clock } from "../animation/clock";
import { timelineAt, DURATION } from "../animation/timeline";
import { loadBackgrounds } from "../artworks/backgrounds";
import { GalleryRenderer } from "../renderers/gallery";
import { Title } from "../components/Title";
import { PlaybackControls } from "../components/PlaybackControls";
import { artworks } from "../data/styles";
const params = new URLSearchParams(location.search);
const initialTime = params.has("time") ? Number(params.get("time")) : null;
export function App() {
  const [clock] = useState(() => {
    const c = new Clock();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (initialTime !== null || reduced) {
      c.seek(initialTime ?? 48);
      c.setPlaying(false);
    }
    return c;
  });
  const [status, setStatus] = useState({
    time: clock.time,
    playing: clock.playing,
  });
  const [hidden, setHidden] = useState(params.get("controls") === "0");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [audioError, setAudioError] = useState("");
  const soundPreference = useRef<"muted" | "enabled">("enabled");
  const audio = useRef<HTMLAudioElement>(null);
  const soundtrack = useRef<AudioSync | null>(null);
  useEffect(() => {
    if (!audio.current) return;
    const sync = new AudioSync(audio.current, (message, blocked) => {
      setAudioError(message);
      setSoundBlocked(blocked);
      if (!blocked) {
        setSoundOn(false);
        soundPreference.current = "muted";
      }
    });
    soundtrack.current = sync;
    const activate = (event: Event) => {
      if (!event.isTrusted || soundPreference.current === "muted") return;
      setAudioError("");
      sync.setEnabled(true, clock.time, clock.playing && !document.hidden);
    };
    window.addEventListener("click", activate);
    window.addEventListener("keydown", activate);
    return () => {
      window.removeEventListener("click", activate);
      window.removeEventListener("keydown", activate);
      sync.dispose();
      soundtrack.current = null;
    };
  }, [clock]);
  const startSound = () => {
    if (soundPreference.current !== "muted") {
      soundPreference.current = "enabled";
      setSoundOn(true);
      setAudioError("");
      soundtrack.current?.setEnabled(true, clock.time, clock.playing);
    }
  };

  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const renderer = useRef<GalleryRenderer | null>(null);
  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let lastUi = 0;
    let lastTime = -1;
    let dirty = true;
    let width = 1280,
      height = 720;
    const el = canvas.current;
    const container = stage.current;
    if (!el || !container) return;
    const ctx = el.getContext("2d");
    if (!ctx) {
      setError(
        "This browser cannot display the canvas gallery. The complete catalogue remains available below.",
      );
      return;
    }
    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibility = () => {
      clock.visibility(document.hidden);
      soundtrack.current?.sync(clock.time, clock.playing, document.hidden);
    };
    document.addEventListener("visibilitychange", visibility);
    const loop = (now: number) => {
      if (disposed) return;
      const time = clock.tick(now);
      soundtrack.current?.sync(time, clock.playing, document.hidden);
      const state = timelineAt(time);
      const mobile = window.innerWidth < 640;
      container.classList.toggle("mobile-grid", mobile && state.grid > 0.99);
      if (renderer.current && (dirty || time !== lastTime)) {
        renderer.current.render(ctx, width, height, time, mobile);
        dirty = false;
        lastTime = time;
      }
      if (title.current)
        title.current.style.opacity = String(state.title * state.fade);
      if (now - lastUi > 80) {
        setStatus({ time, playing: clock.playing });
        lastUi = now;
      }
      frame = requestAnimationFrame(loop);
    };
    Promise.all([
      loadBackgrounds(Number(params.get("seed")) || 1983),
      document.fonts.ready,
    ])
      .then(([backgrounds]) => {
        if (disposed) return;
        renderer.current = new GalleryRenderer(backgrounds);
        resize();
        setReady(true);
        frame = requestAnimationFrame(loop);
      })
      .catch((e: unknown) => {
        if (!disposed)
          setError(e instanceof Error ? e.message : "Unable to render gallery");
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      renderer.current = null;
    };
  }, [clock]);
  const seek = (t: number) => {
    clock.seek(t);
    soundtrack.current?.sync(clock.time, clock.playing, document.hidden);
    setStatus({ time: clock.time, playing: clock.playing });
  };
  const toggle = () => {
    if (clock.time >= DURATION) clock.seek(0);
    clock.setPlaying(!clock.playing);
    if (clock.playing) startSound();
    else soundtrack.current?.sync(clock.time, false);
    setStatus({ time: clock.time, playing: clock.playing });
  };
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches("input,button,select,textarea,a"))
        return;
      if (e.code === "Space") {
        e.preventDefault();
        if (clock.time >= DURATION) clock.seek(0);
        clock.setPlaying(!clock.playing);
        if (clock.playing && soundPreference.current !== "muted") {
          soundPreference.current = "enabled";
          setSoundOn(true);
          setAudioError("");
          soundtrack.current?.setEnabled(true, clock.time, true);
        } else soundtrack.current?.sync(clock.time, clock.playing);
      }
      if (e.key.toLowerCase() === "h") setHidden((v) => !v);
      if (e.key === "Escape") setHidden(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clock]);
  const state = timelineAt(status.time);
  return (
    <main className={hidden ? "reference-view" : undefined}>
      <audio
        ref={audio}
        src={`${import.meta.env.BASE_URL}audio/reference-soundtrack.m4a`}
        preload="metadata"
        onPlaying={() => {
          setSoundBlocked(false);
          setAudioError("");
        }}
        hidden
        onError={() => {
          setAudioError(
            "Soundtrack could not load. The visual gallery is still available.",
          );
          setSoundOn(false);
          soundPreference.current = "muted";
          soundtrack.current?.setEnabled(false, clock.time, clock.playing);
        }}
      />

      <a className="skip-link" href="#catalogue">
        Skip to artwork catalogue
      </a>
      <div
        className="stage"
        ref={stage}
        aria-label="The King of Pop animated art gallery"
      >
        <canvas
          ref={canvas}
          role="img"
          aria-label="One dancer travels through twenty art styles, from petroglyphs to embroidered denim. Use the catalogue to select an artwork."
          onClick={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const hit = renderer.current?.hits.find(
              (h) =>
                e.clientX - box.left >= h.x &&
                e.clientX - box.left <= h.x + h.width &&
                e.clientY - box.top >= h.y &&
                e.clientY - box.top <= h.y + h.height,
            );
            if (hit) seek(artworks[hit.index].time);
          }}
        />
        <div ref={title} className="title-layer">
          <Title />
        </div>
        {!ready && !error && (
          <p className="loading" role="status">
            Preparing the gallery…
          </p>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      <PlaybackControls
        time={status.time}
        playing={status.playing}
        hidden={hidden}
        soundOn={soundOn}
        soundBlocked={soundBlocked}
        onSound={() => {
          const enabled = soundBlocked || !soundOn;
          soundPreference.current = enabled ? "enabled" : "muted";
          setSoundOn(enabled);
          setAudioError("");
          soundtrack.current?.setEnabled(enabled, clock.time, clock.playing);
        }}
        active={state.index}
        onToggle={toggle}
        onSeek={seek}
        onReplay={() => {
          seek(0);
          clock.setPlaying(true);
          startSound();
        }}
        onOverview={() => {
          seek(48);
          clock.setPlaying(false);
          soundtrack.current?.sync(clock.time, false);
        }}
        onHide={() => setHidden((v) => !v)}
      />
      {audioError && !hidden && (
        <p className="media-note" role="status">
          {audioError}
        </p>
      )}
      <nav
        id="catalogue"
        className={hidden ? "catalogue visually-hidden" : "catalogue"}
        aria-label="Twenty artworks"
      >
        <details>
          <summary>
            Explore the twenty works <span>3000 BC — 2020s</span>
          </summary>
          <ol>
            {artworks.map((art, index) => (
              <li key={art.id}>
                <button
                  aria-current={
                    state.grid < 0.5 && state.index === index
                      ? "true"
                      : undefined
                  }
                  onClick={() => seek(art.time)}
                >
                  <span>{String(art.number).padStart(2, "0")}</span>
                  <strong>{art.title}</strong>
                  <em>{art.caption}</em>
                </button>
              </li>
            ))}
          </ol>
        </details>
      </nav>
    </main>
  );
}
