# Handoff — 2026-09-11 (Aufgaben 001–002, 004–009, 011, 012, 015, 016, 018)

## Letzte Sitzung
- 004: `--deep` im Edge (`tests/browser/`, #25) · 011: 404-Seite (#26).
- 009: `src/components/formular/` + `lib/formular/client.ts` (#27). Menge mit
  `gruppe`/`schluessel` → `{mengen:{id:n}}`, per `form=` auch ausserhalb des
  <form>; Felder in [hidden] = nicht gesendet. happy-dom erst NACH dem Rendern.
- 018: `bestellregeln.ts` (rein; für 019: `setzeZusatz("bestellung", d =>
  pruefeBestellung(d, produkte).fehler)`). Gemeinsame Formate: lib/formular/
  regeln.ts; `produktStatus` jetzt in status.ts (produkte.ts exportiert weiter).
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
- 010 (Formular-Empfänger) · 019 falls bereit · 003 · 014 (braucht Fakten).
