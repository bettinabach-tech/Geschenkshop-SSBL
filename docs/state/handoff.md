# Handoff — 2026-09-11 (Aufgaben 001–002, 004–008, 011, 012, 015, 016)

## Letzte Sitzung
- Fabrik-Bausteine + /geschenkshop-ssbl/ mit 5 Produktkarten (siehe 015/016).
- 004: `--deep` prüft im Edge (Playwright, `tests/browser/`): 375 px, Tab/Fokus,
  axe, Lighthouse ≥ 90 (Median aus 3), externe Links; Selbsttests mit Fixtures.
  Server: `scripts/serve-dist.mjs` (nicht astro preview, CLAUDE.md). #25.
- 011: `src/pages/404.astro` (Text freigegeben), Seite.astro kann `titel` +
  `noindex`. Lighthouse wertet `is-crawlable` nur bei noindex-Seiten nicht
  (decisions.md #26). F-25 PASSING.
- verify GREEN; --deep GREEN (~2 min).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- Neue Seiten/Formulare laufen automatisch durch --deep; F-01/22/23 erst in 029
  auf PASSING setzen.
- Vor finish-task: `wc -l docs/state/handoff.md` ≤ 30.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev`, dann http://localhost:4321/geschenkshop-ssbl/
  (auch schmal wie Handy), /muster/ (Beispielwerte), /gibtsnicht (Fehlerseite).
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 009 (Formular-Bausteine) · 003 (npm run new) · 014 (braucht Fakten) · 017.
