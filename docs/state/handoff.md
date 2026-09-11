# Handoff — 2026-09-11 (Aufgaben 001–002, 004–008, 012, 015, 016)

## Letzte Sitzung
- Fabrik-Bausteine + /geschenkshop-ssbl/ mit 5 Produktkarten (siehe 015/016).
- 004: `verify --deep` prüft jetzt echt im installierten Edge (Playwright):
  375 px (F-01), Tab + Fokusrahmen (F-23), axe, Lighthouse Handy ≥ 90 (F-22,
  Median aus 3), externe Links. Tests: `tests/browser/*.spec.ts`, Selbsttests
  mit Fixtures in `tests/browser/fixtures/`. Heute: Lighthouse 100/100/100/100.
- Server für Tests: `scripts/serve-dist.mjs` (astro preview geht unter Claude
  in den Hintergrund, siehe CLAUDE.md). decisions.md #25.
- verify GREEN; --deep GREEN (~1,5 min).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- Neue Seiten/Formulare laufen automatisch durch --deep; F-01/22/23 erst in 029
  auf PASSING setzen.
- Vor finish-task: `wc -l docs/state/handoff.md` ≤ 30.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev`, dann http://localhost:4321/geschenkshop-ssbl/
  (auch schmal wie Handy) und http://localhost:4321/muster/ (Beispielwerte).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 011 (Fehlerseite) · 009 (Formular-Bausteine) · 014 (braucht Fakten) · 017.
