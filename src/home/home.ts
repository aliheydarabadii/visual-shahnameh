import { artUrl, LIGHT_LAYER } from "../content/art";
import type { Section } from "../content/types";
import { Dust } from "../engine/dust";
import { headpiece } from "../engine/ornament";
import { Sound } from "../engine/sound";
import { SoundToggle } from "../engine/sound-toggle";
import { readProgress } from "../engine/reading-progress";
import { el, lerp, toPersianDigits } from "../engine/util";
import type { Toc } from "./toc";

/** The score for pages outside a section (home, contents): the threshold atmosphere alone. */
export const AMBIENT: Section = {
  id: "ambient",
  chapter: { id: "00", title: "" },
  title: "",
  couplets: [],
  scenes: [{ image: "", alt: "", couplets: [], sound: "threshold" }],
};

/** The gateway painting and where its light sits (fractions of the painting). */
const PAINTING = artUrl("01-01/00-dargah.avif");
const CLOUDS = LIGHT_LAYER;
const LIGHT: readonly [number, number] = [0.5, 0.535];
const ASPECT = 1.5;
const OVERSCAN = 1.14;

/**
 * The home page: the gateway painting, alive, with the book's name, a way
 * in, a way to the contents, and the threshold music.
 */
export class Home {
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private root: HTMLDivElement;
  private world!: HTMLDivElement;
  private dust?: Dust;
  private sound = new Sound(AMBIENT);
  private soundToggle: SoundToggle;
  private raf = 0;
  private last = 0;
  private pointer = { x: 0, y: 0 };
  private eased = { x: 0, y: 0 };

  constructor(
    private host: HTMLElement,
    toc: Toc,
    private available: ReadonlySet<string>,
  ) {
    document.title = "شاهنامه‌ی فردوسی · The Book of Kings";
    document.documentElement.classList.add("at-home");
    this.root = el("div", "home", this.host);
    this.build(toc);
    this.soundToggle = new SoundToggle(host, this.sound);
    this.layout();
    window.addEventListener("resize", this.layout);
    window.addEventListener("pointermove", this.onPointer);
    this.raf = requestAnimationFrame(this.tick);
    requestAnimationFrame(() => this.root.classList.add("is-awake"));
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.layout);
    window.removeEventListener("pointermove", this.onPointer);
    document.documentElement.classList.remove("at-home");
    this.soundToggle.destroy();
    this.sound.destroy();
    this.root.remove();
  }

  private build(toc: Toc) {
    const first = toc.chapters.flatMap((c) => c.sections).find(([id]) => this.available.has(id))?.[0];
    const sections = toc.chapters.reduce((n, c) => n + c.sections.length, 0);
    const couplets = toc.chapters.reduce((n, c) => n + c.sections.reduce((m, s) => m + s[2], 0), 0);
    const saved = readProgress();
    const chapter = saved && toc.chapters.find(c => c.sections.some(([id]) => id === saved.sectionId));
    const lastSection = chapter && saved && chapter.sections.find(([id]) => id === saved.sectionId);
    const resume = saved && lastSection && this.available.has(saved.sectionId) && saved.couplet <= lastSection[2] ? saved : null;

    this.world = el("div", "home__world", this.root);
    this.world.setAttribute("aria-hidden", "true");
    const painting = el("div", "home__painting", this.world);
    const img = el("img", "", painting);
    img.src = PAINTING;
    img.alt = "";
    img.decoding = "async";
    img.addEventListener("load", () => this.root.classList.add("is-painted"));
    el("div", "home__rays", this.world);
    el("div", "home__glow", this.world);
    const clouds = el("div", "home__clouds", this.world);
    const cloudImg = el("img", "", clouds);
    cloudImg.src = CLOUDS;
    cloudImg.alt = "";

    const canvas = el("canvas", "home__dust", this.root);
    canvas.setAttribute("aria-hidden", "true");
    if (!this.reduced) this.dust = new Dust(canvas);
    el("div", "home__shade", this.root).setAttribute("aria-hidden", "true");
    el("div", "home__flood", this.root).setAttribute("aria-hidden", "true");

    const title = el("div", "home__title", this.root);
    title.innerHTML = `
      <h1 class="home__name"><span>شاهنامه</span></h1>
      <p class="home__en" lang="en" dir="ltr">The Shahnameh<span class="home__en-sep">·</span><em>The Book of Kings</em></p>
      <p class="home__poet">حکیم ابوالقاسم فردوسی توسی</p>
      ${headpiece("home__ornament")}
      <p class="home__facts">${toPersianDigits(toc.chapters.length)} داستان · ${toPersianDigits(sections)} بخش · ${toPersianDigits(couplets.toLocaleString("en-US").replace(/,/g, "٬"))} بیت</p>
      <div class="home__actions">
        ${resume ? `<section class="home__resume" aria-label="آخرین خواندن">
          <p class="home__resume-chapter"></p><h2 class="home__resume-title"></h2>
          <p class="home__resume-count"></p>
          <progress class="home__resume-progress" aria-label="پیشرفت در این بخش" max="${lastSection![2]}" value="${resume.couplet}"></progress>
        </section>` : ""}
        <a class="home__begin" href="#/${resume?.sectionId ?? first ?? ""}">
          <svg class="home__cartouche" viewBox="0 0 280 60" preserveAspectRatio="none" aria-hidden="true">
            <path class="home__cartouche-fill" d="M20 1 H260 L279 30 L260 59 H20 L1 30 Z"/>
            <path class="home__cartouche-inner" d="M24 5 H256 L271 30 L256 55 H24 L9 30 Z"/>
          </svg>
          <span class="home__begin-fa">${resume ? "ادامه‌ی خواندن" : "آغاز خواندن"}</span>
        </a>
        <a class="home__open" href="#/contents">
          <span>فهرست داستان‌ها</span>
        </a>
      </div>`;
    if (resume) {
      title.classList.add("has-progress");
      title.querySelector(".home__resume-chapter")!.textContent = `آخرین خواندن · ${chapter!.title}`;
      title.querySelector(".home__resume-title")!.textContent = lastSection![1];
      title.querySelector(".home__resume-count")!.textContent = `بیت ${toPersianDigits(resume.couplet)} از ${toPersianDigits(lastSection![2])}`;
    }
  }

  /** Size the painting to cover the screen with room to drift, its light a little above centre. */
  private layout = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const coverW = Math.max(vw, vh * ASPECT) * OVERSCAN;
    const coverH = coverW / ASPECT;
    const narrow = vw / vh < 1;
    // Put the light at 30% of the screen height (24% on phones), as far as the overscan allows.
    const wantY = (narrow ? 0.24 : 0.3) * vh;
    const top = Math.min(0, Math.max(vh - coverH, wantY - LIGHT[1] * coverH));
    const left = (vw - coverW) / 2;
    const s = this.world.style;
    s.width = `${coverW}px`;
    s.height = `${coverH}px`;
    s.left = `${left}px`;
    s.top = `${top}px`;
    s.transformOrigin = `${LIGHT[0] * 100}% ${LIGHT[1] * 100}%`;
    s.setProperty("--lx", `${LIGHT[0] * 100}%`);
    s.setProperty("--ly", `${LIGHT[1] * 100}%`);
    this.root.style.setProperty("--light-x", `${left + LIGHT[0] * coverW}px`);
    this.root.style.setProperty("--light-y", `${top + LIGHT[1] * coverH}px`);
    this.dust?.resize();
  };

  private onPointer = (e: PointerEvent) => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private tick = (now: number) => {
    const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 1 / 60;
    this.last = now;
    if (!this.reduced) {
      // The world leans gently away from the pointer, so it feels deep.
      const k = 1 - Math.exp(-dt * 2.5);
      this.eased.x = lerp(this.eased.x, this.pointer.x, k);
      this.eased.y = lerp(this.eased.y, this.pointer.y, k);
      this.root.style.setProperty("--px", this.eased.x.toFixed(4));
      this.root.style.setProperty("--py", this.eased.y.toFixed(4));
      this.dust?.frame(dt, 0, 0.5, now / 1000);
    }
    this.sound.update(0, 0);
    this.raf = requestAnimationFrame(this.tick);
  };
}
