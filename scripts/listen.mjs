// Render the score to an audio file, as a typical reader would hear it.
// Needs the dev server (pnpm dev) running. Writes WAV, plus M4A if ffmpeg is installed,
// and prints loudness so you can check levels without listening.
//
//   node scripts/listen.mjs section 01.01 /tmp/01-01 [--port 5173]
//   node scripts/listen.mjs audition battle,lament,feast /tmp/try [--port 5173]
//
// "audition" builds a throwaway section with one scene (three couplets) per
// atmosphere, in the order given ("all" = every atmosphere in src/content/sound.ts).
import { chromium } from "playwright-core";
import { homedir } from "node:os";
import { readdirSync, existsSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const portAt = args.indexOf("--port");
const port = portAt === -1 ? "5173" : args.splice(portAt, 2)[1];
const [kind, what, out] = args;
if (!["section", "audition"].includes(kind) || !what || !out) {
  console.error("usage: node scripts/listen.mjs section <id> <out> | audition <names|all> <out> [--port N]");
  process.exit(1);
}

const cache = `${homedir()}/Library/Caches/ms-playwright`;
const dir = existsSync(cache) ? readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop() : null;
const executablePath = dir ? `${cache}/${dir}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing` : undefined;

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();
page.on("pageerror", (e) => console.error("pageerror:", e.message));
await page.goto(`http://localhost:${port}/?beat=0`);

const wav = await page.evaluate(
  async ({ kind, what }) => {
    const { Sound } = await import("/src/engine/sound.ts");
    let section;
    if (kind === "section") {
      const { sections } = await import("/src/content/index.ts");
      if (!sections[what]) throw new Error(`no section ${what}`);
      section = await sections[what]();
    } else {
      const { ATMOSPHERES } = await import("/src/content/sound.ts");
      const names = what === "all" ? Object.keys(ATMOSPHERES) : what.split(",");
      for (const n of names) if (!(n in ATMOSPHERES)) throw new Error(`no atmosphere ${n}`);
      const per = 3;
      section = {
        id: `audition/${names.join(",")}`,
        chapter: { id: "00", title: "audition" },
        title: "audition",
        couplets: names.flatMap(() => Array.from({ length: per }, () => ["", ""])),
        scenes: [
          { image: "", alt: "", couplets: [], sound: "threshold" },
          ...names.map((n, i) => ({ image: "", alt: "", couplets: Array.from({ length: per }, (_, k) => i * per + k + 1), sound: n })),
        ],
      };
    }
    const buffer = await Sound.renderScore(section);

    // 16-bit PCM WAV.
    const ch = [buffer.getChannelData(0), buffer.getChannelData(1)];
    const n = buffer.length;
    const bytes = new DataView(new ArrayBuffer(44 + n * 4));
    const text = (o, s) => [...s].forEach((c, i) => bytes.setUint8(o + i, c.charCodeAt(0)));
    text(0, "RIFF");
    bytes.setUint32(4, 36 + n * 4, true);
    text(8, "WAVEfmt ");
    bytes.setUint32(16, 16, true);
    bytes.setUint16(20, 1, true);
    bytes.setUint16(22, 2, true);
    bytes.setUint32(24, buffer.sampleRate, true);
    bytes.setUint32(28, buffer.sampleRate * 4, true);
    bytes.setUint16(32, 4, true);
    bytes.setUint16(34, 16, true);
    text(36, "data");
    bytes.setUint32(40, n * 4, true);
    let peak = 0;
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < 2; c++) {
        const v = ch[c][i];
        if (!Number.isFinite(v)) throw new Error(`non-finite sample at ${i}`);
        peak = Math.max(peak, Math.abs(v));
        bytes.setInt16(44 + i * 4 + c * 2, Math.max(-1, Math.min(1, v)) * 0x7fff, true);
      }
    }
    // Hand back as base64 in chunks (the payload can be tens of MB).
    const u8 = new Uint8Array(bytes.buffer);
    let s = "";
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    return { data: btoa(s), seconds: n / buffer.sampleRate, peak };
  },
  { kind, what },
);
await browser.close();

writeFileSync(`${out}.wav`, Buffer.from(wav.data, "base64"));
console.log(`${out}.wav  ${wav.seconds.toFixed(1)}s  peak ${(20 * Math.log10(wav.peak || 1e-9)).toFixed(1)} dBFS`);
const ffmpeg = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-y", "-i", `${out}.wav`, "-af", "ebur128", "-c:a", "aac", "-b:a", "192k", `${out}.m4a`], { encoding: "utf8" });
if (ffmpeg.error) console.log("(ffmpeg not found: WAV only)");
else {
  const loud = [...ffmpeg.stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
  console.log(`${out}.m4a  integrated loudness ${loud ? loud[1] : "?"} LUFS`);
}
