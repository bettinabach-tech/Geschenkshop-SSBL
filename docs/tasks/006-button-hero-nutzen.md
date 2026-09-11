---
id: 006
title: "Button, Abschnitts-Rahmen, Hero und Nutzen bauen"
depends_on: [002]
features: [F-11, F-12, F-16, F-17, F-18]
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/abschnitte-oben.test.ts"
human_review: true
class: open
---

# Kontext
Skill `fabrik-design`, «Aufbau einer Seite» Punkte 1–2 und «Abstände & Grössen».
Die Regeln (max. 8 Wörter, 1 Satz, max. 3 Punkte) erzwingt der Baustein
selbst, damit keine Seite sie aus Versehen bricht.

# Umfang
- `src/components/KaufButton.astro`: Link mit Klasse `kauf-button`,
  Hintergrund --farbe-primaer, weisse Schrift, sichtbarer Fokusrahmen.
- `src/components/Abschnitt.astro`: `<section data-abschnitt="…">`, Inhalt
  max. 65ch breit, Abstand 64 px (Handy) / 96 px (ab 768 px).
- `src/components/Hero.astro`: Props ueberschrift, unterzeile, ctaText, ctaHref;
  Slot `bild`. Wirft bei > 8 Wörtern oder mehr als einem Satz.
- `src/components/Nutzen.astro`: Prop punkte (titel, text); wirft bei > 3
  Punkten oder einem Text mit > 2 Sätzen.
- Stile in `src/styles/abschnitte.css`.

# Nicht Teil dieser Aufgabe
- Vertrauen, Kauf-Bereich, Reihenfolge (007). Texte des Geschenkshops (015).
- Bild-Optimierung (008) — der Hero nimmt das Bild nur als Slot entgegen.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/abschnitte-oben.test.ts` prüft einzeln:
  F-11 Überschrift mit 8 Wörtern rendert, mit 9 wirft · Unterzeile mit 2 Sätzen
  wirft · gerendert: h1, Unterzeile, `kauf-button` mit ctaHref, Bild-Slot ·
  F-12 3 Punkte rendern, 4 werfen · Text mit 3 Sätzen wirft ·
  F-16 abschnitte.css: `.kauf-button` mit min-height ≥ 44px, border-radius > 0,
  text-transform: none · F-17 max-width: 65ch für den Inhalt ·
  F-18 padding-block 64px, ab min-width 768px 96px.
- Die Wort- und Satzzählung ist exakt. Wer den Test anpasst statt der Zählung,
  hat die Aufgabe nicht erfüllt.
