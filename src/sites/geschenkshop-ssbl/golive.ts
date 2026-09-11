// golive.ts — Live-Gang-Check des Geschenkshops (Aufgabe 013, Seiten-Haken zu
// src/lib/golive.ts): Jedes Produkt braucht Beschreibung, Preis und Stückzahl,
// und die Werkstatt-Geschichte (Aufgabe 025) muss eingebaut sein.
import type { Produkt } from "./produkte";
import { produkte } from "./produkte";
import { geschichteEingebaut } from "./site";

/** Mängel für eine Produktliste und den Merker der Geschichte (testbar). */
export function geschenkshopMaengel(
  liste: readonly Pick<Produkt, "name" | "beschreibung" | "preis" | "stueck">[],
  geschichte: boolean,
): string[] {
  const maengel: string[] = [];
  for (const p of liste) {
    if (!p.beschreibung) maengel.push(`Beschreibung fehlt: ${p.name}`);
    if (p.preis === undefined) maengel.push(`Preis fehlt: ${p.name}`);
    if (p.stueck === undefined) maengel.push(`Stückzahl fehlt: ${p.name}`);
  }
  if (!geschichte) {
    maengel.push(
      "Werkstatt-Geschichte mit Foto ist noch nicht eingebaut (Aufgabe 025)",
    );
  }
  return maengel;
}

export default function pruefe(): string[] {
  return geschenkshopMaengel(produkte, geschichteEingebaut);
}
