import type { Section } from "./types";

/**
 * Every built section, discovered from the files in ./sections/ (named like
 * "02-01.ts" for section 02.01). There is no list to edit: adding a section
 * file is all it takes, so many agents can add sections at once without
 * touching a shared file. Each loads lazily.
 */
const files = import.meta.glob<{ section: Section }>("./sections/*.ts");

export const sections: Record<string, () => Promise<Section>> = Object.fromEntries(
  Object.entries(files)
    .map(([path, load]) => [path.replace(/^.*\/(\d\d)-(\d\d)\.ts$/, "$1.$2"), () => load().then((m) => m.section)] as const)
    .filter(([id]) => /^\d\d\.\d\d$/.test(id))
    .sort(([a], [b]) => a.localeCompare(b)),
);
