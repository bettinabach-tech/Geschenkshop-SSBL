---
id: 025
title: "Geschichte der Menschen und Werkstätten einbauen"
depends_on: [015]
features: [GS-06]
status: blocked
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/geschichte.test.ts"
human_review: true
class: open
---

# Kontext
BLOCKIERT — wartet auf den Auftraggeber: 3–5 Sätze über die Werkstätten und
Menschen der SSBL hinter den Produkten und ein echtes Foto, mit Einverständnis
der abgebildeten Person(en) (Auftraggeber-Entscheid «Eine gemeinsame
Geschichte»). Danach `status: todo` setzen.
Skill `fabrik-design`: nie erfundene Zitate, nie Platzhalter.

# Umfang
- Text und Foto im Vertrauens-Abschnitt; das vorläufige Produktfoto aus 015
  wird ersetzt. Die SSBL-Fakten (GS-05) bleiben.
- Foto nach assets/ legen, Einbindung über Bild.astro (008) mit Alt-Text.
- Den Merker «Geschichte eingebaut» in site.ts setzen (für 013).

# Nicht Teil dieser Aufgabe
- Geschichten pro Produkt (Auftraggeber: eine gemeinsame).
- Text umschreiben, bis er «besser klingt» — Fakten bleiben wie geliefert,
  nur sprachlich glätten und vom Auftraggeber freigeben lassen.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/geschichte.test.ts` prüft: GS-06 Vertrauens-Abschnitt enthält den
  gelieferten Text (mind. 3 Sätze) · `<img>` mit dem neuen Foto (nicht aus
  assets/products/) und nicht-leerem alt · GS-05-Fakten weiterhin vorhanden.
- Im Handoff steht, wer das Einverständnis zum Foto gegeben hat (Rolle, kein Name).
