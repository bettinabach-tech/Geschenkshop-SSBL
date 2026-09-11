// bestellregeln.ts — die Regeln einer Bestellung im Geschenkshop (Aufgabe 018).
// Dieselben Regeln prüfen im Browser (Hinweis am Feld, 019/020) und auf dem
// Server (021): eine Stelle, keine Abweichungen. Rein: kein DOM, kein Netz,
// keine Uhr — darum auch keine Imports mit Dateizugriff (nur Typen).
// Die Daten kommen ungeprüft an (vom Server: beliebiges JSON), darum prüft
// jede Regel auch den Typ.
// Texte: vom Auftraggeber freigegeben am 11.09.2026.
import {
  FORMAT_MELDUNG,
  istEmail,
  istTelefon,
} from "../../lib/formular/regeln";
import type { Produkt } from "./produkte";
import { produktStatus } from "./status";

export type Bestellfehler = Record<string, string>;

export const MELDUNG = {
  keineMenge: "Bitte wählen Sie mindestens ein Geschenk aus.",
  keineGanzeZahl: "Bitte geben Sie eine ganze Zahl ab 0 an.",
  zuViele: (stueck: number) => `Es sind nur noch ${stueck} Stück verfügbar.`,
  ausverkauft: "Dieses Geschenk ist leider ausverkauft.",
  preisFolgt: "Dieses Geschenk kann noch nicht bestellt werden.",
  unbekannt: "Ein Geschenk gibt es nicht mehr. Bitte laden Sie die Seite neu.",
  name: "Bitte geben Sie Ihren Namen an.",
  vorname: "Bitte geben Sie Ihren Vornamen an.",
  emailFehlt: "Bitte geben Sie Ihre E-Mail-Adresse an.",
  email: FORMAT_MELDUNG.email,
  telefonFehlt: "Bitte geben Sie Ihre Telefonnummer an.",
  telefon: FORMAT_MELDUNG.telefon,
  zuLang: "Bitte kürzen Sie auf höchstens 100 Zeichen.",
  weg: "Bitte wählen Sie Lieferung oder Abholung.",
  strasse: "Bitte geben Sie Strasse und Hausnummer an.",
  plz: "Bitte geben Sie eine Postleitzahl mit 4 Ziffern an.",
  ort: "Bitte geben Sie den Ort an.",
  zahlung: "Bitte wählen Sie Twint oder Karte.",
  alter16:
    "Wein verkaufen wir nur an Personen ab 16 Jahren. Bitte bestätigen Sie Ihr Alter.",
} as const;

const MAX_LAENGE = 100;
const WEGE = ["lieferung", "abholung"];
const ZAHLUNGEN = ["twint", "karte"];
const ADRESSE = ["strasse", "plz", "ort"] as const;

type ProduktRegel = Pick<Produkt, "id" | "preis" | "stueck" | "wein">;

const text = (wert: unknown): string =>
  typeof wert === "string" ? wert.trim() : "";

/** Pflicht-Textfeld mit 1–100 Zeichen (nach trim). */
function pflichtText(wert: unknown, fehlt: string): string | null {
  const t = text(wert);
  if (t === "") return fehlt;
  return t.length > MAX_LAENGE ? MELDUNG.zuLang : null;
}

/** Prüft eine Bestellung. Leeres `fehler` = gültig. */
export function pruefeBestellung(
  daten: Record<string, unknown>,
  produkte: readonly ProduktRegel[],
): { fehler: Bestellfehler } {
  const fehler: Bestellfehler = {};
  const setze = (feld: string, meldung: string | null) => {
    if (meldung && !fehler[feld]) fehler[feld] = meldung;
  };

  // Regeln 1–4 und 13: Mengen
  const mengen =
    daten.mengen &&
    typeof daten.mengen === "object" &&
    !Array.isArray(daten.mengen)
      ? (daten.mengen as Record<string, unknown>)
      : {};
  const nachId = new Map(produkte.map((p) => [p.id, p]));
  let bestellt = 0;
  let weinBestellt = false;
  for (const [id, menge] of Object.entries(mengen)) {
    const produkt = nachId.get(id);
    if (!produkt) {
      setze("mengen", MELDUNG.unbekannt); // Regel 1: unbekannte id
      continue;
    }
    const feld = `menge-${id}`;
    if (typeof menge !== "number" || !Number.isInteger(menge) || menge < 0) {
      setze(feld, MELDUNG.keineGanzeZahl); // Regel 1
      continue;
    }
    if (menge === 0) continue;
    bestellt += 1;
    if (produkt.wein) weinBestellt = true;
    const status = produktStatus(produkt);
    if (status === "preis-folgt")
      setze(feld, MELDUNG.preisFolgt); // Regel 4
    else if (status === "ausverkauft")
      setze(feld, MELDUNG.ausverkauft); // Regel 4
    else if (menge > produkt.stueck!)
      setze(feld, MELDUNG.zuViele(produkt.stueck!)); // Regel 3
  }
  if (bestellt === 0 && !fehler.mengen) setze("mengen", MELDUNG.keineMenge); // Regel 2

  // Regeln 5–8: Angaben zur Person
  setze("name", pflichtText(daten.name, MELDUNG.name));
  setze("vorname", pflichtText(daten.vorname, MELDUNG.vorname));
  const email = text(daten.email);
  setze(
    "email",
    email === "" ? MELDUNG.emailFehlt : istEmail(email) ? null : MELDUNG.email,
  );
  const telefon = text(daten.telefon);
  setze(
    "telefon",
    telefon === ""
      ? MELDUNG.telefonFehlt
      : istTelefon(telefon)
        ? null
        : MELDUNG.telefon,
  );

  // Regeln 9–11: Lieferung oder Abholung
  const weg = text(daten.weg);
  if (!WEGE.includes(weg)) setze("weg", MELDUNG.weg);
  if (weg === "lieferung") {
    setze("strasse", pflichtText(daten.strasse, MELDUNG.strasse));
    setze("plz", /^\d{4}$/.test(text(daten.plz)) ? null : MELDUNG.plz);
    setze("ort", pflichtText(daten.ort, MELDUNG.ort));
  }

  // Regel 12: Zahlungsart
  if (!ZAHLUNGEN.includes(text(daten.zahlung)))
    setze("zahlung", MELDUNG.zahlung);

  // Regel 13: Wein nur ab 16
  if (weinBestellt && daten.alter16 !== true) setze("alter16", MELDUNG.alter16);

  return { fehler };
}

/** Leerzeichen am Rand entfernen; bei Abholung die Adresse weglassen. */
export function bereinige(
  daten: Record<string, unknown>,
): Record<string, unknown> {
  const sauber: Record<string, unknown> = {};
  for (const [feld, wert] of Object.entries(daten)) {
    sauber[feld] = typeof wert === "string" ? wert.trim() : wert;
  }
  if (sauber.weg === "abholung") {
    for (const feld of ADRESSE) delete sauber[feld];
  }
  return sauber;
}
