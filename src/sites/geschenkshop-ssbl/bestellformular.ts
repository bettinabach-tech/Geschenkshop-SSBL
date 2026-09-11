// bestellformular.ts — Seitenlogik des Bestellformulars im Browser
// (Aufgaben 019 und 020).
// - Meldet die Bestellregeln (018) als Zusatzprüfung an: So zeigt der Browser
//   dieselben Hinweise, die der Server prüft. Die Produktdaten (id, preis,
//   stueck, wein) liegen als JSON in #<formular-id>-produkte.
// - Blendet die Lieferadresse (#<id>-adresse) nur bei «Lieferung» ein und das
//   Häkchen «mindestens 16» (#<id>-alter) nur, wenn ein Wein eine Menge ≥ 1
//   hat. Ausgeblendete Felder prüft und sendet das Formular nicht (client.ts).
import { setzeZusatz } from "../../lib/formular/client";
import { pruefeBestellung } from "./bestellregeln";
import type { Produkt } from "./produkte";

export const BESTELLFORMULAR_ID = "bestellung";

export type ProduktRegel = Pick<Produkt, "id" | "preis" | "stueck" | "wein">;

/** Nur die Angaben, die die Regeln brauchen (landen im HTML der Seite). */
export function regelDaten(produkte: readonly Produkt[]): ProduktRegel[] {
  return produkte.map(({ id, preis, stueck, wein }) => ({
    id,
    preis,
    stueck,
    wein,
  }));
}

/** Bereich zeigen oder ausblenden; beim Ausblenden alle Hinweise entfernen. */
function setzeSichtbar(bereich: HTMLElement | null, sichtbar: boolean): void {
  if (!bereich || bereich.hidden === !sichtbar) return;
  bereich.hidden = !sichtbar;
  if (sichtbar) return;
  for (const kasten of bereich.querySelectorAll<HTMLElement>(".feld__fehler")) {
    kasten.hidden = true;
    kasten.textContent = "";
  }
  for (const el of bereich.querySelectorAll("[aria-invalid]")) {
    el.removeAttribute("aria-invalid");
  }
}

export function richteBestellformularEin(form: HTMLFormElement): void {
  const json = document.getElementById(`${form.id}-produkte`)?.textContent;
  const produkte = JSON.parse(json ?? "[]") as ProduktRegel[];
  setzeZusatz(form.id, (daten) => pruefeBestellung(daten, produkte).fehler);

  const adresse = document.getElementById(`${form.id}-adresse`);
  const alter = document.getElementById(`${form.id}-alter`);
  const wege = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[name="weg"]'),
  );
  // Mengenfelder der Weine (sie stehen in den Produktkarten, ausserhalb des <form>)
  const weinMengen = produkte
    .filter((p) => p.wein)
    .map((p) => document.getElementById(`menge-${p.id}`))
    .filter((el): el is HTMLInputElement => el instanceof HTMLInputElement);

  const aktualisiere = () => {
    const weg = wege.find((w) => w.checked)?.value;
    setzeSichtbar(adresse, weg === "lieferung");
    setzeSichtbar(
      alter,
      weinMengen.some((el) => Number(el.value) >= 1),
    );
  };
  for (const el of [...wege, ...weinMengen]) {
    el.addEventListener("change", aktualisiere);
    el.addEventListener("input", aktualisiere);
  }
  aktualisiere(); // z.B. wenn der Browser beim Zurückgehen Eingaben wiederherstellt
}
