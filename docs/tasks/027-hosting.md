---
id: 027
title: "Hosting und Mailversand beim Anbieter der SSBL-IT anschliessen"
depends_on: [010, 021]
features: []
status: blocked
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/hosting-adapter.test.ts"
human_review: false
class: open
---

# Kontext
BLOCKIERT — wartet auf die SSBL-IT (Auftraggeber-Entscheid «Vorgabe der
SSBL-IT»): (1) welcher Anbieter die Seite und den Empfänger betreibt,
(2) Zugang zu einem Mailserver (SMTP) mit Absender laedeli@ssbl.ch oder einer
freigegebenen Adresse. Danach `status: todo` setzen.

# Umfang
- ZUERST in decisions.md: gewählter Anbieter, Kosten pro Monat, wo die
  Bestelldaten durchlaufen (Land), Folge für die Datenschutzerklärung.
- Dünne Anschlussdatei für den Anbieter, die Anfragen an
  verarbeiteEinsendung (010/021) weiterreicht.
- Einstellungen beim Anbieter: Build-Befehl, Ausgabeordner, Umleitung der
  Adresse auf /geschenkshop-ssbl/, 404-Seite (011), automatisches
  Veröffentlichen bei jedem Push.
- Die SMTP-Werte trägt die IT oder der Auftraggeber selbst beim Anbieter ein —
  der Agent sieht und notiert sie nie. `.env.example` ergänzen, falls nötig.
- `formular.endpunkt` in site.ts setzen.

# Nicht Teil dieser Aufgabe
- Die Adresse geschenke.ssbl.ch (028).
- Bestelldaten speichern oder Datenbanken.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/hosting-adapter.test.ts`: die Anschlussdatei übersetzt eine
  Anbieter-Anfrage korrekt (Methode, Body) und gibt Status und JSON unverändert
  zurück — je ein Fall für 200, 400, 410, 502.
- Rauchtest durch den Auftraggeber (im Handoff anleiten): eine Testbestellung
  auf der Vorschau-Adresse kommt bei laedeli@ssbl.ch an, und die Bestätigung
  erreicht die angegebene Adresse.
