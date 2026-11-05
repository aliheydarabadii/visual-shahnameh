/**
 * The sound vocabulary: what a scene can ask the score for, and the library
 * of named atmospheres. This file is data. The engine that plays it is
 * src/engine/sound.ts; how to choose and design atmospheres is sound/SOUND.md.
 *
 * Add a new atmosphere here when a scene needs a character no existing one
 * has (a siege, a wedding, a dream). Keep names plain English and describe
 * the scene type, not the section.
 */

/**
 * Persian modes (dastgāh / āvāz). They set the scale for every melodic voice.
 * All share one tonic (D), so sections join without a key change.
 */
export type Mode =
  | "shur" // the mother mode: grave, inward, narrative
  | "dashti" // folk and yearning: laments, exile, longing for home
  | "homayun" // solemn grandeur: invocation, fate, the sacred
  | "segah" // tender and uncanny: love, dreams, the otherworldly
  | "chahargah" // heroic and tense: battle, challenge, the champion's entrance
  | "mahur"; // bright and regal: court, celebration, victory, light

/** Voices that can answer a couplet the moment it appears. */
export type Answer =
  | "santur" // a run settling on the focal note, then a tremolo
  | "ney" // a long breathed tone and its reply
  | "horn" // a karnay call: the court, the army, a summons
  | "bell" // a single bell: revelation, the sacred
  | "drum"; // a dohol stroke and roll: impact, the march

/** One-off sounds tied to a specific couplet, for moments the text names. */
export type CueSound =
  | "strike" // steel on steel: a blow, a clash of swords
  | "horn" // a long karnay blast: war declared, a king arrives
  | "gong" // a deep gong: death, doom, a decree
  | "thunder" // a roll of thunder: a demon, a storm, divine anger
  | "hush"; // everything drops away for this couplet

export interface Cue {
  /** 1-based couplet number within the section. */
  couplet: number;
  sound: CueSound;
}

export interface Atmosphere {
  mode: Mode;
  /** 0 dark … 1 bright. Opens or closes the filters on every voice. */
  brightness: number;
  /** The breathing drone under everything, 0–1. */
  drone: number;
  /** Santur notes per second between couplets (0 = silent; 1 is busy). */
  santur: number;
  /** Santur octave: 0 around D4, 1 an octave higher and more crystalline. */
  register: 0 | 1;
  /** Strength of the ney's answer to each couplet, 0–1. */
  ney: number;
  /** Strength of the bells at portals and in answers, 0–1. */
  bells: number;
  /**
   * Percussion loop while the scene is on screen. `pattern` is 16 steps:
   * D = dum (deep stroke), t = tak (rim), k = soft ka, j = daf jingle, . = rest.
   */
  drums?: { pattern: string; bpm: number; level: number };
  /** Ambient beds, 0–1: air moving, and a low earth rumble (armies, storms). */
  wind: number;
  rumble: number;
  /** What answers each new couplet. Several voices play together. */
  answer: readonly Answer[];
}

export type AtmosphereName = keyof typeof ATMOSPHERES;

/**
 * A scene's sound: an atmosphere name, or a named base with overrides and
 * cues, for example `{ like: "battle", drums: { pattern: "D.D.D.D.D.D.D.D.", bpm: 120, level: 0.9 }, cues: [{ couplet: 12, sound: "strike" }] }`.
 */
export type SceneSound = AtmosphereName | (Partial<Atmosphere> & { like?: AtmosphereName; cues?: readonly Cue[] });

export const ATMOSPHERES = {
  // ---- the opening (01.01) ---------------------------------------------
  /** A gateway, a title page: grounded and solemn. Default for every threshold. */
  threshold: { mode: "homayun", brightness: 0.3, drone: 0.95, santur: 0.3, register: 0, ney: 0.7, bells: 0.25, wind: 0.2, rumble: 0, answer: ["santur", "ney"] },
  /** A lamp, one figure, a close room. */
  intimate: { mode: "shur", brightness: 0.45, drone: 0.6, santur: 0.5, register: 0, ney: 0.85, bells: 0.3, wind: 0.05, rumble: 0, answer: ["santur", "ney"] },
  /** The open sky, the turning heavens, a great landscape. */
  vast: { mode: "mahur", brightness: 0.7, drone: 0.85, santur: 0.75, register: 1, ney: 0.5, bells: 0.8, wind: 0.3, rumble: 0, answer: ["santur", "ney", "bell"] },
  /** Revelation, radiance, the beyond. */
  wonder: { mode: "mahur", brightness: 0.8, drone: 0.7, santur: 1, register: 1, ney: 0.45, bells: 1, wind: 0.15, rumble: 0, answer: ["santur", "bell"] },
  /** Thought, judgement, counsel, wisdom. Default for scenes without a sound. */
  contemplative: { mode: "shur", brightness: 0.38, drone: 0.8, santur: 0.45, register: 0, ney: 0.75, bells: 0.3, wind: 0.1, rumble: 0, answer: ["santur", "ney"] },
  /** Roads, quests, travel, seeking. */
  journey: { mode: "shur", brightness: 0.5, drone: 0.7, santur: 0.85, register: 0, ney: 0.6, bells: 0.3, wind: 0.4, rumble: 0, answer: ["santur", "ney"], drums: { pattern: "D...t...k...t...", bpm: 76, level: 0.35 } },
  /** Age and youth, affection, gentle longing. */
  tender: { mode: "segah", brightness: 0.45, drone: 0.65, santur: 0.5, register: 0, ney: 0.95, bells: 0.35, wind: 0.05, rumble: 0, answer: ["ney", "santur"] },
  /** The unknowable, veils, night, absence. */
  mystery: { mode: "segah", brightness: 0.2, drone: 0.55, santur: 0.15, register: 0, ney: 0.35, bells: 0.55, wind: 0.25, rumble: 0, answer: ["bell", "ney"] },
  /** The ending: light floods in. The engine uses this for every section's ending. */
  radiance: { mode: "mahur", brightness: 0.95, drone: 1, santur: 0.35, register: 1, ney: 0.6, bells: 1, wind: 0, rumble: 0, answer: ["bell"] },

  // ---- the rest of the book ---------------------------------------------
  /** Creation, the elements, the world taking form. */
  genesis: { mode: "homayun", brightness: 0.55, drone: 1, santur: 0.6, register: 1, ney: 0.4, bells: 0.7, wind: 0.35, rumble: 0.35, answer: ["bell", "santur"] },
  /** A king enthroned, an audience, a royal decree. */
  court: { mode: "mahur", brightness: 0.65, drone: 0.75, santur: 0.7, register: 0, ney: 0.4, bells: 0.4, wind: 0, rumble: 0, answer: ["horn", "santur"], drums: { pattern: "D.......j...t...", bpm: 72, level: 0.4 } },
  /** Feasts, weddings, Nowruz, celebration. */
  feast: { mode: "mahur", brightness: 0.75, drone: 0.5, santur: 1.1, register: 1, ney: 0.3, bells: 0.3, wind: 0, rumble: 0, answer: ["santur"], drums: { pattern: "D.jtD.jtD.jtDtjt", bpm: 104, level: 0.6 } },
  /** Armies gathering, the march to war, a challenge shouted across the field. */
  muster: { mode: "chahargah", brightness: 0.5, drone: 0.85, santur: 0.5, register: 0, ney: 0.2, bells: 0.15, wind: 0.3, rumble: 0.5, answer: ["horn", "drum"], drums: { pattern: "D...D...D.t.D...", bpm: 84, level: 0.75 } },
  /** Combat itself: single combat, the clash of hosts. */
  battle: { mode: "chahargah", brightness: 0.55, drone: 0.9, santur: 0.9, register: 0, ney: 0, bells: 0.1, wind: 0.45, rumble: 0.8, answer: ["drum", "santur"], drums: { pattern: "D.tDD.t.D.tDDtt.", bpm: 118, level: 0.9 } },
  /** Death, mourning, a hero's body brought home (Sohrab, Siyavash, Rostam). */
  lament: { mode: "dashti", brightness: 0.28, drone: 0.75, santur: 0.2, register: 0, ney: 1, bells: 0.2, wind: 0.2, rumble: 0, answer: ["ney"] },
  /** Love and courtship (Zal and Rudabeh, Bizhan and Manizheh). */
  love: { mode: "segah", brightness: 0.55, drone: 0.55, santur: 0.7, register: 1, ney: 0.8, bells: 0.3, wind: 0.05, rumble: 0, answer: ["santur", "ney"], drums: { pattern: "D.....k.t.....k.", bpm: 66, level: 0.25 } },
  /** Demons, sorcery, the White Div, Zahhak's serpents. */
  demonic: { mode: "segah", brightness: 0.15, drone: 1, santur: 0.25, register: 0, ney: 0.15, bells: 0.4, wind: 0.5, rumble: 0.9, answer: ["bell", "drum"] },
  /** Dreams, omens, prophecy, the Simorgh. */
  dream: { mode: "segah", brightness: 0.6, drone: 0.6, santur: 0.55, register: 1, ney: 0.55, bells: 0.9, wind: 0.2, rumble: 0, answer: ["bell", "ney"] },
  /** Wilderness, hunting, the desert or the mountain alone. */
  wild: { mode: "dashti", brightness: 0.45, drone: 0.6, santur: 0.4, register: 0, ney: 0.7, bells: 0.1, wind: 0.6, rumble: 0.1, answer: ["ney"], drums: { pattern: "D.......t.......", bpm: 70, level: 0.25 } },
} as const satisfies Record<string, Atmosphere>;

/** Resolve a scene's sound into a full atmosphere plus its cues. */
export function resolveSound(sound: SceneSound | undefined, fallback: AtmosphereName): { atmosphere: Atmosphere; cues: readonly Cue[] } {
  if (sound === undefined) return { atmosphere: ATMOSPHERES[fallback], cues: [] };
  if (typeof sound === "string") return { atmosphere: ATMOSPHERES[sound], cues: [] };
  const { like, cues, ...overrides } = sound;
  return { atmosphere: { ...ATMOSPHERES[like ?? fallback], ...overrides }, cues: cues ?? [] };
}
