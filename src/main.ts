import "@fontsource/noto-nastaliq-urdu/400.css";
import "@fontsource/noto-nastaliq-urdu/700.css";
import "@fontsource-variable/vazirmatn";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./styles/journey.css";
import "./styles/home.css";
import "./styles/contents.css";

import { sections } from "./content";
import { Journey } from "./engine/journey";
import { readProgress } from "./engine/reading-progress";
import type { Contents } from "./home/contents";
import type { Home } from "./home/home";
import type { Toc } from "./home/toc";
import type { NextSection } from "./content/types";

const app = document.getElementById("app")!;
let page: Journey | Home | Contents | undefined;
let routeVersion = 0;
const paintingLoads = new Map<string, Promise<unknown>>();
const fontStyle = getComputedStyle(document.documentElement);
const fonts = Promise.allSettled(["--font-verse", "--font-ui", "--font-latin"].flatMap((token) =>
  [400, 700].map((weight) => document.fonts.load(`${weight} 32px ${fontStyle.getPropertyValue(token)}`)),
));

function decodePainting(url: string) {
  if (!paintingLoads.has(url)) {
    const image = new Image();
    image.src = url;
    paintingLoads.set(url, image.decode().catch(() => undefined));
  }
  return paintingLoads.get(url)!;
}

/**
 * Routes are hashes so the site works as plain static files:
 * "#/" home · "#/contents" every story · "#/contents/09" one story ·
 * "#/contents/back/09" every story, scrolled to story 09 · "#/01.01" a section.
 */
async function route() {
  const version = ++routeVersion;
  const path = location.hash.replace(/^#\/?/, "");
  app.setAttribute("aria-busy", "true");
  const load = sections[path];
  if (load) {
    const [section, toc] = await Promise.all([load(), import("./content/toc.json")]);
    await Promise.all([fonts, ...section.scenes.slice(0, 2).map((scene) => decodePainting(scene.image))]);
    if (version !== routeVersion) return;
    swap(() => {
      const journey = new Journey(app, section, nextSection(toc.default as Toc, section.id));
      // Review aid: "?beat=4.2" freezes the camera at that point (see DESIGN.md).
      const beat = new URLSearchParams(location.search).get("beat");
      if (beat !== null) journey.freezeAt(Number(beat));
      else {
        const progress = readProgress();
        let saved = 0;
        try { saved = Number(sessionStorage.getItem(`shahnameh.beat.${section.id}`)); } catch { /* Storage may be disabled. */ }
        if (progress?.sectionId === section.id && progress.couplet <= section.couplets.length) saved = progress.beat;
        if (Number.isFinite(saved) && saved > 0) journey.jumpTo(saved);
      }
      // Dev only: lets review scripts move the frozen camera without reloading.
      if (import.meta.env.DEV) Object.assign(window, { __journey: journey });
      return journey;
    });
    return;
  }

  const [{ Home }, { Contents }, toc] = await Promise.all([import("./home/home"), import("./home/contents"), import("./content/toc.json")]);
  const data = toc.default as Toc;
  const available = new Set(Object.keys(sections));
  await fonts;
  if (version !== routeVersion) return;
  const [first, second, third] = path.split("/");
  if (first !== "contents") return swap(() => new Home(app, data, available));
  const view = second === "back" ? { returnTo: third } : { chapter: second };
  swap(() => new Contents(app, data, available, view));
}

/** The section after `id` in the book's order, and whether it has been built yet. */
function nextSection(toc: Toc, id: string): NextSection | undefined {
  const order = toc.chapters.flatMap((c) => c.sections);
  const at = order.findIndex(([sid]) => sid === id);
  const next = order[at + 1];
  return next && { id: next[0], title: next[1], available: next[0] in sections };
}

function swap(make: () => Journey | Home | Contents) {
  page?.destroy();
  window.scrollTo(0, 0);
  page = make();
  app.removeAttribute("aria-busy");
  app.tabIndex = -1;
  app.focus({ preventScroll: true });
}

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("hashchange", route);
route();
