// empfaenger.ts — der Bestell-Empfänger des Geschenkshops (Aufgabe 021).
// Verbindet den allgemeinen Formular-Empfänger (src/server/empfaenger.ts, 010)
// mit den Bestellregeln (018), den Mails (mails.ts) und dem Bestellschluss.
// Der Anschluss an den Hosting-Anbieter (027) ruft `erstelleBestellEmpfaenger`
// mit Produktliste, Seiten-Einstellungen und Versand auf.
// Texte: vom Auftraggeber freigegeben am 11.09.2026.
import {
  verarbeiteEinsendung,
  type Anfrage,
  type Antwort,
  type Mail,
} from "../../server/empfaenger";
import type { Site } from "../../lib/site";
import { bereinige, pruefeBestellung } from "./bestellregeln";
import { datumZuerich } from "../../lib/zeit";
import { baueMails } from "./mails";
import type { Produkt } from "./produkte";

export interface BestellEmpfaengerOptionen {
  produkte: readonly Produkt[];
  site: Pick<Site, "formular" | "kontakt">;
  versand: (mail: Mail) => Promise<void>;
  jetzt?: () => Date;
  protokolliere?: (text: string) => void;
}

/** Text für Einsendungen nach dem Bestellschluss (Antwort 410). */
export function schlussMeldung(schluss: Date): string {
  return `Bestellschluss vorbei: Seit dem ${datumZuerich(schluss)} nehmen wir keine Bestellungen mehr an. Herzlichen Dank für Ihr Interesse!`;
}

export const VERSAND_FEHLER =
  "Leider hat das Senden nicht geklappt. Bitte versuchen Sie es noch einmal.";

export function erstelleBestellEmpfaenger(
  optionen: BestellEmpfaengerOptionen,
): (anfrage: Anfrage) => Promise<Antwort> {
  const { produkte, site, versand, protokolliere } = optionen;
  const jetzt = optionen.jetzt ?? (() => new Date());
  const schluss = site.formular.schluss
    ? new Date(site.formular.schluss)
    : undefined;
  return (anfrage) =>
    verarbeiteEinsendung(anfrage, {
      pruefe: (daten) => pruefeBestellung(bereinige(daten), produkte).fehler,
      baueMails: (daten) =>
        baueMails(bereinige(daten), produkte, site, jetzt()),
      schluss,
      jetzt,
      versand,
      meldungen: {
        schluss: schluss ? schlussMeldung(schluss) : "",
        versandFehler: VERSAND_FEHLER,
      },
      protokolliere,
    });
}
