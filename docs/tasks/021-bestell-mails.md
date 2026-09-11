---
id: 021
title: "Bestell-E-Mails an Lädeli und Besteller schreiben"
depends_on: [010, 018]
features: [GS-32, GS-33]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/bestell-mails.test.ts"
human_review: true
class: open
---

# Kontext
Brief: Daten per E-Mail an laedeli@ssbl.ch, Bestätigungs-E-Mail an den
Besteller. Auftraggeber: Bestätigung = Eingang + Übersicht + Rückmeldung innert
2 Arbeitstagen, noch nicht verbindlich (decisions.md).

# Umfang
- `src/sites/geschenkshop-ssbl/mails.ts`: `baueMails(daten, produkte, site)`
  → [Mail an formular.empfaenger, Bestätigung an daten.email], als Text
  (optional zusätzlich einfaches HTML).
- Mail an das Lädeli: Betreff «Neue Bestellung: <Vorname> <Name>»; Antworten
  gehen an den Besteller (Reply-To); Inhalt: jedes bestellte Produkt mit Menge
  und Einzelpreis · Summe der Produkte (ohne Versand) · Name · Vorname ·
  E-Mail · Telefon · Lieferung oder Abholung · Adresse (nur bei Lieferung) ·
  Zahlungsart · Altersbestätigung (nur bei Wein) · Eingangszeit (Zürcher Zeit).
- Bestätigung: Betreff mit «Bestellung» und «eingegangen»; Sie-Form; Eingang
  bestätigt · dieselbe Übersicht · «Das Lädeli meldet sich innert
  2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen» · «Ihre
  Bestellung wird erst mit dieser Rückmeldung verbindlich» · Kontakt laedeli@ssbl.ch.
- `src/sites/geschenkshop-ssbl/empfaenger.ts`: verbindet verarbeiteEinsendung
  (010) mit pruefeBestellung (018), baueMails und formular.schluss.
- Zeilenumbrüche in Namen dürfen nicht in den Betreff gelangen.

# Nicht Teil dieser Aufgabe
- Anschluss an Hosting und Mailserver (027, blockiert).
- Zahlungslinks erzeugen (macht das Lädeli selbst).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/bestell-mails.test.ts` prüft für GS-32, dass die Lädeli-Mail an
  laedeli@ssbl.ch geht und JEDES dieser Teile einzeln enthält: Produktname +
  Menge (für jedes bestellte Produkt) · Einzelpreis · Summe · Name · Vorname ·
  E-Mail · Telefon · «Lieferung» bzw. «Abholung» · Strasse, PLZ, Ort bei
  Lieferung (und NICHT bei Abholung) · Zahlungsart · Altersbestätigung bei Wein
  (und NICHT ohne Wein).
- Für GS-33: Bestätigung geht an die E-Mail des Bestellers und enthält
  «eingegangen», jedes bestellte Produkt mit Menge, «2 Arbeitstagen», «verbindlich».
- Name «Muster\nBcc: x@y.ch» ergibt einen einzeiligen Betreff.
- Menschliche Prüfung: Wortlaut beider Mails (Beispiel-Ausgabe im Handoff).
