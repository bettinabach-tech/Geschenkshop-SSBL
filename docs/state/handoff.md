# Handoff — 2026-09-11 (Aufgaben 001–002, 004–012, 015, 016, 018–021)

## Letzte Sitzung
- 004: `--deep` im Edge (#25) · 011: 404 (#26) · 009: `components/formular/` +
  `lib/formular/client.ts` (#27), happy-dom: tests/hilfen/dom.ts.
- 018: `bestellregeln.ts` (#28) · 019/020: `Bestellformular.astro` + `bestellformular.ts`
  (#29, #30), Mengen via `<Produktkarten formular=…>`; /muster/ mit Beispielpreisen.
- 010: `src/server/empfaenger.ts` + `smtp.ts` (nodemailer, #31).
- 021: `mails.ts` (`baueMails`, reiner Text) + Shop-`empfaenger.ts`
  (`erstelleBestellEmpfaenger` — das ruft 027 auf). `formatierePreis` jetzt in status.ts.
- verify GREEN; --deep GREEN (~2 min, Lighthouse 99–100).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- F-01/22/23 erst in 029 auf PASSING setzen. Handoff ≤ 30 Zeilen.
- Write/heredoc verschlucken `\u…`/`\\` → nach dem Schreiben Regex-Zeilen prüfen.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/muster/ (Formular: Lieferung
  wählen, Wein-Menge 1; Handy + Desktop), /geschenkshop-ssbl/, /gibtsnicht.
- **Bestell-Mails:** Wortlaut in `docs/state/beispiel-mails.md` (4 Beispiele).
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli
  · Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 022 (Bestellschluss im Formular, Text vorgeschlagen) · 017 (Hinweistexte) · 003.
