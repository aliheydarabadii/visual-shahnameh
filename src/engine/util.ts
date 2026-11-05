export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 → 1 as v goes from a to b, clamped. */
export const progress = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = progress(v, a, b);
  return t * t * (3 - 2 * t);
};
export const easeInCubic = (t: number) => t * t * t;
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const toPersianDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  parent?: Element,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  parent?.appendChild(node);
  return node;
}
