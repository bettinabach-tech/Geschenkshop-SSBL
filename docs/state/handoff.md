# Handoff — 2026-09-11 (Aufgaben 001–002, 004–012, 015–022)

## Letzte Sitzung
- 004: `--deep` im Edge (#25) · 011: 404 (#26) · 009: `components/formular/` +
  `lib/formular/client.ts` (#27), happy-dom: tests/hilfen/dom.ts.
- 018: `bestellregeln.ts` (#28) · 019/020: `Bestellformular.astro` + `bestellformular.ts`
  (#29, #30), Mengen via `<Produktkarten formular=…>`; /muster/ mit Beispielpreisen.
- 010: `server/empfaenger.ts` + `smtp.ts` (#31) · 021: `mails.ts` + Shop-`empfaenger.ts`
  (`erstelleBestellEmpfaenger` — das ruft 027 auf), Beispiel: docs/state/beispiel-mails.md.
- 022: `lib/formular/schluss.ts`, `pruefeSchluss` (client.ts), kein <form> nach
  Schluss (#33); Fix `[hidden]{display:none!important}` (basis.css) + --deep-Prüfung.
- 017: `Hinweise.astro` im Kauf-Bereich über den Produkten (#34). GS-14–16, 41 PASSING.
- verify GREEN; --deep GREEN (~2 min, Lighthouse 99–100).

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- F-01/22/23 erst in 029 auf PASSING setzen. Handoff ≤ 30 Zeilen.
- Write/heredoc verschlucken `\u…`/`\\` (Regex prüfen) · happy-dom kennt kein CSS.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/muster/ (Lieferung/Abholung
  wechseln, Wein-Menge 1), /geschenkshop-ssbl/ (Hinweise über den Produkten), /gibtsnicht.
- **Bestell-Mails:** Wortlaut in `docs/state/beispiel-mails.md` (4 Beispiele).
- 027/028: `/` muss beim Anbieter den Shop zeigen (Link der Fehlerseite).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli
  · Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto · 014: Fakten je Produkt.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 024 (Social-Media-Vorschau) · 013 (Live-Gang-Check) · 003 · 014 (braucht Fakten).
