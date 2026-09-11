// bestellformular.ts — Seitenlogik des Bestellformulars im Browser (Aufgabe 019;
// Adresse und Altersbestätigung folgen mit 020).
// Meldet die Bestellregeln (018) als Zusatzprüfung an: So zeigt der Browser
// dieselben Hinweise, die der Server prüft. Die Produktdaten (id, preis,
// stueck, wein) liegen als JSON in #<formular-id>-produkte.
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

export function richteBestellformularEin(form: HTMLFormElement): void {
  const json = document.getElementById(`${form.id}-produkte`)?.textContent;
  const produkte = JSON.parse(json ?? "[]") as ProduktRegel[];
  setzeZusatz(form.id, (daten) => pruefeBestellung(daten, produkte).fehler);
}
