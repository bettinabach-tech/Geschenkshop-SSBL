---
id: 012
title: "Produktliste als bearbeitbare Datei mit Prüfung anlegen"
depends_on: [001]
features: []
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/produkte.test.ts"
human_review: false
class: patterned
---

# Kontext
Auftraggeber-Entscheid: Die Stückzahl wird von Hand nachgeführt, im Browser auf
GitHub (decisions.md: «Produktliste als einfache Textdatei»). Preis und
Stückzahl liefert der Auftraggeber später (026) — bis dahin dürfen sie fehlen.

# Umfang
- `src/sites/geschenkshop-ssbl/produkte.yaml` mit den 5 Produkten:
  ids keramik-pflanzenstecker-kraeuter, anzuendholz-buendel,
  keramik-schalen-set, klosterwein-divico, klosterwein-souvignier-gris;
  Namen wie in features.md GS-07; `foto` = passende Datei in assets/products/;
  `alt` (sachlich beschreibend); `wein: true` nur bei den zwei Weinen.
  `beschreibung`, `preis`, `stueck` bleiben leer.
- Kommentar oben in der Datei, in Alltagssprache: wie man auf GitHub die
  Stückzahl ändert (Stift-Symbol, Zahl ändern, «Commit changes»), dass `0`
  «ausverkauft» bedeutet und Preise mit Punkt geschrieben werden (24.50).
- `src/sites/geschenkshop-ssbl/produkte.ts`: lesen (Paket `yaml`) und prüfen
  (astro/zod); ein Fehler bricht den Build mit einer Meldung ab, die Produkt
  und Feld nennt.

# Nicht Teil dieser Aufgabe
- Beschreibungen texten (014), echte Preise/Stückzahlen (026).
- Anzeige auf der Seite (016).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/produkte.test.ts` prüft: die echte Datei lädt · genau 5 Produkte mit
  exakt den 5 ids oben · `wein` ist genau bei klosterwein-divico und
  klosterwein-souvignier-gris true · jedes `foto` existiert.
- Das Schema lehnt jede dieser Eingaben einzeln ab: preis 0 · preis -5 ·
  preis «zwölf» · preis 24.555 · stueck 2.5 · stueck -1 · foto zeigt auf eine
  fehlende Datei · doppelte id · fehlender alt · fehlender name.
- Das Schema akzeptiert: preis 24.5, stueck 0, fehlender preis, fehlende stueck.
