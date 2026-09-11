---
id: 029
title: "Browser-Abnahme: Handy, Tastatur, Lighthouse"
depends_on: [004, 015, 020]
features: [F-01, F-22, F-23]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "./scripts/verify.sh --deep"
human_review: false
class: patterned
---

# Kontext
Die Browser-Prüfungen aus 004 laufen jetzt auf der echten Geschenkshop-Seite
mit Formular. Befunde werden an der Ursache behoben — in den Fabrik-Bausteinen,
damit jede künftige Seite profitiert.

# Umfang
- `./scripts/verify.sh --deep` ausführen, jeden Befund beheben.
- F-01, F-22, F-23 auf PASSING setzen, sobald --deep GREEN ist.

# Nicht Teil dieser Aufgabe
- Neue Funktionen oder Texte.
- Schwellen der Prüfungen ändern (Lighthouse bleibt 90, Breite bleibt 375 px).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- Die Browser-Tests aus 004 nennen F-01, F-22 und F-23 und laufen gegen
  dist/geschenkshop-ssbl/index.html: F-01 scrollWidth ≤ 375 · F-23 jedes
  Mengenfeld, Formularfeld, Radio, Häkchen, Link und Button per Tab erreichbar,
  mit sichtbarem Fokus · F-22 alle 4 Lighthouse-Werte ≥ 90 (mobil).
- Ein Befund wird NIE durch Ausnahmen in der Prüfung «gelöst», sondern an der Seite.
