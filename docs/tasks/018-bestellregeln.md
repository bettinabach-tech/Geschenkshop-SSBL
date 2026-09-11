---
id: 018
title: "Bestellregeln für Browser und Server festlegen"
depends_on: [012]
features: []
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/bestellregeln.test.ts"
human_review: false
class: mechanical
---

# Kontext
Dieselben Regeln prüfen die Bestellung im Browser (019/020, Hinweis am Feld)
und auf dem Server (021) — eine Stelle, keine Abweichungen. Grundlage:
Brief (Pflichtfelder) und Auftraggeber-Entscheide (mehrere Produkte mit Menge,
nur Schweiz, Wein ab 16).

# Umfang
- `src/sites/geschenkshop-ssbl/bestellregeln.ts`, reine Funktion
  `pruefeBestellung(daten, produkte) → { fehler: Record<feld, meldung> }`
  plus `bereinige(daten)` (Leerzeichen trimmen, Adresse bei Abholung entfernen).
- Regeln, jede mit eigener deutscher Meldung in Sie-Form:
  1. `mengen`: je Produkt-id eine ganze Zahl ≥ 0; unbekannte id → Fehler.
  2. mindestens eine Menge ≥ 1 → sonst Fehler an `mengen`.
  3. Menge > stueck → Fehler an `menge-<id>`.
  4. Menge ≥ 1 bei stueck 0, fehlendem preis oder fehlender stueck → Fehler.
  5. `name` Pflicht (1–100 Zeichen nach trim). 6. `vorname` Pflicht (1–100).
  7. `email` Pflicht, Format. 8. `telefon` Pflicht, mind. 9 Ziffern, nur
     Ziffern, Leerzeichen, +, -, /, ( ).
  9. `weg` ∈ {lieferung, abholung}.
  10. bei lieferung: `strasse` Pflicht · `plz` genau 4 Ziffern · `ort` Pflicht.
  11. bei abholung: strasse/plz/ort nicht Pflicht.
  12. `zahlung` ∈ {twint, karte}.
  13. Menge ≥ 1 bei einem Produkt mit wein: true → `alter16` muss true sein.

# Nicht Teil dieser Aufgabe
- Formular-Oberfläche (019, 020), Mails (021).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/bestellregeln.test.ts` hat mindestens einen Fall pro Regel 1–13, dazu:
  gültige Abholung ohne Adresse → keine Fehler · gültige Lieferung → keine
  Fehler · plz «600» und «60000» und «6O20» → Fehler · Wein mit Menge 1 ohne
  alter16 → Fehler an `alter16` · Wein mit Menge 0 ohne alter16 → kein Fehler.
- Die Funktion greift nicht auf DOM, Netz oder Uhr zu (läuft in Browser und Server).
