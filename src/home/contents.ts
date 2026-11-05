import { sections } from "../content";
import { artUrl } from "../content/art";
import { headpiece, shamseh } from "../engine/ornament";
import { Sound } from "../engine/sound";
import { navigation } from "../engine/navigation";
import { SoundToggle } from "../engine/sound-toggle";
import { el, toPersianDigits } from "../engine/util";
import { AMBIENT } from "./home";
import type { Toc } from "./toc";

type Chapter = Toc["chapters"][number];

/** A pointed Persian arch, in a 100×150 box. Used as a mask and as the gold outline. */
const ARCH = "M0 150 V62 C0 34 22 16 50 1 C78 16 100 34 100 62 V150 Z";
const ARCH_INNER = "M5 150 V64 C5 38 25 21 50 7 C75 21 95 38 95 64 V150";

/**
 * The contents (فهرست). Every story is a doorway:
 * Native vertical browsing of illustrated arches, grouped by the book's ages.
 * A chapter pairs its arch with a readable section list in the same scroll.
 * Built sections open; forthcoming sections remain clearly labelled.
 */
export class Contents {
  private root: HTMLDivElement;
  private sound = new Sound(AMBIENT);
  private soundToggle: SoundToggle;
  private raf = 0;
  private restoreFrame = 0;
  private onCollectionScroll?: () => void;
  private collection = false;

  constructor(
    host: HTMLElement,
    private toc: Toc,
    private available: ReadonlySet<string>,
    view: { chapter?: string; returnTo?: string } = {},
  ) {
    document.documentElement.classList.add("at-contents");
    this.root = el("div", "contents", host);
    const backdrop = el("div", "contents__backdrop", this.root);
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.style.backgroundImage = `url("${artUrl("01-01/00-dargah.avif")}")`;
    const chapter = toc.chapters.find((c) => c.id === view.chapter);
    if (chapter) this.buildChapter(chapter);
    else this.buildProcession(view.returnTo);
    this.soundToggle = new SoundToggle(host, this.sound);
    const tick = () => {
      this.sound.update(0, 0);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.restoreFrame);
    if (this.onCollectionScroll) window.removeEventListener("scroll", this.onCollectionScroll);
    if (this.collection) sessionStorage.setItem("shahnameh.contents.scroll", String(window.scrollY));
    this.soundToggle.destroy();
    this.sound.destroy();
    document.documentElement.classList.remove("at-contents");
    this.root.remove();
  }

  private lit(chapter: Chapter) {
    return chapter.sections.filter(([id]) => this.available.has(id));
  }

  // ----------------------------------------------------------- procession

  private buildProcession(returnTo?: string) {
    this.collection = true;
    document.title = "فهرست · شاهنامه‌ی فردوسی";
    navigation(this.root, undefined, "contents");
    const total = this.toc.chapters.reduce((n, c) => n + c.sections.length, 0);
    const open = this.toc.chapters.reduce((n, c) => n + this.lit(c).length, 0);
    const head = el("header", "contents__head", this.root);
    head.innerHTML = `
      <h1 class="contents__title">پنجاه داستان</h1>
      <p class="contents__count">${toPersianDigits(open)} بخش گشوده از ${toPersianDigits(total)}</p>`;

    const collection = el("div", "contents__collection", this.root);
    const groups: HTMLElement[] = [];
    for (const era of this.toc.eras) {
      const group = el("section", "contents__era", collection);
      group.id = `era-${era.id}`;
      group.setAttribute("aria-labelledby", `era-title-${era.id}`);
      const header = el("header", "contents__era-head", group);
      const title = el("h2", "contents__era-fa", header);
      title.id = `era-title-${era.id}`;
      title.textContent = era.title;
      const list = el("ol", "contents__doors", group);
      for (const chapter of this.toc.chapters.filter((c) => c.era === era.id)) list.append(this.door(chapter));
      groups.push(group);
    }

    const bar = el("nav", "contents__ages", this.root);
    bar.setAttribute("aria-label", "روزگارهای شاهنامه");
    const buttons = this.toc.eras.map((era, i) => {
      const button = el("button", "contents__age", bar);
      button.type = "button";
      button.textContent = era.title.replace("روزگار ", "");
      button.setAttribute("aria-label", era.title);
      button.addEventListener("click", () => groups[i].scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start",
      }));
      return button;
    });
    const syncAge = () => {
      let active = 0;
      const belowNavigation = this.root.querySelector(".site-nav")!.getBoundingClientRect().bottom + 32;
      groups.forEach((group, i) => { if (group.getBoundingClientRect().top <= belowNavigation) active = i; });
      buttons.forEach((button, i) => {
        if (i === active) button.setAttribute("aria-current", "location");
        else button.removeAttribute("aria-current");
      });
    };
    this.onCollectionScroll = syncAge;
    window.addEventListener("scroll", syncAge, { passive: true });
    this.restoreFrame = requestAnimationFrame(() => {
      const selected = returnTo && this.root.querySelector<HTMLAnchorElement>(`[data-chapter="${returnTo}"]`);
      if (selected) {
        selected.scrollIntoView({ block: "center", behavior: "instant" });
        selected.focus({ preventScroll: true });
      } else window.scrollTo({ top: Number(sessionStorage.getItem("shahnameh.contents.scroll")) || 0, behavior: "instant" });
      syncAge();
    });
  }

  private door(chapter: Chapter) {
    const lit = this.lit(chapter);
    const li = el("li", "contents__door-item");
    const a = el("a", `door${lit.length ? " is-lit" : ""}`, li);
    a.href = `#/contents/${chapter.id}`;
    a.dataset.chapter = chapter.id;
    a.innerHTML = `
      ${this.arch(chapter, lit.length > 0)}
      <span class="door__num">${toPersianDigits(Number(chapter.id))}</span>
      <span class="door__title"></span>
      <span class="door__meta"></span>`;
    a.querySelector(".door__title")!.textContent = chapter.title;
    a.querySelector(".door__meta")!.textContent = lit.length
      ? `${toPersianDigits(lit.length)} از ${toPersianDigits(chapter.sections.length)} بخش گشوده`
      : `${toPersianDigits(chapter.sections.length)} بخش`;
    return li;
  }

  /** An arch: the story's painting if it has one, otherwise night and a rosette. */
  private arch(chapter: Chapter, lit: boolean) {
    const html = `
      <span class="door__arch">
        <span class="door__inside">${lit ? `<img alt="" data-section="${this.lit(chapter)[0][0]}" />` : shamseh("door__rosette")}</span>
        <svg class="door__outline" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true"><path d="${ARCH}"/><path class="door__outline-inner" d="${ARCH_INNER}"/></svg>
      </span>`;
    if (lit) {
      // The painting comes from the story's first built section.
      const id = this.lit(chapter)[0][0];
      void sections[id]?.().then((s) => {
        const img = this.root.querySelector<HTMLImageElement>(`img[data-section="${id}"]`);
        if (img) img.src = s.scenes[0].image;
      });
    }
    return html;
  }

  // -------------------------------------------------------------- chapter

  private buildChapter(chapter: Chapter) {
    document.title = `${chapter.title} · فهرست · شاهنامه‌ی فردوسی`;
    const lit = this.lit(chapter);
    const era = this.toc.eras.find((e) => e.id === chapter.era)!;
    const couplets = chapter.sections.reduce((n, s) => n + s[2], 0);

    navigation(this.root, { href: `#/contents/back/${chapter.id}`, label: "همه‌ی داستان‌ها" });
    const page = el("div", "story", this.root);
    page.innerHTML = `
      <div class="story__intro">
        <div class="story__door ${lit.length ? "is-lit" : ""}">${this.arch(chapter, lit.length > 0)}</div>
        <header class="story__head">
          <p class="story__era"></p>
          <p class="story__num">داستان ${toPersianDigits(Number(chapter.id))}</p>
          <h1 class="story__title"></h1>
          ${headpiece("story__ornament")}
          <p class="story__facts">${toPersianDigits(chapter.sections.length)} بخش · ${toPersianDigits(couplets)} بیت</p>
          ${lit.length ? `<a class="story__begin" href="#/${lit[0][0]}">شروع خواندن</a>` : '<p class="story__soon">این داستان هنوز آماده‌ی خواندن نیست.</p>'}
        </header>
      </div>
      <section class="story__reading" aria-labelledby="story-sections-title">
        <h2 id="story-sections-title" class="story__list-title">بخش‌های داستان <span>${toPersianDigits(lit.length)} گشوده از ${toPersianDigits(chapter.sections.length)}</span></h2>
        <ol class="story__sections"></ol>
      </section>`;
    page.querySelector(".story__era")!.textContent = era.title;
    page.querySelector(".story__title")!.textContent = chapter.title;
    const list = page.querySelector(".story__sections")!;
    chapter.sections.forEach(([id, title, count], i) => {
      const open = this.available.has(id);
      const li = el("li", `story__section${open ? " is-lit" : ""}`, list);
      const row = open ? el("a", "story__row", li) : el("span", "story__row", li);
      if (row instanceof HTMLAnchorElement) row.href = `#/${id}`;
      else row.setAttribute("aria-disabled", "true");
      row.innerHTML = `<span class="story__n">${toPersianDigits(i + 1)}</span><span class="story__name"></span><span class="story__meta"></span>`;
      row.querySelector(".story__name")!.textContent = title;
      row.querySelector(".story__meta")!.textContent = open ? `${toPersianDigits(count)} بیت` : "به‌زودی";
    });
  }
}
