# Beispiel der Bestell-Mails (Aufgabe 021)

So sehen die zwei Mails einer Bestellung aus. Erzeugt mit denselben
Funktionen wie auf dem Server (`src/sites/geschenkshop-ssbl/mails.ts`).
Personenangaben und Preise sind erfunden; die echten Preise fehlen noch
(Aufgabe 026). Wortlaut freigegeben am 11.09.2026.

### 1. Mail an das Lädeli — Lieferung mit Wein

```text
An: laedeli@ssbl.ch
Antwort an: anna@example.ch
Betreff: Neue Bestellung: Anna Muster

Neue Bestellung über den Geschenkshop
Eingang: 12.12.2026, 14:03 Uhr

Bestellte Geschenke
- 2 × Keramik-Schalen-Set à CHF 24.50 = CHF 49.00
- 1 × Klosterwein Rathausen Divico à CHF 18.00 = CHF 18.00
Summe Produkte: CHF 67.00 (ohne Versand)

Name: Muster
Vorname: Anna
E-Mail: anna@example.ch
Telefon: 079 123 45 67

Lieferung per Post an:
Rathausen 1
6032 Emmen

Zahlungsart: Karte
Altersbestätigung: mindestens 16 Jahre

Bitte innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen melden.
Antworten auf diese Mail gehen direkt an anna@example.ch.
```

### 2. Bestätigung — Lieferung mit Wein

```text
An: anna@example.ch
Betreff: Ihre Bestellung im Geschenkshop der SSBL ist eingegangen

Guten Tag Anna Muster

Vielen Dank für Ihre Bestellung! Sie ist am 12.12.2026 um 14:03 Uhr bei uns eingegangen.

Ihre Bestellung
- 2 × Keramik-Schalen-Set à CHF 24.50 = CHF 49.00
- 1 × Klosterwein Rathausen Divico à CHF 18.00 = CHF 18.00
Summe Produkte: CHF 67.00 (ohne Versandkosten)

Ihre Angaben
Name: Muster · Vorname: Anna
E-Mail: anna@example.ch
Telefon: 079 123 45 67
Lieferung per Post an: Rathausen 1, 6032 Emmen
Zahlungsart: Karte

Wie es weitergeht
Das Lädeli meldet sich innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen. Ihre Bestellung wird erst mit dieser Rückmeldung verbindlich.

Fragen? Schreiben Sie an laedeli@ssbl.ch.

Freundliche Grüsse
Lädeli der SSBL
```

### 3. Mail an das Lädeli — Abholung ohne Wein

```text
An: laedeli@ssbl.ch
Antwort an: anna@example.ch
Betreff: Neue Bestellung: Anna Muster

Neue Bestellung über den Geschenkshop
Eingang: 12.12.2026, 14:03 Uhr

Bestellte Geschenke
- 2 × Keramik-Schalen-Set à CHF 24.50 = CHF 49.00
Summe Produkte: CHF 49.00 (ohne Versand)

Name: Muster
Vorname: Anna
E-Mail: anna@example.ch
Telefon: 079 123 45 67

Abholung im Lädeli in Rathausen

Zahlungsart: Twint

Bitte innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen melden.
Antworten auf diese Mail gehen direkt an anna@example.ch.
```

### 4. Bestätigung — Abholung ohne Wein

```text
An: anna@example.ch
Betreff: Ihre Bestellung im Geschenkshop der SSBL ist eingegangen

Guten Tag Anna Muster

Vielen Dank für Ihre Bestellung! Sie ist am 12.12.2026 um 14:03 Uhr bei uns eingegangen.

Ihre Bestellung
- 2 × Keramik-Schalen-Set à CHF 24.50 = CHF 49.00
Summe Produkte: CHF 49.00

Ihre Angaben
Name: Muster · Vorname: Anna
E-Mail: anna@example.ch
Telefon: 079 123 45 67
Abholung im Lädeli in Rathausen
Zahlungsart: Twint

Wie es weitergeht
Das Lädeli meldet sich innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen. Ihre Bestellung wird erst mit dieser Rückmeldung verbindlich.

Fragen? Schreiben Sie an laedeli@ssbl.ch.

Freundliche Grüsse
Lädeli der SSBL
```
