// mails.ts — die zwei Mails einer Bestellung (Aufgabe 021): an das Lädeli und
// die Bestätigung an die bestellende Person. Nur Text (kein HTML): kommt in
// jedem Mailprogramm gleich an.
// Rein: Die Uhrzeit wird übergeben, keine Imports mit Dateizugriff.
// Erwartet bereits geprüfte und bereinigte Daten (pruefeBestellung/bereinige).
// Wortlaut: vom Auftraggeber freigegeben am 11.09.2026.
import type { Mail } from "../../server/empfaenger";
import type { Site } from "../../lib/site";
import { datumZuerich, uhrzeitZuerich } from "../../lib/zeit";
import type { Produkt } from "./produkte";
import { formatierePreis } from "./status";

type MailProdukt = Pick<Produkt, "id" | "name" | "preis" | "wein">;

/** Eingaben einzeilig machen: Zeilenumbrüche und Steuerzeichen → Leerzeichen.
 *  So kann niemand über einen Namen weitere Zeilen (z.B. «Bcc:») einschleusen. */
function einzeilig(wert: unknown): string {
  return String(wert ?? "")
    .replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const ZAHLUNG: Record<string, string> = { twint: "Twint", karte: "Karte" };

interface Position {
  name: string;
  menge: number;
  preis: number;
  rappen: number;
}

/** Bestellte Produkte (Menge ≥ 1) in der Reihenfolge der Produktliste. */
function positionen(
  daten: Record<string, unknown>,
  produkte: readonly MailProdukt[],
): Position[] {
  const mengen = (daten.mengen ?? {}) as Record<string, unknown>;
  return produkte.flatMap((p) => {
    const menge = mengen[p.id];
    if (typeof menge !== "number" || menge < 1 || p.preis === undefined) {
      return [];
    }
    // In Rappen rechnen: keine Rundungsfehler wie 0.1 + 0.2
    const rappen = Math.round(p.preis * 100) * menge;
    return [{ name: p.name, menge, preis: p.preis, rappen }];
  });
}

const franken = (rappen: number) => formatierePreis(rappen / 100);

function produktZeilen(liste: Position[]): string[] {
  return liste.map(
    (p) =>
      `- ${p.menge} × ${p.name} à ${formatierePreis(p.preis)} = ${franken(p.rappen)}`,
  );
}

/**
 * [Mail an das Lädeli (formular.empfaenger), Bestätigung an daten.email].
 * `eingang`: Zeitpunkt des Eingangs (wird in Zürcher Zeit angezeigt).
 */
export function baueMails(
  daten: Record<string, unknown>,
  produkte: readonly MailProdukt[],
  site: Pick<Site, "formular" | "kontakt">,
  eingang: Date,
): readonly [Mail, Mail] {
  const name = einzeilig(daten.name);
  const vorname = einzeilig(daten.vorname);
  const email = einzeilig(daten.email);
  const telefon = einzeilig(daten.telefon);
  const lieferung = daten.weg === "lieferung";
  const strasse = einzeilig(daten.strasse);
  const plzOrt = `${einzeilig(daten.plz)} ${einzeilig(daten.ort)}`;
  const zahlung = ZAHLUNG[einzeilig(daten.zahlung)] ?? einzeilig(daten.zahlung);

  const liste = positionen(daten, produkte);
  const summe = franken(liste.reduce((s, p) => s + p.rappen, 0));
  const mitWein = produkte.some((p) => {
    const menge = (daten.mengen as Record<string, unknown> | undefined)?.[p.id];
    return p.wein && typeof menge === "number" && menge >= 1;
  });
  const datum = datumZuerich(eingang);
  const uhrzeit = uhrzeitZuerich(eingang);

  const anLaedeli: Mail = {
    an: site.formular.empfaenger,
    antwortAn: email,
    betreff: einzeilig(`Neue Bestellung: ${vorname} ${name}`),
    text: [
      "Neue Bestellung über den Geschenkshop",
      `Eingang: ${datum}, ${uhrzeit} Uhr`,
      "",
      "Bestellte Geschenke",
      ...produktZeilen(liste),
      `Summe Produkte: ${summe} (ohne Versand)`,
      "",
      `Name: ${name}`,
      `Vorname: ${vorname}`,
      `E-Mail: ${email}`,
      `Telefon: ${telefon}`,
      "",
      ...(lieferung
        ? ["Lieferung per Post an:", strasse, plzOrt]
        : ["Abholung im Lädeli in Rathausen"]),
      "",
      `Zahlungsart: ${zahlung}`,
      ...(mitWein ? ["Altersbestätigung: mindestens 16 Jahre"] : []),
      "",
      "Bitte innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen melden.",
      `Antworten auf diese Mail gehen direkt an ${email}.`,
    ].join("\n"),
  };

  const bestaetigung: Mail = {
    an: email,
    betreff: "Ihre Bestellung im Geschenkshop der SSBL ist eingegangen",
    text: [
      `Guten Tag ${vorname} ${name}`,
      "",
      `Vielen Dank für Ihre Bestellung! Sie ist am ${datum} um ${uhrzeit} Uhr bei uns eingegangen.`,
      "",
      "Ihre Bestellung",
      ...produktZeilen(liste),
      `Summe Produkte: ${summe}${lieferung ? " (ohne Versandkosten)" : ""}`,
      "",
      "Ihre Angaben",
      `Name: ${name} · Vorname: ${vorname}`,
      `E-Mail: ${email}`,
      `Telefon: ${telefon}`,
      lieferung
        ? `Lieferung per Post an: ${strasse}, ${plzOrt}`
        : "Abholung im Lädeli in Rathausen",
      `Zahlungsart: ${zahlung}`,
      "",
      "Wie es weitergeht",
      "Das Lädeli meldet sich innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen. Ihre Bestellung wird erst mit dieser Rückmeldung verbindlich.",
      "",
      `Fragen? Schreiben Sie an ${site.kontakt.email}.`,
      "",
      "Freundliche Grüsse",
      "Lädeli der SSBL",
    ].join("\n"),
  };

  return [anLaedeli, bestaetigung] as const;
}
