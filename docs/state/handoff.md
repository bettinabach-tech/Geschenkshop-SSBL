# Handoff — 2026-09-11 (Aufgabe 002)

## Letzte Sitzung
- 001: Seiten-Konfiguration (`src/lib/site.ts`, `sites.ts`, `src/sites/geschenkshop-ssbl/`).
- 002: Layout `src/layouts/Seite.astro` (lang, Kopfdaten, og:*, Favicon aus
  Logo), Poppins 400/600 lokal, `src/styles/tokens.css` + `basis.css`,
  `src/lib/kontrast.ts` (zu helle Primärfarbe → Build bricht ab), `src/lib/logo.ts`.
  F-02/03/04/05/06/08/09/24/31 PASSING. `@types/node` als devDependency ergänzt.
- verify.sh GREEN. --deep bewusst RED bis Aufgabe 004.

## Achtung nächste Sitzung
- 008 (Bild-Baustein): glob über Produktfotos liefert ALLE Treffer nach dist/
  (siehe CLAUDE.md «Bekannte Fallen») — mit Astro-`<Picture>` prüfen, dass
  keine Originale (3–8 MB) in dist/_astro landen.
- og:image erscheint nur mit `site.adresse` + Prop `ogBild` (kommt mit 024/028).
- Unbekanntes nie raten: Telefon, Rechts-URLs, Endpunkt, adresse fehlen bewusst.
- Hosting/Mail offen (SSBL-IT): SMTP anbieterneutral (010), Anschluss in 027.

## Für den Auftraggeber zu prüfen
- **Aufgabe 002 (Sichtprüfung):** `npm run dev`, dann http://localhost:4321/geschenkshop-ssbl/
  öffnen: Titel in Poppins SemiBold, dunkler Text auf Weiss, SSBL-Logo als
  Symbol im Browser-Tab. (Sonst ist die Seite noch leer — Abschnitte folgen.)
- Arbeitstitel «Weihnachtsgeschenke aus den Werkstätten der SSBL» + Kurzbeschreibung
  in src/sites/geschenkshop-ssbl/site.ts — vorläufig, endgültig in 015.
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz auf ssbl.ch · Werkstatt-Geschichte + Foto · Fakten je Produkt (014).
- An die SSBL-IT (blockiert 027/028): Anbieter Seite + Bestellweg,
  Mailserver-Zugang (Absender laedeli@ssbl.ch), Eintrag geschenke.ssbl.ch.
- SSBL intern: Datenschutzerklärung um den Bestellweg ergänzen · Zahlungslinks per E-Mail möglich?
- Ziel live ca. 15.10.2026 — die IT-Antwort ist der kritische Pfad.

## Vorgeschlagene nächste Aufgabe
- 003 (npm run new) oder 012 (Produktliste); parallel bereit: 004, 008, 010.
