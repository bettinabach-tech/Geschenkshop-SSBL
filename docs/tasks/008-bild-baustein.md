---
id: 008
title: "Bild-Baustein mit automatischer Verkleinerung bauen"
depends_on: []
features: [F-20, F-21]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/bild.test.ts"
human_review: false
class: patterned
---

# Kontext
Die Produktfotos in assets/products/ sind 3–8 MB gross. Sie bleiben als
Originale liegen; beim Bauen entstehen verkleinerte Fassungen
(decisions.md: «Fotos automatisch verkleinern»). Skill: immer Alt-Text.

# Umfang
- `src/components/Bild.astro` auf Basis von `astro:assets` (`<Picture>`):
  Formate avif + webp, Breiten 400/800/1200, `sizes` als Prop, Pflicht-Prop `alt`.
  Bilder aus `assets/` über import.meta.glob einbinden.
- `scripts/check-bilder.mjs` + neue verify-Stufe «bilder» direkt nach «build»:
  Jede Bilddatei, die in einem srcset mit Breite ≤ 800w vorkommt, ist ≤ 300 KB;
  keine Datei in dist/ ist grösser als 1 MB.

# Nicht Teil dieser Aufgabe
- Bilder auf einer Seite platzieren (015, 016).
- Social-Media-Bild (024).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/bild.test.ts` prüft einzeln: F-20 fehlendes alt wirft · alt nur aus
  Leerzeichen wirft · das gerenderte `<img>` trägt den alt-Text ·
  F-21 die Ausgabe enthält avif und webp und die Breiten 400/800/1200 ·
  check-bilder.mjs meldet eine 301-KB-Datei in einem 800w-srcset (Fixture) als
  Fehler und eine 299-KB-Datei nicht · meldet eine 1.1-MB-Datei in dist als Fehler.
- `./scripts/verify.sh` zeigt «ok: bilder».
