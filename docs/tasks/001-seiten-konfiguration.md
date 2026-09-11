---
id: 001
title: "Seiten-Konfiguration pro Brief einführen"
depends_on: []
features: []
status: done
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/site-config.test.ts"
  - "test -f dist/geschenkshop-ssbl/index.html"
human_review: false
class: patterned
---

# Kontext
Die Fabrik baut mehrere Landingpages aus einem Projekt (decisions.md: «Mehrere
Seiten in einem Projekt»). Jede Seite bekommt einen Ordner `src/sites/<slug>/`
mit ihren Einstellungen; alle Fabrik-Bausteine lesen nur daraus. Erste Seite:
`geschenkshop-ssbl` (Brief docs/briefs/geschenkshop-ssbl.md).

# Umfang
- `src/lib/site.ts`: Schema (astro/zod) + `defineSite()` mit den Feldern:
  `slug` (kleinbuchstaben-mit-bindestrich), `titel` (≤ 60 Zeichen),
  `beschreibung` (≤ 160 Zeichen), `adresse` (https-URL, optional bis Live-Gang),
  `farben.primaer` (#rrggbb, Standard #005CA9), `logo` (Pfad unter assets/,
  Standard assets/SSBL_Logo.svg), `logoAlt` (Pflicht), `kontakt.email` (Pflicht),
  `kontakt.telefon` (optional bis Live-Gang), `rechtliches.impressumUrl` und
  `rechtliches.datenschutzUrl` (https-URL, optional bis Live-Gang),
  `formular.empfaenger` (E-Mail, Pflicht), `formular.endpunkt` (optional bis
  Live-Gang), `formular.schluss` (optional, Zeitpunkt mit Zeitzone, z.B.
  2026-12-16T00:00:00+01:00).
- `src/lib/sites.ts`: alle `src/sites/*/site.ts` finden; `getSite(slug)` wirft
  einen verständlichen Fehler bei unbekanntem slug.
- `src/sites/geschenkshop-ssbl/site.ts` mit den Fakten aus dem Brief:
  kontakt.email und formular.empfaenger = laedeli@ssbl.ch, formular.schluss =
  2026-12-16T00:00:00+01:00, titel/beschreibung als Arbeitsstand (endgültig in 015).
  Unbekanntes (Telefon, Rechts-URLs, Endpunkt, Adresse) weglassen — nie raten.
- `src/pages/geschenkshop-ssbl/index.astro`: minimale Seite mit `<h1>` = titel.
- `src/pages/index.astro`: interne Übersicht, ein Link pro Seite,
  `<meta name="robots" content="noindex">`.

# Nicht Teil dieser Aufgabe
- Layout, Schrift, Farben (002), `npm run new` (003), Produkte (012).
- Endgültige Texte der Seite.
- Prüfung auf Vollständigkeit vor dem Live-Gang (013).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/site-config.test.ts` MUSS jede dieser Eingaben einzeln als ungültig
  erwarten: fehlender slug · slug mit Grossbuchstaben · slug mit Leerzeichen ·
  fehlender titel · titel mit 61 Zeichen · beschreibung mit 161 Zeichen ·
  fehlendes logoAlt · fehlende kontakt.email · kontakt.email «abc» ·
  farben.primaer «blau» · impressumUrl mit http:// · datenschutzUrl mit http:// ·
  fehlender formular.empfaenger · formular.schluss ohne Zeitzone.
- Eine minimale gültige Konfiguration ergibt primaer = #005CA9 und
  logo = assets/SSBL_Logo.svg.
- Die Geschenkshop-Konfiguration ist gültig; der Test erwartet exakt
  laedeli@ssbl.ch für kontakt.email und formular.empfaenger.
- `getSite("gibt-es-nicht")` wirft; die Meldung nennt den slug.
