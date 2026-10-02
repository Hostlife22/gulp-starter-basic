import { DURATION } from "../animation/timeline";
import { artworks } from "../data/styles";
interface Props {
  time: number;
  playing: boolean;
  hidden: boolean;
  active: number;
  soundOn: boolean;
  soundBlocked: boolean;
  onSound: () => void;
  onToggle: () => void;
  onSeek: (time: number) => void;
  onReplay: () => void;
  onOverview: () => void;
  onHide: () => void;
}
export function PlaybackControls(p: Props) {
  return (
    <>
      <button
        className={`show-controls ${p.hidden ? "" : "visually-hidden"}`}
        onClick={p.onHide}
        aria-label="Show controls"
      >
        Controls
      </button>
      <section
        className="controls"
        aria-label="Playback controls"
        hidden={p.hidden}
      >
        <div className="transport">
          <button
            onClick={p.onToggle}
            aria-label={p.playing ? "Pause" : "Play"}
          >
            {p.playing ? "Ⅱ" : "▷"} <span>{p.playing ? "Pause" : "Play"}</span>
          </button>
          <button onClick={p.onReplay}>
            ↶ <span>Replay</span>
          </button>
          <button onClick={p.onOverview}>
            ▦ <span>Overview</span>
          </button>
          <button
            onClick={p.onSound}
            aria-label={
              p.soundBlocked
                ? "Start sound"
                : p.soundOn
                  ? "Mute sound"
                  : "Enable sound"
            }
            aria-pressed={p.soundOn && !p.soundBlocked}
          >
            Sound {p.soundBlocked ? "start" : p.soundOn ? "on" : "off"}
          </button>
          <span className="current-work">
            {String(p.active + 1).padStart(2, "0")} / 20{" "}
            <span>{artworks[p.active].title}</span>
          </span>
          <button onClick={p.onHide} aria-label="Hide controls">
            Hide
          </button>
        </div>
        <div className="scrubber">
          <label className="visually-hidden" htmlFor="time">
            Gallery time in seconds
          </label>
          <input
            id="time"
            type="range"
            min="0"
            max={DURATION}
            step="0.01"
            value={p.time}
            onChange={(e) => p.onSeek(Number(e.target.value))}
            aria-valuetext={`${p.time.toFixed(1)} of 52 seconds`}
          />
          <output htmlFor="time">
            {p.time.toFixed(1).padStart(4, "0")} / 52.0
          </output>
        </div>
      </section>
    </>
  );
}
