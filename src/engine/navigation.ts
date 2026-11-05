import { el } from "./util";

const paths = {
  home: '<path d="m3 10 9-7 9 7v10H7V10m0 10h10M10 20v-6h4v6"/>',
  contents: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  back: '<path d="m13 5 7 7-7 7M20 12H4"/>',
  next: '<path d="m11 5-7 7 7 7M4 12h16"/>',
};

export function icon(name: keyof typeof paths) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

/** Each link has one destination; back always means the enclosing book level. */
export function navigation(host: HTMLElement, back?: { href: string; label: string }, current?: "contents") {
  const nav = el("nav", "site-nav", host);
  nav.setAttribute("aria-label", "راه‌های کتاب");
  const links = [
    { href: "#/", label: "خانه", glyph: "home" as const },
    ...(!back?.href.startsWith("#/contents/back/") ? [{ href: "#/contents", label: "فهرست", glyph: "contents" as const }] : []),
    ...(back ? [{ ...back, glyph: "back" as const }] : []),
  ];
  for (const item of links) {
    const link = el("a", "site-nav__link", nav);
    link.href = item.href;
    link.innerHTML = `${icon(item.glyph)}<span></span>`;
    link.querySelector("span")!.textContent = item.label;
    if (current === "contents" && item.glyph === "contents") link.setAttribute("aria-current", "page");
  }
  return nav;
}
