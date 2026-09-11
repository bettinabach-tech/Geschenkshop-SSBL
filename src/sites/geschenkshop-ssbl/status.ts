// status.ts — Zustand und Preisanzeige eines Produkts für Anzeige, Bestellung
// und Mails (decisions.md Nr. 6). Rein, ohne Dateizugriff: läuft im Build, im
// Browser und auf dem Server.
import type { Produkt } from "./produkte";

/**
 * - «preis-folgt»: Preis oder Stückzahl fehlen noch → nicht bestellbar
 * - «ausverkauft»: stueck 0 → sichtbar, nicht bestellbar
 * - «bestellbar»: Preis und Stückzahl ≥ 1 vorhanden
 */
export type ProduktStatus = "preis-folgt" | "ausverkauft" | "bestellbar";

export function produktStatus(
  produkt: Pick<Produkt, "preis" | "stueck">,
): ProduktStatus {
  if (produkt.preis === undefined || produkt.stueck === undefined) {
    return "preis-folgt";
  }
  return produkt.stueck === 0 ? "ausverkauft" : "bestellbar";
}

/** Preis in Franken mit zwei Stellen: 24.5 → «CHF 24.50». */
export function formatierePreis(preis: number): string {
  return `CHF ${preis.toFixed(2)}`;
}
