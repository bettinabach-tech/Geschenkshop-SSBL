// golive.ts — Live-Gang-Check (Aufgabe 013): Was fehlt noch, bevor eine Seite
// veröffentlicht werden darf? Während des Baus dürfen diese Angaben fehlen
// (site.ts: «optional bis Live-Gang»); darum läuft der Check NICHT in
// verify.sh, sondern von Hand: npm run check:golive -- <slug>.
// Rein: bekommt alles übergeben, liest selbst keine Dateien.
import type { Site } from "./site";

/** Seiten-Haken: src/sites/<slug>/golive.ts exportiert default eine solche
 *  Funktion, die weitere Mängel der Seite meldet. */
export type SeitenPruefung = (site: Site) => string[];

/** Angaben, die jede Seite vor dem Live-Gang braucht. */
export function allgemeineMaengel(site: Site): string[] {
  const maengel: string[] = [];
  if (!site.kontakt.telefon) {
    maengel.push("Telefonnummer fehlt (kontakt.telefon)");
  }
  if (!site.rechtliches.impressumUrl) {
    maengel.push("Link zum Impressum fehlt (rechtliches.impressumUrl)");
  }
  if (!site.rechtliches.datenschutzUrl) {
    maengel.push(
      "Link zur Datenschutzerklärung fehlt (rechtliches.datenschutzUrl)",
    );
  }
  if (!site.formular.endpunkt) {
    maengel.push(
      "Adresse des Formular-Empfängers fehlt (formular.endpunkt, kommt mit dem Anbieter)",
    );
  }
  if (!site.adresse) {
    maengel.push("Internetadresse der Seite fehlt (adresse, z.B. https://…)");
  }
  return maengel;
}

export interface GoliveErgebnis {
  zeilen: string[];
  /** 0 = bereit, 1 = es fehlt noch etwas */
  code: 0 | 1;
}

/** Alle Mängel einer Seite: allgemeine + die des Seiten-Hakens. */
export function pruefeGolive(
  site: Site,
  seitenPruefung?: SeitenPruefung,
): GoliveErgebnis {
  const maengel = [
    ...allgemeineMaengel(site),
    ...(seitenPruefung?.(site) ?? []),
  ];
  if (maengel.length === 0) {
    return {
      zeilen: [`Bereit für den Live-Gang: «${site.slug}» ist vollständig.`],
      code: 0,
    };
  }
  return {
    zeilen: [
      `Noch nicht bereit für den Live-Gang: «${site.slug}» — ${maengel.length} ${
        maengel.length === 1 ? "Angabe fehlt" : "Angaben fehlen"
      }:`,
      ...maengel.map((m) => `- ${m}`),
    ],
    code: 1,
  };
}
