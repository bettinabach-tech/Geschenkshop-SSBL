# Handoff — 2026-09-11 (Aufgaben 001, 002, 012, 008, 006, 005)

## Letzte Sitzung
- 001 Konfiguration · 002 Layout (Sichtprüfung ok, h1–h3 blau) · 012 produkte.yaml.
- 008 `Bild.astro` (avif/webp, ungenutzte Originale weg, verify-Stufe «bilder»).
- 006 `KaufButton`, `Abschnitt`, `Hero`, `Nutzen` (Regeln via `src/lib/text.ts`).
  Musterseite `src/pages/[muster].astro` nur in dev (/muster/).
- 005 `Kopf.astro` (Logo 40 px, Schutzzone 20 px), `Footer.astro` (Impressum,
  Datenschutz, Kontakt mailto, tel — fehlende Links weggelassen),
  `kopf-footer.css`; Links global in Textfarbe (basis.css). F-07/F-19 PASSING.
- vitest `pool: "threads"` → verify --quick ~6 s. verify GREEN; --deep RED bis 004.

## Achtung nächste Sitzung
- Foto-Masse nie direkt lesen (`foto.width`) → `masse()` (src/lib/fotos.ts).
- F-15 (nur Kauf als Button) erst mit 007/Landingpage beweisbar — noch FAILING.
- Vor finish-task: `wc -l docs/state/handoff.md` ≤ 30. Unbekanntes nie raten.

## Für den Auftraggeber zu prüfen
- **006 + 005 Sichtprüfung:** `npm run dev`, dann http://localhost:4321/muster/ —
  Logo oben, Hero, Kauf-Button (Tab-Taste: Fokusrahmen), Abstände, Nutzen, Footer.
  Texte dort sind Muster; Footer zeigt bis zur Lieferung der Links nur «Kontakt».
- 012: Alt-Texte in produkte.yaml lesen · 014: Wein-Etikett-Fakten auf die Seite?
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.
  SSBL intern: Datenschutzerklärung ergänzen · Zahlungslinks per E-Mail möglich?

## Vorgeschlagene nächste Aufgabe
- 007 (Vertrauen, Kauf-Bereich, Landingpage) → danach 015 (Geschenkshop-Seite oben).
