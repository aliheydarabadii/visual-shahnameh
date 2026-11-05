/**
 * Where paintings are served from. Locally they are files in public/art/.
 * In production they live in Cloudflare R2 behind a custom domain: set
 * VITE_ART_BASE (e.g. "https://art.example.com") at build time and every
 * painting URL points there. See DEPLOY.md.
 */
// In development URLs stay local; the dev server falls back to R2 for files
// that aren't on disk (vite.config.ts).
const BASE = import.meta.env.PROD ? (import.meta.env.VITE_ART_BASE ?? "").replace(/\/$/, "") : "";

/** URL of a file under art/, e.g. artUrl("01-01/00-dargah.avif"). */
export const artUrl = (path: string) => `${BASE}/art/${path}`;

/** A section's painting helper: sectionArt("02.01")("03-dad") → …/art/02-01/03-dad.avif */
export const sectionArt = (id: string) => (name: string) => artUrl(`${id.replace(".", "-")}/${name}.avif`);

/** The shared gold cloud layer flown through between scenes. */
export const LIGHT_LAYER = artUrl("01-01/layer-abr.avif");
