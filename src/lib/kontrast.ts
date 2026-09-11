// kontrast.ts — Kontrastverhältnis zweier Farben nach WCAG 2.x.
// Formel: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
// Ergebnis zwischen 1 (gleiche Farbe) und 21 (Schwarz auf Weiss).

/** Mindestkontrast für normalen Text (WCAG AA). */
export const MINDESTKONTRAST = 4.5;

function kanal(wert: number): number {
  const c = wert / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative Helligkeit einer Farbe im Format #rrggbb. */
export function helligkeit(farbe: string): number {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(farbe);
  if (!m) throw new Error(`Farbe «${farbe}» ist nicht im Format #rrggbb.`);
  const [r, g, b] = m.slice(1).map((h) => kanal(parseInt(h, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zwischen zwei Farben (Reihenfolge egal). */
export function kontrast(farbe1: string, farbe2: string): number {
  const [hell, dunkel] = [helligkeit(farbe1), helligkeit(farbe2)].sort(
    (a, b) => b - a,
  );
  return (hell + 0.05) / (dunkel + 0.05);
}
