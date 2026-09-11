# Handoff — 2026-09-11 (Aufgaben 001–002, 004–013, 015–022, 024)

## Letzte Sitzung
- 004: `--deep` im Edge (#25) · 011: 404 (#26) · 009: `components/formular/` +
  `lib/formular/client.ts` (#27), happy-dom: tests/hilfen/dom.ts.
- 018: `bestellregeln.ts` (#28) · 019/020: `Bestellformular.astro` + `bestellformular.ts`
  (#29, #30), Mengen via `<Produktkarten formular=…>`; /muster/ mit Beispielpreisen.
- 010: `server/empfaenger.ts` + `smtp.ts` (#31) · 021: `mails.ts` + Shop-`empfaenger.ts`
  (`erstelleBestellEmpfaenger` — das ruft 027 auf), Beispiel: docs/state/beispiel-mails.md.
- 022: `lib/formular/schluss.ts`, `pruefeSchluss` (client.ts), kein <form> nach
  Schluss (#33); Fix `[hidden]{display:none!important}` (basis.css) + --deep-Prüfung.
- 017: `Hinweise.astro` über den Produkten (#34), GS-14–16/41 PASSING · verify/--deep GREEN.
- 013: `check:golive` (`lib/golive.ts` + Haken `sites/<slug>/golive.ts`); Shop heute 21 Mängel, Exit 1 = richtig.
- 024: site.ts `vorschau` → `/<slug>/vorschau.jpg` (`lib/vorschau.ts`, sharp; #35); og:image erst mit adresse.

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- F-01/22/23 erst in 029 PASSING · in 025 `geschichteEingebaut` (site.ts) auf true · ≤ 30 Zeilen.
- Write/heredoc verschlucken `\u…`/`\\` (Regex prüfen) · happy-dom kennt kein CSS.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev` → localhost:4321/muster/ (Lieferung/Abholung wechseln,
  Wein-Menge 1), /geschenkshop-ssbl/ (Hinweise), /geschenkshop-ssbl/vorschau.jpg (Ausschnitt ok?), /gibtsnicht.
- **Bestell-Mails:** Wortlaut in `docs/state/beispiel-mails.md` (4 Beispiele).
- Zu liefern (blockiert 023/025/026; Liste: `npm run check:golive -- geschenkshop-ssbl`):
  Preis + Stückzahl je Produkt · Telefon Lädeli · Impressum/Datenschutz · Geschichte + Foto · 014-Fakten.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch; dort muss `/` den Shop zeigen.

## Vorgeschlagene nächste Aufgabe
- 003 (Befehl für neue Seiten) · 029 (Browser-Abnahme) · 014 (braucht Fakten).
