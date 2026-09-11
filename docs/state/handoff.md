# Handoff — 2026-09-11 (Aufgaben 001, 002, 012, 008, 006, 005, 007)

## Letzte Sitzung
- 001 Konfiguration · 002 Layout (Sichtprüfung ok, h1–h3 blau) · 012 produkte.yaml.
- 008 `Bild.astro` · 006 `KaufButton`, `Abschnitt`, `Hero`, `Nutzen` · 005 `Kopf`, `Footer`.
- 007 `Vertrauen` (Slot bild + Text Pflicht), `KaufBereich` (id «bestellen»,
  Slot «aktion» ersetzt den Kauf-Button), `Landingpage` (Kopf → hero → nutzen →
  vertrauen → kauf → Footer, alle 4 Slots Pflicht). Fixture tests/fixtures/GanzeSeite.astro.
  F-10/13/14/15 PASSING (22/31 Fabrik). verify GREEN; --deep RED bis 004.
- Musterseite /muster/ (nur dev) zeigt jetzt die ganze Landingpage.
- Rangfolge Skills in CLAUDE.md: fabrik-design vor frontend-design (noch nicht installiert).

## Achtung nächste Sitzung
- 015: geschenkshop-ssbl/index.astro auf `Landingpage` umbauen; Texte VORHER
  dem Auftraggeber vorlegen (Business-Frage). Vorlage: src/pages/[muster].astro.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts). Unbekanntes nie raten.
- Vor finish-task: `wc -l docs/state/handoff.md` ≤ 30.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung 005/006/007:** `npm run dev`, dann http://localhost:4321/muster/ —
  ganze Seite von oben bis unten: Logo, Hero, Kauf-Button (Tab-Taste: Rahmen),
  Abstände, Nutzen, Vertrauen mit Foto, Kauf-Bereich, Footer. Texte sind Muster.
- 012: Alt-Texte in produkte.yaml lesen · 014: Wein-Etikett-Fakten auf die Seite?
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 015 (Geschenkshop-Seite oben) — zuerst Textvorschlag an den Auftraggeber.
