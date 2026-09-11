// schluss.ts — Bestellschluss eines Formulars (Aufgabe 022, decisions.md Nr. 10).
// formular.schluss ist der erste Zeitpunkt, an dem NICHT mehr bestellt werden
// kann (z.B. 2026-12-16T00:00:00+01:00). Rein: Uhrzeit wird übergeben.
// Text: vom Auftraggeber freigegeben am 11.09.2026.
import { datumZuerich } from "../zeit";

/** true ab dem Schluss-Zeitpunkt (genau: jetzt ≥ schluss). */
export function istGeschlossen(
  schluss: string | undefined,
  jetzt: Date,
): boolean {
  return schluss !== undefined && jetzt.getTime() >= Date.parse(schluss);
}

/** Hinweis statt des Formulars. Nennt den letzten Bestelltag (Tag vor dem
 *  Schluss-Zeitpunkt, in Zürcher Zeit): Schluss 16.12., 00:00 → «15.12.2026». */
export function schlussHinweis(schluss: string): string {
  const letzterMoment = new Date(Date.parse(schluss) - 1);
  return `Der Bestellschluss war am ${datumZuerich(letzterMoment)}. Herzlichen Dank für Ihr Interesse!`;
}
