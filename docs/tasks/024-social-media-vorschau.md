---
id: 024
title: "Social-Media-Vorschau für den Geschenkshop erstellen"
depends_on: [015]
features: [GS-39]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/vorschau.test.ts"
human_review: true
class: open
---

# Kontext
Die Besucher kommen aus Social Media (Brief). Beim Teilen soll ein Produktfoto
mit passendem Titel erscheinen. Das Grundlayout (002) setzt og:image nur, wenn
`adresse` bekannt ist — die kommt mit 028; bis dahin prüft der Test mit einer
Fixture-Adresse, und der Live-Gang-Check (013) verlangt die echte.

# Umfang
- Vorschaubild 1200 × 630 px (JPG, ≤ 300 KB), beim Bauen aus einem echten
  Produktfoto erzeugt (Auswahl mit dem Auftraggeber abstimmen).
- og:title und og:description für den Geschenkshop (dürfen vom `<title>`
  abweichen), og:image:alt.

# Nicht Teil dieser Aufgabe
- Social-Media-Beiträge oder Anzeigen texten.
- Tracking-Pixel von Facebook/Instagram (Brief: kein Tracking).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/vorschau.test.ts` prüft einzeln: GS-39 og:image ist absolute
  https-URL (Fixture-Adresse) · Bild 1200 × 630 · ≤ 300 KB · og:image:alt nicht
  leer · og:title enthält «Geschenk» · kein Meta-Tag eines Tracking-Dienstes.
- Menschliche Prüfung: Bildausschnitt und Titel.
