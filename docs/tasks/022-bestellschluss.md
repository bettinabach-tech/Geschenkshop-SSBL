---
id: 022
title: "Bestellschluss automatisch umsetzen"
depends_on: [019, 021]
features: [GS-36, GS-37]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/bestellschluss.test.ts"
human_review: true
class: open
---

# Kontext
Auftraggeber-Entscheide: Ab 16.12.2026 verschwindet das Formular von selbst,
ein Hinweis erscheint, Produkte bleiben sichtbar · nach Weihnachten bleibt die
Seite so stehen (decisions.md). formular.schluss = 2026-12-16T00:00:00+01:00 (001).

# Umfang
- Im Formular-Baustein (Fabrik, allgemein über formular.schluss): beim Laden
  der Seite und beim Bauen prüfen, ob der Schluss erreicht ist → Formular und
  Mengenfelder ausblenden, Hinweistext zeigen (Vorschlag: «Der Bestellschluss
  war am 15.12.2026. Herzlichen Dank für Ihr Interesse!»).
- Antwort 410 vom Empfänger → Hinweis «Bestellschluss vorbei» oben am
  Formular, keine Danke-Meldung.

# Nicht Teil dieser Aufgabe
- Weiterleitung oder Abschalten nach Weihnachten (Auftraggeber: bleibt stehen).
- Warteliste.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/bestellschluss.test.ts` mit Fake-Uhr prüft einzeln: GS-36
  15.12.2026 23:59:59 Zürcher Zeit → Formular sichtbar · 16.12.2026 00:00:00
  Zürcher Zeit → Formular und Mengenfelder unsichtbar, Hinweistext sichtbar,
  alle 5 Produktkarten weiterhin sichtbar · 20.01.2027 → wie 16.12. ·
  GS-37 Formular geöffnet vor Schluss, Antwort 410 → «Bestellschluss vorbei»
  sichtbar, keine Danke-Meldung · der Server-Weg (empfaenger.ts aus 021) liefert
  bei jetzt = 16.12.2026 00:00:00 Zürcher Zeit Status 410.
- Die Zeitgrenzen sind exakt; wird ein Test wackelig, die Uhr fixieren — NIE
  die Grenze verschieben.
- Menschliche Prüfung: Hinweistext.
