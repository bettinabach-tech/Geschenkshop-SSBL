---
name: fabrik-design
description: >
  Use WHENEVER the task creates or changes anything a visitor sees:
  page layout, sections, hero, CTA buttons, forms, colors, typography,
  spacing, images, or files in src/pages/*, src/components/*,
  src/styles/*. Does NOT fire for build scripts, tests, or docs/.
---

# SSBL — Design-Regeln für Landingpages

Vorrang: Diese Regeln gehen jeder allgemeinen Design-Skill (z.B.
frontend-design) vor. Andere Skills dürfen nur ergänzen, was hier offen ist.

## Nicht verhandelbar (Verstoss = Aufgabe falsch, auch bei grünem verify)
- Genau EIN primärer CTA pro Seite: Produkt kaufen/bestellen. Alle
  anderen Links (Kontakt, mehr erfahren) nie als Button.
- Farben: Primär #005CA9 (nur Überschriften h1–h3, Kauf-Button,
  Hervorhebung), Hintergrund #ffffff, Fliesstext #1a1a1a. Keine weiteren
  Akzentfarben ohne Freigabe. (Blaue Überschriften: Freigabe Auftraggeber
  11.09.2026, decisions.md Nr. 18.)
- Kontrast mind. 4.5:1 (WCAG AA); geprüft: #1a1a1a/#ffffff = 17.4:1,
  Weiss/#005CA9 = 6.8:1. Neue Kombinationen nachrechnen, nicht schätzen.
- Schrift: Poppins SemiBold (Überschrift), Poppins Regular (Text) —
  Google Font, kostenlos. Keine dritte Schrift.
- Mobil zuerst: 375 px Breite ohne horizontales Scrollen lesbar.
- Tonalität: Sie, warm, persönlich. Keine unbelegten Superlative
  ("das beste", "einzigartig").

## Aufbau einer Seite (Reihenfolge verbindlich)
1. Hero: Headline max. 8 Wörter, Subline 1 Satz, Kauf-CTA, Produktbild
2. Nutzen: max. 3 Punkte, je max. 2 Sätze
3. Vertrauen: Geschichte/Bild der Klientin oder des Klienten hinter dem
   Produkt. Nie erfundene Zitate, nie Platzhalter-Logos.
4. CTA-Wiederholung
5. Footer: Impressum, Datenschutz, Kontakt

## Abstände & Grössen
- Abschnittsabstand 96 px Desktop / 64 px mobil
- Maximale Textbreite 65 Zeichen/Zeile
- Buttons: mind. 44 px Höhe, abgerundete Ecken, keine Grossschreibung

## Bilder & Logo
- Logo: assets/SSBL_Logo.svg, Mindesthöhe 32 px, Schutzzone = halbe
  Logohöhe frei ringsum. Nie verzerren.
- Bilder: echte Fotos, keine Stock-/Platzhalterbilder, immer Alt-Text.

## Bereits bezahlte Fallen
- (leer — wächst durch erlebte Fehler beim Meilenstein-Review)
