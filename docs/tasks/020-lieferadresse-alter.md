---
id: 020
title: "Lieferadresse und Altersbestätigung ins Bestellformular einbauen"
depends_on: [019]
features: [GS-24, GS-25, GS-26, GS-27, GS-28, GS-30]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/bestellformular-bedingt.test.ts"
human_review: true
class: open
---

# Kontext
Brief: Adresse nur Pflicht bei Lieferung. Auftraggeber: Lieferung nur Schweiz
(PLZ 4-stellig) · Häkchen «mind. 16» nur, wenn Wein gewählt ist (decisions.md).

# Umfang
- Adressbereich (Strasse und Nr. · PLZ · Ort) mit Hinweis «Lieferung nur
  innerhalb der Schweiz»; sichtbar und Pflicht nur bei «Lieferung». Beim
  Wechsel auf «Abholung» ausblenden, Hinweise entfernen, nicht mitsenden.
- Häkchen «Ich bin mindestens 16 Jahre alt» (Feld `alter16`): sichtbar und
  Pflicht, sobald ein Wein eine Menge ≥ 1 hat; sonst ausgeblendet.
- Seitenlogik in `src/sites/geschenkshop-ssbl/bestellformular.ts`.

# Nicht Teil dieser Aufgabe
- Lieferung ins Ausland (Auftraggeber: nur Schweiz). Versandkosten.
- Ausweiskontrolle (macht das Lädeli bei der Übergabe).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/bestellformular-bedingt.test.ts` (happy-dom) prüft einzeln:
  GS-24 Start und «Abholung» → Adressbereich unsichtbar, kein Hinweis beim
  Absenden · «Lieferung» → sichtbar · zurück auf «Abholung» → unsichtbar und
  strasse/plz/ort fehlen im gesendeten JSON · GS-25 Lieferung ohne Strasse →
  Hinweis · GS-26 PLZ leer, «600», «60000» → je Hinweis, «6020» → keiner ·
  GS-27 Ort leer → Hinweis · GS-28 Text «Lieferung nur innerhalb der Schweiz»
  im Adressbereich · GS-30 Wein-Menge 1 → Häkchen sichtbar, ohne Haken Hinweis
  und kein fetch · Wein-Menge zurück auf 0 → Häkchen unsichtbar · nur
  Nicht-Wein bestellt → Häkchen nie sichtbar.
