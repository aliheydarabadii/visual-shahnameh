/** One local bookmark, shared by the reader and home page. No server or cookie. */
export interface ReadingProgress {
  version: 1;
  sectionId: string;
  beat: number;
  couplet: number;
  updatedAt: number;
}

const KEY = "shahnameh.reading.v1";
let fallback: ReadingProgress | null = null;

export function readProgress(): ReadingProgress | null {
  let raw: string | null;
  try { raw = localStorage.getItem(KEY); } catch { return fallback; }
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const p = value as Partial<ReadingProgress>;
    return p.version === 1 && typeof p.sectionId === "string" && /^\d{2}\.\d{2}$/.test(p.sectionId)
      && typeof p.beat === "number" && Number.isFinite(p.beat) && p.beat >= 0 && p.beat < 10000
      && typeof p.couplet === "number" && Number.isInteger(p.couplet) && p.couplet > 0
      && typeof p.updatedAt === "number" && Number.isFinite(p.updatedAt) && p.updatedAt > 0
      ? p as ReadingProgress : null;
  } catch { return null; }
}

export function saveProgress(sectionId: string, beat: number, couplet: number) {
  fallback = { version: 1, sectionId, beat: Math.round(beat * 1000) / 1000, couplet, updatedAt: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(fallback)); } catch { /* Reading still works with storage disabled. */ }
}
