// empfaenger.ts — der Formular-Empfänger auf dem Server (Aufgabe 010).
// Prüft eine Einsendung und leitet sie per E-Mail weiter; gespeichert wird
// nichts (decisions.md Nr. 7). Anbieterneutral: Den Anschluss an den
// Hosting-Anbieter macht eine dünne Datei in Aufgabe 027.
// Alles, was von aussen kommt (Prüfung, Mails, Uhr, Versand, Texte), wird
// übergeben — so ist die Funktion ohne Mailserver und mit fester Uhr testbar.
// Einziger Seiteneffekt: `versand` (und das Protokoll bei Fehlern).

export interface Anfrage {
  /** HTTP-Methode, z.B. «POST». */
  methode: string;
  /** Der Text der Anfrage, wie er ankommt (erwartet: JSON). */
  body: string;
}

export interface Mail {
  an: string;
  betreff: string;
  text: string;
  html?: string;
  /** Antworten an diese Adresse (z.B. an die bestellende Person). */
  antwortAn?: string;
}

export type Daten = Record<string, unknown>;

export interface Abhaengigkeiten {
  /** Prüft die Daten; leeres Objekt = gültig (z.B. pruefeBestellung, 018). */
  pruefe: (daten: Daten) => Record<string, string>;
  /** [Mail an den Empfänger, Bestätigung an die einsendende Person] (021). */
  baueMails: (daten: Daten) => readonly [Mail, Mail];
  /** Ab diesem Zeitpunkt keine Einsendungen mehr (formular.schluss). */
  schluss?: Date;
  jetzt: () => Date;
  versand: (mail: Mail) => Promise<void>;
  /** Texte für die Person, die das Formular abschickt. */
  meldungen: { schluss: string; versandFehler: string };
  /** Fehlerprotokoll; Standard: console.error. Nie Personendaten hineinschreiben. */
  protokolliere?: (text: string) => void;
}

export interface Antwort {
  status: number;
  json: { ok: true } | { ok: false; fehler?: Record<string, string> };
}

/** Grösste erlaubte Einsendung: 20 KB (eine Bestellung hat unter 2 KB). */
export const MAX_BYTES = 20 * 1024;

/** Unsichtbares Spam-Feld (decisions.md Nr. 9). */
const FALLE = "website";

const fehlerText = (fehler: unknown) =>
  fehler instanceof Error ? fehler.message : String(fehler);

export async function verarbeiteEinsendung(
  anfrage: Anfrage,
  abh: Abhaengigkeiten,
): Promise<Antwort> {
  const protokolliere = abh.protokolliere ?? ((text) => console.error(text));

  // 1. Nur POST
  if (anfrage.methode.toUpperCase() !== "POST") {
    return { status: 405, json: { ok: false } };
  }

  // 2. Höchstens 20 KB, gültiges JSON-Objekt
  if (new TextEncoder().encode(anfrage.body).length > MAX_BYTES) {
    return { status: 400, json: { ok: false } };
  }
  let daten: unknown;
  try {
    daten = JSON.parse(anfrage.body);
  } catch {
    return { status: 400, json: { ok: false } };
  }
  if (!daten || typeof daten !== "object" || Array.isArray(daten)) {
    return { status: 400, json: { ok: false } };
  }
  const einsendung = daten as Daten;

  // 3. Spam-Falle gefüllt → so tun, als wäre alles gut, aber nichts senden
  const falle = einsendung[FALLE];
  if (typeof falle === "string" ? falle.trim() !== "" : falle != null) {
    return { status: 200, json: { ok: true } };
  }

  // 4. Nach Schluss: keine Einsendungen mehr
  if (abh.schluss && abh.jetzt().getTime() >= abh.schluss.getTime()) {
    return {
      status: 410,
      json: { ok: false, fehler: { _formular: abh.meldungen.schluss } },
    };
  }

  // 5. Prüfung (dieselben Regeln wie im Browser)
  const fehler = abh.pruefe(einsendung);
  if (Object.keys(fehler).length > 0) {
    return { status: 400, json: { ok: false, fehler } };
  }

  // 6. Mails: zuerst an den Empfänger, dann die Bestätigung
  const [anEmpfaenger, bestaetigung] = abh.baueMails(einsendung);
  try {
    await abh.versand(anEmpfaenger);
  } catch (fehler) {
    protokolliere(`Mail an den Empfänger gescheitert: ${fehlerText(fehler)}`);
    return {
      status: 502,
      json: { ok: false, fehler: { _formular: abh.meldungen.versandFehler } },
    };
  }
  try {
    await abh.versand(bestaetigung);
  } catch (fehler) {
    // Die Einsendung ist beim Empfänger angekommen — für die Person gilt sie
    // als erfolgreich. Der Empfänger meldet sich ohnehin.
    protokolliere(`Bestätigungsmail gescheitert: ${fehlerText(fehler)}`);
  }
  return { status: 200, json: { ok: true } };
}
