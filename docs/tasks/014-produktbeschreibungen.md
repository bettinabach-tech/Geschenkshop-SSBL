---
id: 014
title: "Produktbeschreibungen texten"
depends_on: [016]
features: [GS-08]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/produkttexte.test.ts"
human_review: true
class: open
---

# Kontext
Brief: «Texte: Agent soll Vorschlag machen». Einwand aus dem Brief: «wirkt es
nach Wohltätigkeit?» — die Beschreibungen sollen Qualität zeigen. Keine
erfundenen Fakten (Skill `fabrik-design`, Tonalität Sie, warm, keine
unbelegten Superlative).

# Umfang
- ZUERST den Auftraggeber fragen (Business-Frage): pro Produkt 1–2 echte Fakten
  (z.B. Material, wer es herstellt, Traubensorte, Jahrgang, Inhalt/Menge).
  Ohne Antwort nur beschreiben, was auf dem Foto sichtbar ist.
- Pro Produkt eine `beschreibung` in produkte.yaml, 1–2 Sätze. Die Karten
  aus 016 zeigen sie an (deshalb hängt diese Aufgabe von 016 ab).

# Nicht Teil dieser Aufgabe
- Preise, Stückzahlen (026). Anzeige der Karten (016).
- Texte anderer Abschnitte.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/produkttexte.test.ts` (nennt GS-08) prüft für jedes der 5 Produkte:
  beschreibung vorhanden · 20–200 Zeichen · höchstens 2 Sätze · enthält keines
  der Wörter «beste», «einzigartig», «unvergleichlich», «perfekt», «du», «dein» ·
  die gerenderten Produktkarten (016) enthalten jede der 5 Beschreibungen
  (GS-08: Foto, Name und Beschreibung pro Karte).
- Menschliche Prüfung: Jeder genannte Fakt stammt vom Auftraggeber.
