# Handoff — 2026-09-11 (Aufgaben 001–002, 004–009, 011, 012, 015, 016, 018, 019)

## Letzte Sitzung
- 004: `--deep` im Edge (`tests/browser/`, #25) · 011: 404-Seite (#26).
- 009: `src/components/formular/` + `lib/formular/client.ts` (#27); Gruppen-
  Hinweise (`mengen`) markieren/entfernen jetzt korrekt. happy-dom: tests/hilfen/dom.ts.
- 018: `bestellregeln.ts` (rein), Formate in lib/formular/regeln.ts (#28).
- 019: `Bestellformular.astro` + `bestellformular.ts` (Seitenlogik, hier baut 020
  weiter), `<Produktkarten formular="bestellung">` für Mengenfelder (#29).
  GS-17–23, 29, 34 PASSING. /muster/ zeigt das echte Formular mit Beispielpreisen.
- verify GREEN; --deep GREEN (~2 min, Lighthouse 99–100).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- F-01/22/23 erst in 029 auf PASSING setzen. Handoff ≤ 30 Zeilen.
- Ohne 020 lehnen die Regeln Lieferung/Wein ab (Hinweis oben, Felder fehlen noch).

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/muster/ (Bestellformular unten
  ausfüllen, Handy + Desktop), /geschenkshop-ssbl/, /gibtsnicht (Fehlerseite).
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli
  (fehlt auch im Formular-Fehlerhinweis) · Links Impressum/Datenschutz · Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 020 (Adresse + Alter, macht das Formular komplett) · 010 · 003 · 014.
