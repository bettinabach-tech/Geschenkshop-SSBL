---
id: 015
title: "Geschenkshop-Seite mit Hero, Nutzen und SSBL-Fakten zusammensetzen"
depends_on: [007, 008]
features: [GS-01, GS-02, GS-03, GS-04, GS-05, GS-13]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/geschenkshop-seite.test.ts"
human_review: true
class: open
---

# Kontext
Brief docs/briefs/geschenkshop-ssbl.md: Zielgruppe Privatpersonen auf der Suche
nach sinnvollen Weihnachtsgeschenken, Besucher aus Social Media, Überschrift
eigenständig. Skill `fabrik-design` gilt (Aufbau, Tonalität, keine erfundenen
Zitate). Die Geschichte hinter den Produkten kommt später (025, blockiert).

# Umfang
- `src/pages/geschenkshop-ssbl/index.astro` auf Landingpage.astro (007) umbauen.
- Hero: Überschrift ≤ 8 Wörter, Unterzeile 1 Satz, KaufButton «Jetzt
  bestellen» (Wortlaut darf der Auftraggeber ändern) auf #bestellen, ein
  Produktfoto über Bild.astro (008), Zeile «Bestellschluss 15.12.2026 ·
  Lieferzeit ca. eine Woche».
- Nutzen: genau die 3 Punkte aus dem Brief, je ≤ 2 Sätze.
- Vertrauen: die SSBL-Fakten aus dem Brief (Hauptsitz Rathausen (Emmen) und
  neun weitere Standorte · bis zu 305 Wohnplätze · 80 Arbeitsplätze für
  Tagesbeschäftigte). Bild vorläufig ein echtes Produktfoto, bis 025 das
  Werkstattfoto bringt.
- Kauf-Bereich: vorerst nur Überschrift (Inhalte folgen in 016–020).
- titel und beschreibung in site.ts endgültig formulieren.

# Nicht Teil dieser Aufgabe
- Produktkarten (016), Hinweise zu Abholung/Zahlung (017), Formular (019).
- Die Geschichte der Menschen und Werkstätten (025).
- Erfundene Zahlen, Zitate oder Personen — verboten.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/geschenkshop-seite.test.ts` prüft einzeln: GS-01 Überschrift ≤ 8 Wörter,
  Unterzeile enthält «SSBL» · GS-02 Hero enthält ein `<img>` aus
  assets/products/ mit alt · GS-03 KaufButton im Hero zeigt auf #bestellen und
  die Seite hat ein Element mit id="bestellen" · GS-04 genau 3 Nutzen-Punkte ·
  GS-05 Vertrauen enthält «Rathausen», «neun weitere Standorte», «305» und «80» ·
  GS-13 Hero enthält «15.12.2026» und «eine Woche».
- Menschliche Prüfung: alle Texte (Überschrift, Unterzeile, Nutzen, Fakten) im
  Browser, auch bei 375 px Breite.
