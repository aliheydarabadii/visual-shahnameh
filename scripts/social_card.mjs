// Render a versioned social image from the existing painting and design tokens.
// Usage: node scripts/social_card.mjs public/social/shahnameh-v1.jpg
import { chromium } from "playwright-core";
import { createServer } from "vite";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";

const output = process.argv[2];
if (!output?.endsWith(".jpg")) throw new Error("Provide a new .jpg output path");
if (existsSync(output)) throw new Error("Use a new filename so cached social images stay immutable");
const server = await createServer({ logLevel: "error", server: { port: 0, watch: null, hmr: false } });
await server.listen();
const base = server.resolvedUrls.local[0];
const cache = `${homedir()}/Library/Caches/ms-playwright`;
const version = existsSync(cache) ? readdirSync(cache).filter(s => /^chromium-\d+$/.test(s)).sort().at(-1) : null;
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH || (version
  ? `${cache}/${version}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
  : undefined);
let browser;
try {
  browser = await chromium.launch({ executablePath });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const html = `<!doctype html><html lang="fa" dir="rtl"><head>
    <link rel="stylesheet" href="/node_modules/@fontsource/noto-nastaliq-urdu/700.css">
    <link rel="stylesheet" href="/node_modules/@fontsource-variable/vazirmatn/index.css">
    <link rel="stylesheet" href="/node_modules/@fontsource/cormorant-garamond/500.css">
    <style>
      ${readFileSync("src/styles/tokens.css", "utf8")}
      * { box-sizing: border-box; }
      body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: var(--lajevard-1000); color: var(--tala-200); }
      .art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 32%; }
      .shade { position: absolute; inset: 0; background: linear-gradient(0deg, var(--lajevard-1000), color-mix(in srgb, var(--lajevard-1000) 90%, transparent) 28%, color-mix(in srgb, var(--lajevard-1000) 8%, transparent) 80%); }
      .copy { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding: 0 70px 42px; }
      .brand { font: 700 68px/2.1 var(--font-verse); margin: 0; white-space: nowrap; filter: var(--text-halo); }
      .en { font: 500 24px/1.4 var(--font-latin); margin: 0 0 18px; }
      .tag { font: 400 21px/1.8 var(--font-ui); margin: 0; color: var(--verse-ink); }
      .domain { position: absolute; top: 32px; left: 38px; display: flex; align-items: center; gap: 10px; font: 400 17px var(--font-ui); color: var(--tala-100); direction: ltr; }
      .domain img { width: 34px; height: 34px; }
    </style></head><body>
    <img class="art" src="/art/01-01/00-dargah.avif" alt="">
    <div class="shade"></div>
    <div class="domain"><img src="/favicon.svg" alt="">shahnameh.world</div>
    <main class="copy"><h1 class="brand">شاهنامه به روایت تصویر</h1>
      <p class="en" lang="en" dir="ltr">Visual Shahnameh · The Book of Kings</p>
      <p class="tag">سفری میان واژه، نگاره و موسیقی</p></main>
    </body></html>`;
  // A same-origin document lets font files load without opaque-origin CORS failures.
  await page.route(`${base}__social-card`, route => route.fulfill({ contentType: "text/html; charset=utf-8", body: html }));
  await page.goto(`${base}__social-card`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (const el of document.querySelectorAll(".brand, .en, .tag")) {
      const s = getComputedStyle(el);
      await document.fonts.load(`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`, el.textContent);
    }
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.decode()));
    const title = document.querySelector(".brand").getBoundingClientRect();
    if (title.left < 0 || title.right > 1200 || title.bottom > 630) throw new Error("Social title exceeds the image");
  });
  mkdirSync(dirname(resolve(output)), { recursive: true });
  mkdirSync("work/social-card", { recursive: true });
  await page.screenshot({ path: output, type: "jpeg", quality: 90 });
  await page.screenshot({ path: "work/social-card/card.png", type: "png" });
  console.log(`${output}: 1200×630 JPEG, ${statSync(output).size} bytes`);
} finally {
  await browser?.close();
  await server.close();
}
