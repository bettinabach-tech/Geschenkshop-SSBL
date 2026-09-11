# Handoff — 2026-09-11 (Aufgaben 001, 002, 012, 008, 006)

## Letzte Sitzung
- 001 Konfiguration · 002 Layout (Sichtprüfung ok, h1–h3 blau) · 012 produkte.yaml.
- 008: `Bild.astro` (src = Pfad unter assets/, alt Pflicht) → avif/webp 400/800/1200;
  `src/integrations/ungenutzte-bilder.ts` + verify-Stufe «bilder».
- 006: `KaufButton`, `Abschnitt`, `Hero` (≤ 8 Wörter, 1 Satz, Slot bild Pflicht,
  Standard-Slot für Zusatzzeile), `Nutzen` (≤ 3 Punkte, ≤ 2 Sätze);
  Zählung in `src/lib/text.ts`; Stile `src/styles/abschnitte.css`.
  Musterseite `src/pages/[muster].astro` nur in dev (getStaticPaths leer im Build).
  F-11/12/16/17/18 PASSING. verify GREEN; --deep RED bis 004.

## Achtung nächste Sitzung
- Foto-Masse nie direkt lesen (`foto.width`) → `masse()` (src/lib/fotos.ts).
- Satzregeln (Abkürzungen, Ordnungszahlen) stehen oben in text.ts; neue
  Abkürzung → dort ergänzen + Test in abschnitte-oben.test.ts.
- verify --quick war 9.6 s → vitest `pool: "threads"` (jetzt ~6 s). Unbekanntes nie raten.

## Für den Auftraggeber zu prüfen
- **006 Sichtprüfung:** `npm run dev`, dann http://localhost:4321/muster/ — Hero,
  Kauf-Button (Farbe, Grösse, abgerundet; mit Tab-Taste: Fokusrahmen), Abstände,
  Nutzen-Punkte. Texte dort sind nur Muster.
- 012: Alt-Texte in produkte.yaml lesen · 014: Wein-Etikett-Fakten auf die Seite?
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.
  SSBL intern: Datenschutzerklärung ergänzen · Zahlungslinks per E-Mail möglich?

## Vorgeschlagene nächste Aufgabe
- 005 (Kopf + Footer), dann 007 (Vertrauen, Kauf-Bereich, Landingpage) → 015.
