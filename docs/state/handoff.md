# Handoff — 2026-09-11 (Aufgaben 001–002, 004–009, 011, 012, 015, 016)

## Letzte Sitzung
- Fabrik-Bausteine + /geschenkshop-ssbl/ mit 5 Produktkarten (siehe 015/016).
- 004: `--deep` prüft im Edge (Playwright, `tests/browser/`): 375 px, Tab/Fokus
  (Radio-Gruppe = 1 Halt), axe, Lighthouse ≥ 90 (Median 3), Links. #25.
- 011: `src/pages/404.astro`; Lighthouse ohne `is-crawlable` nur bei noindex (#26).
- 009: `src/components/formular/` + `src/lib/formular/client.ts` (Texte frei-
  gegeben, #27). Zusatzprüfung: `setzeZusatz(formId, fn)` bzw. `verbinde(form,
  {pruefeZusatz})`; Menge mit `gruppe`/`schluessel` → `{mengen:{id:n}}`, darf
  per `form=` ausserhalb des <form> stehen. Felder in [hidden] = nicht gesendet.
  Tests: happy-dom erst NACH dem Rendern (tests/formular.test.ts). F-26–30 PASSING.
- verify GREEN; --deep GREEN (~2 min).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- F-01/22/23 erst in 029 auf PASSING setzen. Handoff ≤ 30 Zeilen.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/geschenkshop-ssbl/ (auch Handy),
  /muster/ (Formular: leer absenden, falsche E-Mail), /gibtsnicht (Fehlerseite).
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli
  (fehlt auch im Formular-Fehlerhinweis) · Links Impressum/Datenschutz · Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 018 (Bestellregeln) · 010 (Formular-Empfänger) · 003 · 014 (braucht Fakten).
