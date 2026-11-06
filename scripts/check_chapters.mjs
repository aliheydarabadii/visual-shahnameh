// Check that chapter regrouping preserves the source and all its consumers.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const book = JSON.parse(read("text/shahnameh.json"));
const mapping = JSON.parse(read("text/chapter-map.json"));
const toc = JSON.parse(read("src/content/toc.json"));
const sections = book.chapters.flatMap(c => c.sections);
const ids = sections.map(s => s.id);
assert.equal(new Set(ids).size, ids.length, "Section IDs must be unique");
assert.equal(book.chapters.length, 61, "Expected the 61-chapter organization");
assert.equal(mapping.chapters.length, 61);

// This checksum was recorded from the complete source before regrouping.
// It includes every original section ID, title, PDF page and paired verse.
const payload = sections.map(s => [s.id, s.title, s.pdfPage, s.couplets]);
const digest = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
assert.equal(digest, mapping.sectionContentSha256, "Source sections changed or moved out of order");

for (const [i, chapter] of book.chapters.entries()) {
  const expected = mapping.chapters[i];
  assert.equal(chapter.id, String(i + 1).padStart(2, "0"));
  for (const key of ["id", "title", "era", "pdfPage", "reference"]) assert.equal(chapter[key], expected[key]);
  assert.equal(chapter.sections[0].id, expected.firstSection);
  assert.equal(chapter.sections.at(-1).id, expected.lastSection);
  assert(toc.eras.some(era => era.id === chapter.era), `Unknown era ${chapter.era}`);
}
assert.deepEqual(toc.chapters, book.chapters.map(c => ({
  id: c.id, title: c.title, era: c.era,
  sections: c.sections.map(s => [s.id, s.title, s.couplets.length]),
})), "Reader contents are out of date");

const markdown = read("text/shahnameh.md");
const mdChapters = [];
for (const line of markdown.split("\n")) {
  const chapter = /^# (.+)  \[(\d{2}) · pdf p(\d+)\]$/.exec(line);
  const section = /^## (.+)  \[(\d{2}\.\d{2}) · pdf p(\d+)\]$/.exec(line);
  if (chapter) mdChapters.push({ id: chapter[2], title: chapter[1], pdfPage: Number(chapter[3]), sections: [] });
  if (section) {
    assert(mdChapters.length, "Markdown section appears before its chapter");
    mdChapters.at(-1).sections.push({ id: section[2], title: section[1], pdfPage: Number(section[3]) });
  }
}
assert.deepEqual(mdChapters, book.chapters.map(c => ({
  id: c.id, title: c.title, pdfPage: c.pdfPage,
  sections: c.sections.map(s => ({ id: s.id, title: s.title, pdfPage: s.pdfPage })),
})), "Markdown chapter membership differs from JSON");
assert.deepEqual(markdown.split("\n").filter(line => /^\d+\. /.test(line)), sections.flatMap(s => s.couplets.map(([a, b], i) => `${i + 1}. ${a} / ${b}`)), "Markdown verses differ from JSON");

const details = [...read("README.md").matchAll(/<details>\n<summary>(.*?)<\/summary>([\s\S]*?)<\/details>/g)];
assert.equal(details.length, 61, "README chapter inventory is out of date");
for (const [i, [, summary, body]] of details.entries()) {
  const chapter = book.chapters[i];
  const built = s => existsSync(new URL(`src/content/sections/${s.id.replace(".", "-")}.ts`, root));
  const count = chapter.sections.filter(built).length;
  assert(summary.includes(`${chapter.id} · ${chapter.title} (${count}/${chapter.sections.length} sections)`));
  const entries = [...body.matchAll(/^- \[([x ])\] \[?(\d{2}\.\d{2}) ·/gm)];
  assert.deepEqual(entries.map(m => m[2]), chapter.sections.map(s => s.id));
  for (const [j, match] of entries.entries()) assert.equal(match[1] === "x", built(chapter.sections[j]));
}

console.log(`✓ ${book.chapters.length} chapters, ${sections.length} unchanged sections, ${sections.reduce((n, s) => n + s.couplets.length, 0)} unchanged verse rows; Markdown, contents and README agree`);
