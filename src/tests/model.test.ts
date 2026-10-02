import { describe, it, expect } from "vitest";
import { artworks } from "../data/styles";
import { poseAt } from "../animation/choreography";
import {
  boundaries,
  rootAt,
  timelineAt,
  DURATION,
} from "../animation/timeline";
import { cardAt, layout } from "../animation/galleryLayout";
import { Clock } from "../animation/clock";
import { backgroundSvg } from "../artworks/backgrounds";
describe("artwork catalogue", () => {
  it("preserves twenty unique ordered eras", () => {
    expect(artworks).toHaveLength(20);
    expect(new Set(artworks.map((a) => a.id)).size).toBe(20);
    expect(artworks.map((a) => a.number)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    );
    expect(artworks[0].title).toBe("PETROGLYPH");
    expect(artworks[19].title).toBe("PATCH");
    expect(
      artworks.every((a, i) => i === 0 || a.time > artworks[i - 1].time),
    ).toBe(true);
  });
  it("generates every SVG deterministically without missing strings", () => {
    for (let i = 0; i < 20; i++) {
      const svg = backgroundSvg(i);
      expect(svg).toBe(backgroundSvg(i));
      expect(svg).not.toMatch(/undefined|NaN/);
      expect(svg).toContain("</svg>");
    }
  });
});
describe("choreography and transitions", () => {
  it("has deterministic finite articulated poses at every boundary", () => {
    for (const t of [
      0,
      DURATION,
      ...boundaries,
      ...artworks.map((a) => a.time),
    ]) {
      const pose = poseAt(t);
      expect(pose).toEqual(poseAt(t));
      expect(JSON.stringify(pose)).not.toMatch(/null|NaN/);
      expect(pose.handL).not.toEqual(pose.handR);
      expect(pose.ankleL.y).toBeGreaterThan(pose.hip.y);
    }
  });
  it("changes knee, heel, wrist and head configuration", () => {
    const a = poseAt(48),
      b = poseAt(48.35);
    expect(a.kneeL).not.toEqual(b.kneeL);
    expect(a.ankleR).not.toEqual(b.ankleR);
    expect(a.handL).not.toEqual(b.handL);
    expect(a.tilt).not.toBe(b.tilt);
  });
  it("keeps root continuous across all style boundaries", () => {
    for (const t of boundaries.slice(1, 20)) {
      expect(Math.abs(rootAt(t - 0.00001) - rootAt(t + 0.00001))).toBeLessThan(
        0.02,
      );
    }
  });
  it("crosses gutters rather than teleporting between centres", () => {
    for (let i = 0; i < 19; i++) {
      const end = boundaries[i + 1];
      const x = rootAt(end - 0.1) - i * layout.pitch;
      expect(x).toBeGreaterThan(layout.poster);
      expect(x).toBeLessThan(layout.pitch + 25);
    }
  });
  it("interpolates each card into the final 5 by 4 grid", () => {
    for (let i = 0; i < 20; i++) {
      const final = cardAt(i, 48);
      expect(final.x).toBe(layout.gridX + (i % 5) * layout.stepX);
      expect(final.y).toBe(layout.gridY + Math.floor(i / 5) * layout.stepY);
      expect(final.size).toBe(102);
      expect(cardAt(i, 46.5).size).toBeGreaterThan(final.size);
      expect(cardAt(i, 46.5).size).toBeLessThan(535);
    }
  });
  it("finishes with a visible gallery and a finite clock", () => {
    expect(timelineAt(DURATION).title).toBe(1);
    expect(timelineAt(DURATION).grid).toBe(1);
    expect(timelineAt(48).grid).toBe(1);
    expect(timelineAt(-1).time).toBe(0);
  });
});
describe("shared clock", () => {
  it("pauses and resumes without losing phase", () => {
    const c = new Clock();
    c.tick(0);
    c.tick(50);
    expect(c.time).toBe(0.05);
    c.setPlaying(false);
    c.tick(5000);
    c.tick(7000);
    expect(c.time).toBe(0.05);
    c.setPlaying(true);
    c.tick(8000);
    c.tick(8050);
    expect(c.time).toBe(0.1);
  });
  it("seeks and replays independently of previous timestamps", () => {
    const c = new Clock();
    c.tick(100);
    c.seek(30);
    c.tick(1000);
    expect(c.time).toBe(30);
    c.seek(0);
    c.tick(2000);
    expect(c.time).toBe(0);
    c.seek(Number.NaN);
    expect(c.time).toBe(0);
  });
  it("suspends time in hidden tabs and avoids a catch-up jump", () => {
    const c = new Clock();
    c.tick(0);
    c.tick(50);
    c.visibility(true);
    c.tick(100);
    c.tick(50000);
    expect(c.time).toBe(0.05);
    c.visibility(false);
    c.tick(60000);
    c.tick(60050);
    expect(c.time).toBe(0.1);
  });
  it("stops at the duration", () => {
    const c = new Clock();
    c.seek(DURATION - 0.01);
    c.tick(100);
    c.tick(200);
    expect(c.time).toBe(DURATION);
    expect(c.playing).toBe(false);
  });
});

describe("reference dancer rig", () => {
  it("keeps projected bones within their fixed lengths and a toe on the floor", () => {
    const distance = (
      a: { x: number; y: number },
      b: { x: number; y: number },
    ) => Math.hypot(a.x - b.x, a.y - b.y);
    for (let time = 0; time <= DURATION; time += 1 / 60) {
      const p = poseAt(time);
      for (const side of ["L", "R"] as const) {
        expect(
          distance(p[`shoulder${side}`], p[`elbow${side}`]),
        ).toBeLessThanOrEqual(48.01);
        expect(
          distance(p[`elbow${side}`], p[`hand${side}`]),
        ).toBeLessThanOrEqual(43.01);
        expect(distance(p[`hip${side}`], p[`knee${side}`])).toBeLessThanOrEqual(
          79.01,
        );
        expect(
          distance(p[`knee${side}`], p[`ankle${side}`]),
        ).toBeLessThanOrEqual(77.01);
        expect(p[`toe${side}`].y).toBeLessThanOrEqual(498.01);
      }
      expect(Math.max(p.toeL.y, p.toeR.y)).toBeCloseTo(498, 3);
    }
  });
  it("has continuous joints across animation cycles and reference anchors", () => {
    for (let time = 0.001; time < DURATION; time += 0.007) {
      const a = poseAt(time - 0.00001),
        b = poseAt(time + 0.00001);
      for (const key of [
        "head",
        "handL",
        "handR",
        "kneeL",
        "kneeR",
        "ankleL",
        "ankleR",
      ] as const)
        expect(
          Math.hypot(a[key].x - b[key].x, a[key].y - b[key].y),
        ).toBeLessThan(0.1);
    }
  });
});
