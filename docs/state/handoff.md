# Handoff — 2026-09-11 (Aufgaben 001, 002, 012, 008)

## Letzte Sitzung
- 001 Seiten-Konfiguration · 002 Layout `src/layouts/Seite.astro`, Poppins lokal,
  Kontrastprüfung, Logo als Favicon · 002 Sichtprüfung erledigt, h1–h3 blau (Nr. 18).
- 012: `produkte.yaml` (5 Produkte, preis/stueck/beschreibung leer) + `produkte.ts`.
- 008: `src/components/Bild.astro` (Props src = Pfad unter assets/, alt Pflicht,
  sizes, loading) → avif/webp 400/800/1200, Fallback-jpg ≤ 1200 px.
  Integration `src/integrations/ungenutzte-bilder.ts` löscht ungenutzte Originale;
  verify-Stufe «bilder» (`scripts/check-bilder.mjs`). F-20/F-21 PASSING.
- verify.sh GREEN. --deep bewusst RED bis Aufgabe 004.

## Achtung nächste Sitzung
- Foto-Masse nie direkt lesen (`foto.width`) → `masse()` aus src/lib/fotos.ts
  (sonst liefert Astro das 3–8-MB-Original mit). Siehe CLAUDE.md «Bekannte Fallen».
- Hero-Bild mit `loading="eager"`, alle anderen lazy (Standard).
- ? verify --quick braucht 8.3 s (Grenze 10 s) — Container-Tests wachsen; beobachten.
- Unbekanntes nie raten: Telefon, Rechts-URLs, Endpunkt, adresse, Preise fehlen bewusst.

## Für den Auftraggeber zu prüfen
- 012: Alt-Texte der Fotos in produkte.yaml lesen (beschreiben, was zu sehen ist).
- 014: Wein-Etiketten zeigen Jahrgang 2023, 70 cl, Divico 14.2 % vol., Souvignier
  Gris 13.2 % vol., Trauben aus dem SSBL-Projekt «Arbeiten im Rebberg» — auf die Seite?
- Arbeitstitel + Kurzbeschreibung (site.ts) vorläufig, endgültig in 015.
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver (laedeli@ssbl.ch), geschenke.ssbl.ch.
  SSBL intern: Datenschutzerklärung ergänzen · Zahlungslinks per E-Mail möglich?

## Vorgeschlagene nächste Aufgabe
- 005 (Kopf + Footer) oder 006 (Button, Hero, Nutzen); bereit auch 004, 009–011, 013, 018.
