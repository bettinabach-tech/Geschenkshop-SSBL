# Handoff — 2026-09-11 (Aufgaben 001–002, 005–008, 012, 015, 016)

## Letzte Sitzung
- Fabrik-Bausteine fertig: Seite/Landingpage, Kopf, Hero, Nutzen, Vertrauen,
  KaufBereich, Footer, Bild, KaufButton (22/31 Fabrik-Features PASSING).
- 015: /geschenkshop-ssbl/ mit freigegebenen Texten (decisions.md Tabelle oben).
- 016: `src/sites/geschenkshop-ssbl/Produktkarten.astro` im Kauf-Bereich,
  `produktStatus()` + `formatierePreis()` in produkte.ts (für 018/019 nutzen),
  `src/styles/produkte.css`. GS-07/11/12 PASSING. Alle 5 Karten: «Preis folgt».
- Musterseite /muster/ (nur dev) zeigt Kartenzustände mit Beispielwerten.
- verify GREEN; --deep RED bis 004.

## Achtung nächste Sitzung
- Texte auf der Seite nur nach Freigabe ändern. Unbekanntes nie raten.
- Foto-Masse nie direkt lesen → `masse()` (src/lib/fotos.ts).
- Vor finish-task: `wc -l docs/state/handoff.md` ≤ 30.

## Für den Auftraggeber zu prüfen
- **Sichtprüfung:** `npm run dev`, dann http://localhost:4321/geschenkshop-ssbl/
  (Texte, Logo, Button, Abstände, 5 Produktkarten, Footer; auch schmal wie Handy)
  und http://localhost:4321/muster/ (Karten mit Preis / ausverkauft / Wein —
  dort nur Beispielwerte).
- 012: Alt-Texte in produkte.yaml · 014: 1–2 Fakten je Produkt (Wein-Etiketten?).
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.

## Vorgeschlagene nächste Aufgabe
- 014 (Beschreibungen; braucht Fakten vom Auftraggeber) · 004 (Browser-Prüfungen) · 017.
