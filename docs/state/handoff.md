# Handoff — 2026-09-11 (Aufgaben 001, 002, 012)

## Letzte Sitzung
- 001 Seiten-Konfiguration · 002 Layout `src/layouts/Seite.astro`, Poppins lokal,
  tokens/basis.css, Kontrastprüfung, Logo als Favicon (F-02/03/04/05/06/08/09/24/31).
- Nach Sichtprüfung: Überschriften h1–h3 in SSBL-Blau (Auftraggeber, decisions Nr. 18).
- 012: `src/sites/geschenkshop-ssbl/produkte.yaml` (5 Produkte, preis/stueck/
  beschreibung leer) + `produkte.ts` (Paket yaml, zod; Fehler nennt Produkt + Feld).
  Die Geschenkshop-Seite importiert produkte.ts, damit der Build die Liste prüft.
- verify.sh GREEN. --deep bewusst RED bis Aufgabe 004.

## Achtung nächste Sitzung
- 008: glob über Bilder liefert ALLE Treffer nach dist/ (CLAUDE.md «Bekannte Fallen»);
  nach dem Build `ls dist/_astro` — keine Originale (3–8 MB) erlaubt.
- produkte.ts prüft `foto` per fs relativ zu process.cwd() (= Projektwurzel).
- og:image nur mit `site.adresse` + Prop `ogBild` (024/028).
- Unbekanntes nie raten: Telefon, Rechts-URLs, Endpunkt, adresse, Preise fehlen bewusst.

## Für den Auftraggeber zu prüfen
- 002 Sichtprüfung: erledigt (11.09.2026, mit blauen Überschriften).
- 012: Alt-Texte der Fotos in produkte.yaml lesen (beschreiben, was zu sehen ist).
- 014 Fakten je Produkt: Die Wein-Etiketten zeigen Jahrgang 2023, 70 cl, Divico
  14.2 % vol., Souvignier Gris 13.2 % vol., Trauben gelesen im SSBL-Projekt
  «Arbeiten im Rebberg». Dürfen diese Angaben auf die Seite?
- Arbeitstitel + Kurzbeschreibung (site.ts) vorläufig, endgültig in 015.
- Zu liefern (blockiert 023/025/026): Preis + Stückzahl je Produkt · Telefon Lädeli ·
  Links Impressum/Datenschutz · Werkstatt-Geschichte + Foto.
- SSBL-IT (blockiert 027/028): Anbieter, Mailserver-Zugang (laedeli@ssbl.ch), geschenke.ssbl.ch.
- SSBL intern: Datenschutzerklärung ergänzen · Zahlungslinks per E-Mail möglich?

## Vorgeschlagene nächste Aufgabe
- 008 (Bild-Baustein) → nötig für Hero und Produktkarten; parallel 004, 010, 013.
