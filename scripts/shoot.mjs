// Screenshot the journey at chosen beats. Needs the dev server (pnpm dev) running.
// Usage: node scripts/shoot.mjs <width>x<height> <out-prefix> <beat>... [--section 01.01] [--port 5173] [--reduced]
// Example: node scripts/shoot.mjs 1440x900 /tmp/shot 0 3.3 15.2
import { chromium } from "playwright-core";
import { homedir } from "node:os";
import { readdirSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const reduced = args.includes("--reduced");
if (reduced) args.splice(args.indexOf("--reduced"), 1);
const section = opt("section", "01.01");
const port = opt("port", "5173");
const [size, prefix, ...beats] = args;
const [width, height] = size.split("x").map(Number);

// Use whichever Playwright Chromium is installed locally.
const cache = `${homedir()}/Library/Caches/ms-playwright`;
const dir = existsSync(cache) ? readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop() : null;
const executablePath = dir ? `${cache}/${dir}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing` : undefined;

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
page.on("pageerror", (e) => console.error("pageerror:", e.message));
for (const beat of beats) {
  await page.goto(`http://localhost:${port}/?beat=${beat}#/${section}`);
  await page.waitForFunction(() => [...document.images].every((i) => !i.src || i.complete), null, { timeout: 15000 });
  await page.waitForTimeout(600);
  const out = `${prefix}-${beat}.png`;
  await page.screenshot({ path: out });
  console.log(out);
}
await browser.close();
