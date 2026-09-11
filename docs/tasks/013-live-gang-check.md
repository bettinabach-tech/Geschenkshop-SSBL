---
id: 013
title: "Live-Gang-Check für fehlende Inhalte bauen"
depends_on: [001, 012]
features: []
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/golive.test.ts"
human_review: false
class: mechanical
---

# Kontext
Einige Inhalte dürfen während des Baus fehlen (Preise, Telefonnummer,
Rechts-URLs, Geschichte). Vor dem Live-Gang muss aber alles da sein. Der Check
läuft bewusst NICHT in verify.sh, sonst wäre jeder Commit bis zur Lieferung
aller Inhalte blockiert.

# Umfang
- `scripts/check-golive.mjs` + Befehl `npm run check:golive -- <slug>`
  (in package.json und CLAUDE.md eintragen).
- Allgemein je Seite: kontakt.telefon · rechtliches.impressumUrl ·
  rechtliches.datenschutzUrl · formular.endpunkt · adresse.
- Seiten-Haken: exportiert `src/sites/<slug>/golive.ts` eine Funktion, liefert
  sie weitere Mängel. Für geschenkshop-ssbl: jedes Produkt hat beschreibung,
  preis und stueck · die Geschichte (025) ist eingebaut (Merker in site.ts).
- Ausgabe: eine Zeile pro Mangel in Alltagssprache, z.B.
  «Preis fehlt: Keramik-Schalen-Set». Exit 1, solange etwas fehlt.

# Nicht Teil dieser Aufgabe
- Die fehlenden Inhalte selbst beschaffen oder eintragen.
- Aufnahme in verify.sh.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/golive.test.ts` prüft: vollständige Fixture → Exit 0 · je ein Fall pro
  Pflichtangabe oben (5 allgemeine + beschreibung + preis + stueck +
  Geschichte), jeweils Exit 1 und die passende Zeile · zwei fehlende Preise →
  zwei Zeilen, je mit Produktname.
- Für die echte Geschenkshop-Seite meldet der Check heute Mängel (Exit 1) — das
  ist richtig und im Handoff zu erwähnen.
