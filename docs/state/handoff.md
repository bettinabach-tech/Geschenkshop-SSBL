# Handoff — 2026-09-11 (Aufgabe 001)

## Letzte Sitzung
- 001 erledigt: Schema `src/lib/site.ts` (defineSite, astro/zod v4), Suche
  `src/lib/sites.ts` (getSite/getSites, Ordnername = slug), Einstellungen
  `src/sites/geschenkshop-ssbl/site.ts`, Minimalseite /geschenkshop-ssbl/,
  interne Übersicht / (noindex). Test: tests/site-config.test.ts (20 Fälle).
- verify.sh GREEN. --deep bewusst RED bis Aufgabe 004.

## Achtung nächste Sitzung
- Bausteine lesen Einstellungen nur über `getSite(slug)` — nie direkt importieren.
- Unbekanntes nie raten: Telefon, Rechts-URLs, Endpunkt, adresse fehlen bewusst
  in site.ts; `check:golive` (013) meldet Lücken. Keine Platzhalter-Texte zeigen.
- Hosting/Mail offen (SSBL-IT): Empfänger anbieterneutral über SMTP (010),
  Anschluss erst in 027.
- ? --quick ist mit Container-Tests schon ~4 s; wächst die Testsuite, 10-s-Grenze beobachten.

## Für den Auftraggeber zu prüfen
- Arbeitstitel (Browser-Tab): «Weihnachtsgeschenke aus den Werkstätten der SSBL»;
  Kurzbeschreibung für Suchmaschinen in src/sites/geschenkshop-ssbl/site.ts.
  Beides vorläufig, endgültig in Aufgabe 015.
- decisions.md lesen, v.a. Nr. 11 (Produkte erst nach dem Vertrauens-Abschnitt).
- Zu liefern (blockiert sonst 023/025/026): Preis + Stückzahl je Produkt ·
  Telefonnummer Lädeli · genaue Links Impressum/Datenschutz auf ssbl.ch ·
  3–5 Sätze Werkstatt-Geschichte + Foto mit Einverständnis · 1–2 Fakten je Produkt (014).
- An die SSBL-IT (blockiert 027/028): Anbieter für Seite + Bestellweg,
  Mailserver-Zugang (Absender laedeli@ssbl.ch), Eintrag geschenke.ssbl.ch.
- SSBL intern: Datenschutzerklärung um den Bestellweg ergänzen · Zahlungslinks per E-Mail möglich?
- Ziel live ca. 15.10.2026 — die IT-Antwort ist der kritische Pfad.

## Vorgeschlagene nächste Aufgabe
- 002 (Layout/Schrift/Farben), dann 003 und 012. Parallel bereit: 004, 008, 010.
