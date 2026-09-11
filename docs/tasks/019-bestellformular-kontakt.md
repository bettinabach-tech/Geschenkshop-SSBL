---
id: 019
title: "Bestellformular mit Mengen, Kontakt und Zahlungsart bauen"
depends_on: [009, 016, 018]
features: [GS-17, GS-18, GS-19, GS-20, GS-21, GS-22, GS-23, GS-29, GS-34]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/bestellformular.test.ts"
human_review: true
class: open
---

# Kontext
Brief: Pflichtfelder Name, Vorname, E-Mail, Telefon, Produkt, Lieferung/Abholung,
Zahlungsart. Auftraggeber: mehrere Produkte je mit Menge in einer Bestellung.
Baut auf den Formular-Bausteinen (009) und den Bestellregeln (018) auf.

# Umfang
- Formular im Kauf-Bereich; die Mengenfelder sitzen in den Produktkarten (016).
- Mengenfeld (min 0, max = stueck, Start 0) nur bei bestellbaren Produkten;
  ausverkaufte und «Preis folgt»-Produkte haben keins.
- Felder in dieser Reihenfolge: Name · Vorname · E-Mail · Telefon ·
  Lieferung/Abholung (Radio) · Zahlungsart Twint/Karte (Radio).
- `pruefeZusatz` = `pruefeBestellung` aus 018.
- Absende-Button «Bestellung absenden» im Slot `aktion` des Kauf-Bereichs
  (das ist die CTA-Wiederholung, F-14).
- Danke-Text: Bestätigung per E-Mail folgt · das Lädeli meldet sich innert
  2 Arbeitstagen.

# Nicht Teil dieser Aufgabe
- Adressfelder und Altersbestätigung (020). Bestellschluss (022).
- Datenschutz-Hinweis und Kontaktdaten in der Fehlermeldung (023, blockiert).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/bestellformular.test.ts` (happy-dom) prüft einzeln:
  GS-17 Mengenfeld mit min="0" und max = stueck für jedes bestellbare Produkt,
  keins bei stueck 0 · GS-18 alle Mengen 0 → Hinweis bei den Mengenfeldern,
  kein fetch · GS-19 Name leer → Hinweis · GS-20 Vorname leer → Hinweis ·
  GS-21 E-Mail leer und «abc» → je Hinweis · GS-22 Telefon leer und «12» →
  je Hinweis · GS-23 kein Weg gewählt → Hinweis · GS-29 keine Zahlungsart →
  Hinweis · alles gültig → genau ein fetch mit mengen, name, vorname, email,
  telefon, weg, zahlung im JSON · GS-34 nach Antwort 200 enthält die
  Danke-Meldung «E-Mail» und «2 Arbeitstagen».
- Menschliche Prüfung: Formular im Browser ausfüllen, Handy und Desktop.
