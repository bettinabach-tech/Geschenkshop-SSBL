---
id: 009
title: "Formular-Bausteine mit Prüfung am Feld bauen"
depends_on: [002]
features: [F-26, F-27, F-28, F-29, F-30]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/formular.test.ts"
human_review: true
class: open
---

# Kontext
Gemeinsame Formular-Bausteine aller Seiten. Auftraggeber-Entscheide: Hinweis
direkt am Feld vor dem Absenden · Doppelklick sperren · bei technischem Fehler
Telefon + E-Mail zeigen, Eingaben behalten (decisions.md). Die Daten gehen als
JSON an `formular.endpunkt` (001); der Empfänger ist Aufgabe 010.

# Umfang
- `src/components/formular/`: Formular, Textfeld (Typ text/email/tel), Auswahl
  (Radio-Gruppe), Menge (Zahl mit min/max), Haekchen. Pflichtfelder mit «*» und
  `aria-required`; Hinweis «* Pflichtfeld» über dem Formular.
- Unsichtbares Spam-Feld `website` (decisions.md: «Spam-Schutz ohne Captcha»):
  nicht sichtbar, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`.
- `src/lib/formular/client.ts`: prüft beim Verlassen eines Feldes und beim
  Absenden (Pflicht, E-Mail-Format, Telefon: mind. 9 Ziffern, erlaubt + und
  Leerzeichen, min/max); Hinweis in `#<feld>-fehler` mit `aria-describedby` und
  `aria-invalid`; Fokus aufs erste fehlerhafte Feld. Zusatzprüfung als Haken
  (`pruefeZusatz(daten) → {feld: meldung}`) für seitenspezifische Regeln.
- Absenden: Button sperren, Text «Wird gesendet …», POST JSON an den Endpunkt.
  2xx → Formular ausblenden, Danke-Slot zeigen · 4xx mit `{fehler}` → Hinweise
  an den Feldern bzw. `_formular` oben, Button wieder frei · Netzfehler oder
  5xx → Fehler-Hinweis mit kontakt.telefon und kontakt.email, alle Eingaben
  bleiben stehen, Button wieder frei.
- Tests mit happy-dom (als devDependency hinzufügen); fetch wird im Test ersetzt.
- Stile in `src/styles/formular.css`.

# Nicht Teil dieser Aufgabe
- Die Felder des Geschenkshops (019, 020), Bestellregeln (018).
- Der Empfänger auf dem Server (010). Bestellschluss (022).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/formular.test.ts` prüft einzeln:
  F-26 jedes Pflichtfeld zeigt «*» und hat aria-required="true" ·
  F-27 leeres Pflichtfeld → Hinweis am Feld beim Absenden, fetch NICHT
  aufgerufen · E-Mail «abc» → Hinweis beim Verlassen des Feldes · gültige
  E-Mail → kein Hinweis · Telefon «123» → Hinweis · Zusatzprüfung meldet einen
  Fehler → Hinweis am genannten Feld ·
  F-28 nach dem Klick ist der Button gesperrt und zeigt «Wird gesendet …»;
  ein zweiter Klick löst KEINEN zweiten fetch aus (genau 1 Aufruf) ·
  F-29 Antwort 200 → Formular unsichtbar, Danke-Text sichtbar ·
  F-30 Netzfehler → Hinweis enthält Telefonnummer und E-Mail aus der
  Konfiguration, jedes Feld behält seinen Wert, Button wieder frei · dasselbe bei 500.
- Honeypot: Das Feld `website` wird mitgesendet und ist nicht sichtbar.
