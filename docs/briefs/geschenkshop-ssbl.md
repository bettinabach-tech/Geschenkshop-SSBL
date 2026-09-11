# Brief — Geschenkshop SSBL

<!-- Erstellt per Interview am 2026-09-11. Gesamtvision ist ein volles
     Shop-System (Bestellung + interne Produktverwaltung); dieser Brief
     deckt bewusst nur den ersten, kleineren Teil ab: die öffentliche
     Bestellseite. Die Verwaltung ist ein eigenes, späteres Projekt
     (siehe "Nicht Teil dieser Seite"). -->

## Ziel der Seite (ein Satz)

Besucher können eine Auswahl an Geschenkprodukten ansehen und per Formular bestellen.

## Woran ich Erfolg messe

- Zahl und Frist: 30 Bestellungen bis 24.12.2026
- Die Seite muss live sein am: Mitte Oktober 2026 (ca. 15.10.2026)

## Zielgruppe

Privatpersonen, die auf der Suche nach sinnvollen Weihnachtsgeschenken sind.
Die Produkte stammen aus einer sozialen Institution (SSBL) — der soziale
Hintergrund ist ein starkes Kaufargument für diese Zielgruppe.

## Woher die Besucher kommen

Social Media

- Falls Anzeige oder Flyer — welcher Wortlaut steht dort? Steht noch nicht
  fest. Die Überschrift der Seite wird eigenständig formuliert, nicht an
  einen bestehenden Anzeigentext angepasst.

## Was der Besucher davon hat (drei Punkte)

1. Er tut mit dem Kauf gleichzeitig etwas Gutes (Unterstützung der SSBL).
2. Er findet ein sinnvolles Geschenk, ohne stundenlang suchen zu müssen.
3. Er bekommt ein Geschenk mit einer echten Geschichte dahinter, statt
   etwas Beliebigem.

## Was dagegen spricht (zwei bis drei Einwände)

- Ist das Geschenk auch wirklich schön/hochwertig, oder wirkt es nach
  "Wohltätigkeit"?
- Kommt die Bestellung rechtzeitig vor Weihnachten an?

## Belege, die ich habe

- Zahlen: SSBL – Stiftung für selbstbestimmtes und begleitetes Leben.
  Hauptsitz Rathausen (Emmen) und neun weitere Standorte. Maximal 305
  Wohnplätze und 80 Arbeitsplätze für Tagesbeschäftigte.
- Zitate: keine
- Logos, Zertifikate, Partner: Logo und Produktfotos vorhanden — werden
  noch von Canto heruntergeladen und ins Projekt gelegt (Pfad folgt).
  Logo kann bereits verwendet werden: `assets/SSBL_Logo.svg`.

## Fakten, die auf der Seite stehen MÜSSEN

- Preis: pro Produkt individuell (jedes Produkt hat einen eigenen Preis)
- Datum und Dauer: Bestellschluss 15.12.2026, Lieferzeit ca. eine Woche
- Ort: Abholung in Rathausen, Emmen ("im Lädeli") oder Versand
- Weitere:
  - Anzahl verfügbarer Stück pro Produkt wird angezeigt
  - Versandkosten müssen nicht auf der Seite stehen

## Primäre Handlung (Call-to-Action)

Bestellformular

- Welche Angaben werden abgefragt? Name, Vorname, Adresse, E-Mail,
  Telefon, gewünschtes Produkt, Lieferung oder Abholung, Zahlungsart
  (Twint oder Karte, keine Rechnung).
  Davon Pflicht: Name, Vorname, E-Mail, Telefon, gewünschtes Produkt,
  Lieferung/Abholung, Zahlungsart. Adresse ist nur Pflicht bei
  "Lieferung" (bei Abholung nicht nötig).
- Wohin gehen die Daten? E-Mail an laedeli@ssbl.ch
- Was passiert nach dem Absenden? Bestätigungs-E-Mail an den Besteller.

**Hinweis (kein Tech-Entscheid, nur Vermerk):** Online-Zahlung per
Twint/Karte braucht einen externen Zahlungsdienstleister. Kosten
(Transaktionsgebühren) und Datenschutz-Folge (Zahlungsdaten) müssen vor
der Einbindung in `docs/state/decisions.md` festgehalten werden.

## Inhalte, die ich liefere

- Texte: Agent soll Vorschlag machen
- Logo, Farben, Schrift: nutze Fabrik-Standard
  (`.claude/skills/fabrik-design/SKILL.md`, Logo unter
  `assets/SSBL_Logo.svg`)
- Bilder: Produktfotos folgen (Download von Canto), Logo bereits
  verwendbar

## Sprachen

DE (nur Deutsch)

## Rechtliches

- Impressum & Datenschutz: liegen bereits vor auf ssbl.ch — wird verlinkt
- Tracking: keins

## Domain & Hosting

Noch offen

## Nicht Teil dieser Seite

- Interner Verwaltungsbereich zur Pflege der Produkte (eigenes,
  späteres Projekt — passt technisch nicht zur "landingpage-fabrik":
  braucht Login und Datenbank)
- Login-Bereich / Benutzerkonten
- Mehrsprachigkeit
- Blog
