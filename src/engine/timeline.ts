import type { Section } from "../content/types";

/**
 * The journey is laid out on one axis measured in "beats": 1 beat = one
 * viewport height of scrolling. Everything visual is a function of the
 * current beat position `u`.
 *
 *   threshold ─┬─ dive ─┬─ couplet ─ couplet ─┬─ dive ─┬─ couplet … ─┬─ ending
 *   (title)    │  into  │  scene 1            │  into  │  scene 2    │ (light)
 *
 * Tune pacing with the constants below; DESIGN.md explains the reasoning.
 */
export const BEATS = {
  threshold: 1.5,
  dive: 1.15,
  couplet: 1.3,
  ending: 1.9,
} as const;

export interface SceneSpan {
  index: number;
  /** Dive into this scene starts (its portal begins to open). */
  diveStart: number;
  /** Portal fully open: the painting fills the screen. */
  revealed: number;
  /** Last couplet done; the dive into the next scene starts here. */
  end: number;
  /** Fully gone (next scene revealed, or ending finished). */
  gone: number;
}

export interface CoupletSpan {
  /** 1-based couplet number within the section. */
  number: number;
  scene: number;
  start: number;
  end: number;
}

export interface Timeline {
  scenes: SceneSpan[];
  couplets: CoupletSpan[];
  endingStart: number;
  total: number;
}

export function buildTimeline(section: Section): Timeline {
  const scenes: SceneSpan[] = [];
  const couplets: CoupletSpan[] = [];
  let cursor = 0;

  section.scenes.forEach((scene, index) => {
    if (index === 0) {
      scenes.push({ index, diveStart: -Infinity, revealed: 0, end: BEATS.threshold, gone: 0 });
      cursor = BEATS.threshold;
      return;
    }
    const diveStart = cursor;
    const revealed = diveStart + BEATS.dive;
    let t = revealed;
    for (const number of scene.couplets) {
      couplets.push({ number, scene: index, start: t, end: t + BEATS.couplet });
      t += BEATS.couplet;
    }
    scenes.push({ index, diveStart, revealed, end: t, gone: 0 });
    cursor = t;
  });

  // A scene is gone once the next one is fully revealed.
  for (let i = 0; i < scenes.length - 1; i++) scenes[i].gone = scenes[i + 1].revealed;
  const endingStart = cursor;
  const total = endingStart + BEATS.ending;
  scenes[scenes.length - 1].gone = total;

  return { scenes, couplets, endingStart, total };
}
