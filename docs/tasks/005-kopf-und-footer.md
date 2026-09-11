---
id: 005
title: "Kopf mit Logo und Footer bauen"
depends_on: [002]
features: [F-07, F-19]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/kopf-footer.test.ts"
human_review: true
class: open
---

# Kontext
Skill `fabrik-design`: Logo mind. 32 px hoch, Schutzzone = halbe Logohöhe,
nie verzerren. Footer mit Impressum, Datenschutz, Kontakt — alles Textlinks,
nie Buttons. Die Werte kommen aus der Site-Konfiguration (001).

# Umfang
- `src/components/Kopf.astro`: Logo (`logo`, `logoAlt` aus der Konfiguration),
  Höhe 40 px, Breite automatisch, Innenabstand ≥ halbe Logohöhe.
- `src/components/Footer.astro`: Links «Impressum» (impressumUrl),
  «Datenschutz» (datenschutzUrl), «Kontakt» (mailto: kontakt.email) und, falls
  gesetzt, die Telefonnummer als tel:-Link. Fehlt eine URL (vor dem Live-Gang),
  wird der Link weggelassen — 013 meldet das.
- Stile in `src/styles/kopf-footer.css`.

# Nicht Teil dieser Aufgabe
- Echte URLs und Telefonnummer des Geschenkshops (023, blockiert).
- Navigation oder Menü (nicht verlangt).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/kopf-footer.test.ts` (Fixture mit allen Feldern) prüft einzeln:
  F-07 `<img>` im Kopf mit src = logo und nicht-leerem alt · CSS setzt
  height ≥ 32px und width auto (keine feste Breite) · Innenabstand ≥ halbe Höhe ·
  F-19 Link «Impressum» → impressumUrl · Link «Datenschutz» → datenschutzUrl ·
  Link «Kontakt» → mailto:<kontakt.email> · tel:-Link bei gesetzter Nummer ·
  kein Footer-Link trägt eine Button-Klasse.
- Fixture ohne impressumUrl: kein Impressum-Link, kein leeres href.
