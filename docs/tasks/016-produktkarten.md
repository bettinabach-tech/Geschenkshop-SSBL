---
id: 016
title: "Produktkarten im Kauf-Bereich anzeigen"
depends_on: [012, 015]
features: [GS-07, GS-11, GS-12]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/produktkarten.test.ts"
human_review: true
class: open
---

# Kontext
Auftraggeber-Entscheide: Stückzahl wird angezeigt · Ausverkauftes bleibt
sichtbar mit «ausverkauft» · Wein erst ab 16 (decisions.md). Solange Preis
oder Stückzahl fehlen (bis 026), ist ein Produkt «Preis folgt» und nicht
bestellbar — keine erfundenen Werte.

# Umfang
- `src/sites/geschenkshop-ssbl/Produktkarten.astro` im Kauf-Bereich der Seite.
- Pro Karte: Foto (Bild.astro, alt aus produkte.yaml), Name als h3,
  Beschreibung (falls vorhanden), Preis «CHF 24.50» bzw. «Preis folgt»,
  Stückzahl «Noch 12 Stück verfügbar» / «Noch 1 Stück verfügbar», bei 0
  «ausverkauft», bei Wein «Abgabe ab 16 Jahren».
- Farben nur aus der Skill (Primärfarbe nicht für «ausverkauft»).
- Stile in `src/styles/produkte.css`.

# Nicht Teil dieser Aufgabe
- Mengenfelder und Bestellung (019). Echte Preise/Stückzahlen (026).
- Texte der Beschreibungen (014).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/produktkarten.test.ts` prüft einzeln: GS-07 mit der echten
  produkte.yaml erscheinen alle 5 Namen exakt wie in features.md ·
  Preis 24.5 → «CHF 24.50» · Preis 7 → «CHF 7.00» · ohne Preis → «Preis folgt» ·
  stueck 12 → «Noch 12 Stück verfügbar» · stueck 1 → «Noch 1 Stück verfügbar» ·
  GS-11 stueck 0 → «ausverkauft», Karte weiterhin gerendert ·
  GS-12 wein: true → «Abgabe ab 16 Jahren», wein: false → Text fehlt ·
  jede Karte hat ein `<img>` mit nicht-leerem alt.
- Menschliche Prüfung: Kartenbild im Browser, Handy und Desktop.
