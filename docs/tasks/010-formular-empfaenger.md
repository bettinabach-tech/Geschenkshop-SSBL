---
id: 010
title: "Formular-Empfänger mit Mailversand bauen"
depends_on: []
features: []
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/empfaenger.test.ts"
human_review: false
class: patterned
---

# Kontext
Die Einsendung eines Formulars wird geprüft und per E-Mail weitergeleitet,
nicht gespeichert (decisions.md: «Bestellungen per E-Mail, austauschbar»).
Den Anbieter bestimmt die SSBL-IT; deshalb ist der Empfänger ein
anbieterneutrales Programmstück, der Anschluss an den Anbieter folgt in 027.

# Umfang
- `src/server/empfaenger.ts`: `verarbeiteEinsendung(anfrage, abh)` mit
  anfrage = {methode, body} und abh = {pruefe, baueMails, schluss?, jetzt,
  versand}. Gibt {status, json} zurück, ohne Seiteneffekte ausser `versand`.
- Regeln in dieser Reihenfolge: Methode ≠ POST → 405 · kein gültiges JSON oder
  > 20 KB → 400 · Feld `website` gefüllt → 200 {ok:true}, KEINE Mail ·
  jetzt ≥ schluss → 410 {fehler:{_formular: <Text aus baueMails/Konfiguration>}} ·
  pruefe meldet Fehler → 400 {fehler} · Mail 1 (an den Empfänger) scheitert →
  502 {fehler:{_formular}}, Mail 2 wird NICHT versucht · Mail 2 (Bestätigung)
  scheitert → trotzdem 200 (die Bestellung ist beim Empfänger), Fehler wird
  protokolliert · sonst 200 {ok:true}.
- `src/server/smtp.ts`: Versand über SMTP (nodemailer) aus den Variablen in
  `.env.example`; fehlen Variablen, nennt die Meldung deren NAMEN, nie Werte.
- `.env.example` bei Bedarf ergänzen — jede Variable mit Herkunfts-Kommentar.

# Nicht Teil dieser Aufgabe
- Anschluss an einen Hosting-Anbieter (027, blockiert).
- Inhalt der Bestell-Mails (021), Bestellregeln (018).
- Daten speichern — ausdrücklich nicht.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/empfaenger.test.ts` mit Fake-Versand und Fake-Uhr prüft jede Regel
  oben als eigenen Fall, inklusive der Grenze: jetzt = schluss − 1 ms → 200,
  jetzt = schluss → 410. Wird die Zeitgrenze wackelig, die Uhr fixieren —
  NIE die Erwartung lockern.
- Im Honeypot-Fall ruft der Test `versand` exakt 0-mal auf; im Erfolgsfall exakt
  2-mal (Empfänger zuerst).
- smtp.ts: Fehlende Variablen → Fehlermeldung enthält «SMTP_HOST» usw., aber
  keinen Wert aus der Umgebung.
- Kein Code liest oder zitiert `.env` direkt; nur `process.env`.
