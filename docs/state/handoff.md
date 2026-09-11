# Handoff — 2026-09-11 (Aufgaben 001–002, 004–012, 015, 016, 018–022)

## Letzte Sitzung
- 004: `--deep` im Edge (#25) · 011: 404 (#26) · 009: `components/formular/` +
  `lib/formular/client.ts` (#27), happy-dom: tests/hilfen/dom.ts.
- 018: `bestellregeln.ts` (#28) · 019/020: `Bestellformular.astro` + `bestellformular.ts`
  (#29, #30), Mengen via `<Produktkarten formular=…>`; /muster/ mit Beispielpreisen.
- 010: `server/empfaenger.ts` + `smtp.ts` (#31) · 021: `mails.ts` + Shop-`empfaenger.ts`
  (`erstelleBestellEmpfaenger` — das ruft 027 auf), Beispiel: docs/state/beispiel-mails.md.
- 022: `lib/formular/schluss.ts`, `pruefeSchluss` in client.ts, Formular.astro
  baut nach Schluss kein <form> (#33). Fix: `[hidden]{display:none!important}`
  in basis.css (Adresse/Formular blieben sonst sichtbar) + neue --deep-Prüfung.
- verify GREEN; --deep GREEN (~2 min, Lighthouse 99–100).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- F-01/22/23 erst in 029 auf PASSING setzen. Handoff ≤ 30 Zeilen.
- Write/heredoc verschlucken `\u…`/`\\` (Regex prüfen) · happy-dom kennt kein CSS.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/muster/ (Lieferung/Abholung
  wechseln, Wein-Menge 1; Handy + Desktop), /geschenkshop-ssbl/, /gibtsnicht.
- **Bestell-Mails:** Wortlaut in `docs/state/beispiel-mails.md` (4 Beispiele).
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli
  · Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto · 014: Fakten je Produkt.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 017 (Hinweistexte Abholung/Versand/Zahlung) · 003 · 013 · 024.
