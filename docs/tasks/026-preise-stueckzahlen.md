---
id: 026
title: "Echte Preise und Stückzahlen eintragen"
depends_on: [016]
features: [GS-09, GS-10]
status: blocked
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/produkte-echt.test.ts"
human_review: true
class: open
---

# Kontext
BLOCKIERT — wartet auf den Auftraggeber: Preis in CHF und verfügbare Stückzahl
für jedes der 5 Produkte (Brief: Pflichtfakten, «kommt später»). Danach
`status: todo` setzen.

# Umfang
- Preis und Stückzahl in produkte.yaml eintragen, genau wie geliefert.
- Im Handoff kurz erklären, wie das Lädeli die Stückzahl künftig selbst auf
  GitHub ändert (Verweis auf den Kommentar oben in produkte.yaml).

# Nicht Teil dieser Aufgabe
- Preise runden, schätzen oder «schön machen».
- Versandkosten (Brief: nicht auf der Seite).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/produkte-echt.test.ts` prüft mit der echten produkte.yaml für jedes
  der 5 Produkte einzeln: GS-09 preis > 0 und die Karte zeigt «CHF » + Preis
  mit 2 Nachkommastellen · GS-10 stueck ist ganze Zahl ≥ 0 und die Karte zeigt
  «Noch N Stück verfügbar» bzw. «ausverkauft» · kein «Preis folgt» mehr.
- Menschliche Prüfung: Preise und Stückzahlen auf der Seite gegen die Lieferung.
