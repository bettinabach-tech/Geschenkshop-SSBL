# Handoff — 2026-09-11 (Aufgaben 001–002, 004–009, 011, 012, 015, 016, 018–020)

## Letzte Sitzung
- 004: `--deep` im Edge (`tests/browser/`, #25) · 011: 404-Seite (#26).
- 009: `src/components/formular/` + `lib/formular/client.ts` (#27); Gruppen-
  Hinweise (`mengen`) markieren/entfernen jetzt korrekt. happy-dom: tests/hilfen/dom.ts.
- 018: `bestellregeln.ts` (rein), Formate in lib/formular/regeln.ts (#28).
- 019: `Bestellformular.astro` + `bestellformular.ts`, Mengen via `<Produktkarten
  formular="bestellung">` (#29). /muster/ = echtes Formular mit Beispielpreisen.
- 020: #bestellung-adresse / #bestellung-alter, ein-/ausgeblendet in
  bestellformular.ts (#30). Blur-Hinweise warten bei gedrückter Maus bis
  nach dem Klick (client.ts `nachDemLoslassen`). GS-24–28, 30 PASSING.
- verify GREEN; --deep GREEN (~2 min, Lighthouse 99–100).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- F-01/22/23 erst in 029 auf PASSING setzen. Handoff ≤ 30 Zeilen.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/muster/ (Formular: Lieferung
  wählen, Wein-Menge 1; Handy + Desktop), /geschenkshop-ssbl/, /gibtsnicht.
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli
  (fehlt auch im Formular-Fehlerhinweis) · Links Impressum/Datenschutz · Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 010 (Formular-Empfänger, ohne IT-Zugang baubar) · 017 (Hinweistexte) · 003 · 014.
