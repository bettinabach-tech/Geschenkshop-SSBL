---
id: 004
title: "Browser-Prüfungen für verify --deep einrichten"
depends_on: []
features: []
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "./scripts/verify.sh --deep"
human_review: false
class: patterned
---

# Kontext
technik.md: Lighthouse und Audits nur in `--deep`. Heute ist
`scripts/check-browser.sh` ein Platzhalter, der absichtlich RED meldet.
Die Features F-01, F-22 und F-23 werden erst in 029 auf der echten Seite abgenommen.

# Umfang
- `scripts/check-browser.sh` ersetzen: `dist/` lokal ausliefern, dann für jede
  HTML-Seite in dist/ (ausser der internen Übersicht dist/index.html):
  1. Breite 375 px: `scrollWidth` ≤ 375 (F-01).
  2. Tab-Durchlauf: jedes fokussierbare Element erreichbar, mit sichtbarem
     Fokus (outline-width > 0 oder box-shadow ≠ none) (F-23).
  3. axe-core: keine Verstösse der Stufe serious oder critical.
  4. Lighthouse (mobil): Performance, Accessibility, Best Practices, SEO je ≥ 90 (F-22).
  5. Externe Links (http/https) antworten mit Status < 400.
- Browser-Tests unter `tests/browser/*.spec.ts` (Endung .spec, damit Vitest sie
  nicht ausführt); sie nennen die Feature-IDs im Testnamen.
- Wenn möglich den installierten Edge/Chrome nutzen statt einen Browser
  herunterzuladen; die Wahl in decisions.md festhalten.

# Nicht Teil dieser Aufgabe
- Features auf PASSING setzen (029).
- Probleme auf Seiten beheben, die die Prüfung findet — nur melden.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- Die Lighthouse-Schwelle ist exakt 90 je Kategorie und darf NIE gesenkt
  werden. Ist ein Wert wackelig, die Messung stabilisieren (z.B. Median aus
  3 Läufen), nicht die Schwelle.
- Selbsttest: Eine Fixture-Seite mit einem 500 px breiten Element lässt die
  375-px-Prüfung scheitern; eine Fixture ohne Fokusrahmen lässt die
  Fokus-Prüfung scheitern. Beide Selbsttests laufen in --deep mit.
- `./scripts/verify.sh --deep` endet auf dem aktuellen Stand mit verify: GREEN
  und dauert ≤ 5 Minuten.
