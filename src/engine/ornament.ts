/**
 * Illumination drawn in code (تذهیب), so it stays crisp at every size and
 * takes its colour from CSS `currentColor`.
 */

/** An eight-pointed star rosette (شمسه) with rings. */
function rosette(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.62;
    points.push(`${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)}`);
  }
  return `
    <circle cx="${cx}" cy="${cy}" r="${r * 1.32}" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.6"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 1.14}" fill="none" stroke="currentColor" stroke-width="0.9"/>
    <polygon points="${points.join(" ")}" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="currentColor"/>`;
}

/** A horizontal headpiece: rosette in the middle, ruled lines tapering out. */
export function headpiece(className: string): string {
  const w = 320;
  const h = 40;
  const cy = h / 2;
  const lozenge = (x: number) =>
    `<path d="M${x - 5} ${cy} L${x} ${cy - 3.5} L${x + 5} ${cy} L${x} ${cy + 3.5} Z" fill="currentColor"/>`;
  return `<svg class="${className}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <defs>
      <linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset="1" stop-color="currentColor"/></linearGradient>
      <linearGradient id="fadeR" x1="1" x2="0"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset="1" stop-color="currentColor"/></linearGradient>
    </defs>
    <rect x="8" y="${cy - 3.2}" width="${w / 2 - 38}" height="0.7" fill="url(#fadeL)"/>
    <rect x="8" y="${cy + 2.5}" width="${w / 2 - 38}" height="0.7" fill="url(#fadeL)"/>
    <rect x="${w / 2 + 30}" y="${cy - 3.2}" width="${w / 2 - 38}" height="0.7" fill="url(#fadeR)"/>
    <rect x="${w / 2 + 30}" y="${cy + 2.5}" width="${w / 2 - 38}" height="0.7" fill="url(#fadeR)"/>
    ${lozenge(w / 2 - 26)}${lozenge(w / 2 + 26)}
    ${rosette(w / 2, cy, 13)}
  </svg>`;
}

/** Small mark that sits between the two hemistichs. */
export function verseMark(className: string): string {
  return `<svg class="${className}" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 1 L12 8 L19 10 L12 12 L10 19 L8 12 L1 10 L8 8 Z" fill="currentColor"/>
  </svg>`;
}

/** A standalone sun rosette (شمسه), for marking closed doors and roundels. */
export function shamseh(className: string): string {
  return `<svg class="${className}" viewBox="0 0 40 40" aria-hidden="true">${rosette(20, 20, 13)}</svg>`;
}
