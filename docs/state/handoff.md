# Handoff — 2026-09-11 (Aufgaben 001, 002, 012, 008, 006, 005, 007, 015)

## Letzte Sitzung
- Fabrik-Bausteine fertig: Seite/Landingpage, Kopf, Hero, Nutzen, Vertrauen,
  KaufBereich, Footer, Bild, KaufButton (22/31 Fabrik-Features PASSING).
- 015: /geschenkshop-ssbl/ nutzt Landingpage mit freigegebenen Texten
  (decisions.md Tabelle oben), Hero-Foto Pflanzenstecker, Vertrauen vorläufig
  Keramik-Schalen, Kauf-Bereich nur Überschrift + Button. GS-01/02/03/04/05/13 PASSING.
- verify GREEN; --deep RED bis 004. Musterseite /muster/ nur in dev.

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern (Business-Frage).
- Test «keine Platzhalter» in geschenkshop-seite.test.ts: «Muster» allein ist
  erlaubt (Alt-Text «eingeritzte Muster»).
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts). Unbekanntes nie raten.
- Vor finish-task: `wc -l docs/state/handoff.md` ≤ 30.

## Für den Auftraggeber zu prüfen
- **015 Sichtprüfung:** `npm run dev`, dann http://localhost:4321/geschenkshop-ssbl/ —
  alle Texte lesen, auch schmal (Handy, 375 px: Browserfenster schmal ziehen).
- Sichtprüfung 005/006/007 (Logo, Button, Abstände, Footer) auf derselben Seite.
- 012: Alt-Texte in produkte.yaml · 014: Wein-Etikett-Fakten auf die Seite?
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 016 (Produktkarten; gibt 014 Beschreibungen frei) oder 004 (Browser-Prüfungen, 375 px).
