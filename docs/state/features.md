# Features — landingpage-fabrik
<!-- Status: FAILING | PASSING. Eine Zeile = etwas, das ein Besucher der Seite bemerkt.
     Auf [PASSING] setzt die Aufgabe, die das Feature erfüllt — aber nur, wenn ein
     Test in tests/ die ID nennt (verify-Stufe "features" prüft das).
     Format: "- [STATUS] ID Beschreibung". IDs nie umnummerieren. -->

## Fabrik

- [FAILING] F-01 Die Seite ist auf einem Handy mit 375 px Breite ohne seitliches Scrollen vollständig lesbar.
- [PASSING] F-02 Überschriften erscheinen in Poppins SemiBold, Fliesstext in Poppins Regular.
- [PASSING] F-03 Die Schrift kommt vom eigenen Server; beim Aufruf der Seite gehen keine Daten an Google oder andere Dritte.
- [PASSING] F-04 Die Seite setzt kein Cookie und enthält kein Tracking.
- [PASSING] F-05 Fliesstext erscheint dunkel (#1a1a1a) auf Weiss; die Primärfarbe (#005CA9) kommt nur bei Überschriften, beim Kauf-Button und bei Hervorhebungen vor.
- [PASSING] F-06 Jede Text-/Hintergrund-Kombination hat einen Kontrast von mindestens 4.5:1.
- [PASSING] F-07 Das Logo steht oben auf der Seite, mindestens 32 px hoch, unverzerrt und mit freier Schutzzone ringsum.
- [PASSING] F-08 Der Browser-Tab zeigt den Seitentitel und das Logo als kleines Symbol.
- [PASSING] F-09 Beim Teilen des Links auf Social Media erscheint eine Vorschau mit Titel, Beschreibung und Bild.
- [PASSING] F-10 Die Abschnitte folgen immer der Reihenfolge Hero, Nutzen, Vertrauen, Kauf-Bereich, Footer.
- [PASSING] F-11 Der Hero zeigt eine Überschrift von höchstens 8 Wörtern, eine Unterzeile von einem Satz, den Kauf-Button und ein Produktbild.
- [PASSING] F-12 Der Nutzen-Abschnitt zeigt höchstens 3 Punkte mit je höchstens 2 Sätzen.
- [PASSING] F-13 Der Vertrauens-Abschnitt zeigt einen Text und ein echtes Foto.
- [PASSING] F-14 Der Kauf-Button erscheint im Kauf-Bereich unten ein zweites Mal.
- [PASSING] F-15 Nur die Kaufhandlung sieht wie ein Button aus; alle anderen Links (Kontakt, mehr erfahren) sind Textlinks.
- [PASSING] F-16 Buttons sind mindestens 44 px hoch, haben abgerundete Ecken und keine Grossbuchstaben-Schreibweise.
- [PASSING] F-17 Textzeilen sind höchstens 65 Zeichen breit.
- [PASSING] F-18 Abschnitte haben 96 px Abstand auf dem Desktop und 64 px auf dem Handy.
- [PASSING] F-19 Der Footer enthält Links zu Impressum, Datenschutz und Kontakt.
- [PASSING] F-20 Jedes Bild hat einen beschreibenden Alternativtext.
- [PASSING] F-21 Bilder laden in passender Grösse und modernem Format; kein Bild ist auf dem Handy grösser als 300 KB.
- [FAILING] F-22 Die Seite erreicht in Lighthouse (Handy) mindestens 90 Punkte in Performance, Barrierefreiheit, Best Practices und SEO.
- [FAILING] F-23 Alle Links, Buttons und Formularfelder sind per Tastatur erreichbar und haben einen sichtbaren Fokusrahmen.
- [PASSING] F-24 Die Seite ist als deutschsprachig ausgezeichnet, damit Screenreader sie deutsch vorlesen.
- [PASSING] F-25 Eine falsche Adresse zeigt eine freundliche Fehlerseite mit Link zur Startseite.
- [FAILING] F-26 Pflichtfelder im Formular sind sichtbar als Pflicht markiert.
- [FAILING] F-27 Ein fehlendes oder falsch ausgefülltes Feld zeigt seinen Hinweis direkt am Feld, bevor abgeschickt wird.
- [FAILING] F-28 Nach dem ersten Klick auf «Absenden» ist der Button gesperrt und zeigt, dass gesendet wird.
- [FAILING] F-29 Nach erfolgreichem Absenden erscheint eine Danke-Meldung anstelle des Formulars.
- [FAILING] F-30 Schlägt das Absenden technisch fehl, erscheint eine Meldung mit Telefonnummer und E-Mail-Adresse, und alle Eingaben bleiben erhalten.
- [PASSING] F-31 Jede Seite kann eigene Primärfarbe und eigenes Logo zeigen, ohne andere Seiten zu verändern.

## Geschenkshop SSBL

- [PASSING] GS-01 Überschrift und Unterzeile im Hero sprechen Menschen an, die ein sinnvolles Weihnachtsgeschenk suchen, und nennen die SSBL.
- [PASSING] GS-02 Der Hero zeigt ein echtes Produktfoto.
- [PASSING] GS-03 Der Kauf-Button im Hero führt direkt zum Bestellbereich.
- [PASSING] GS-04 Der Nutzen-Abschnitt zeigt genau 3 Punkte: Gutes tun (Unterstützung der SSBL), sinnvolles Geschenk ohne langes Suchen, Geschenk mit echter Geschichte.
- [PASSING] GS-05 Der Vertrauens-Abschnitt nennt die SSBL-Fakten: Hauptsitz Rathausen (Emmen) und neun weitere Standorte, bis zu 305 Wohnplätze, 80 Arbeitsplätze für Tagesbeschäftigte.
- [FAILING] GS-06 Der Vertrauens-Abschnitt erzählt die Geschichte der Menschen und Werkstätten hinter den Produkten, mit echtem Foto.
- [PASSING] GS-07 Alle 5 Produkte erscheinen: Keramik-Pflanzenstecker Kräuter, Anzündholz-Bündel, Keramik-Schalen-Set, Klosterwein Rathausen Divico, Klosterwein Rathausen Souvignier Gris.
- [FAILING] GS-08 Jedes Produkt zeigt Foto, Namen und eine kurze Beschreibung.
- [FAILING] GS-09 Jedes Produkt zeigt seinen Preis in CHF.
- [FAILING] GS-10 Jedes Produkt zeigt, wie viele Stück noch verfügbar sind.
- [PASSING] GS-11 Ein ausverkauftes Produkt bleibt sichtbar, trägt den Hinweis «ausverkauft» und lässt sich nicht bestellen.
- [PASSING] GS-12 Die beiden Weine tragen den Hinweis «Abgabe ab 16 Jahren».
- [PASSING] GS-13 Bestellschluss (15.12.2026) und Lieferzeit (ca. eine Woche) stehen im Hero.
- [FAILING] GS-14 Die Seite erklärt die zwei Wege: Abholung im Lädeli in Rathausen (Emmen) oder Versand innerhalb der Schweiz.
- [FAILING] GS-15 Die Seite erklärt die Zahlung: Twint oder Karte, keine Rechnung; bei Abholung im Lädeli, bei Versand per Zahlungslink nach der Rückmeldung.
- [FAILING] GS-16 Die Seite sagt, dass die Bestellung erst mit der Rückmeldung des Lädeli verbindlich wird.
- [FAILING] GS-17 Im Formular hat jedes bestellbare Produkt ein Mengenfeld von 0 bis zur verfügbaren Stückzahl.
- [FAILING] GS-18 Ohne mindestens ein Produkt mit Menge 1 oder mehr lässt sich nicht bestellen; der Hinweis erscheint bei den Mengenfeldern.
- [FAILING] GS-19 Das Feld «Name» ist Pflicht.
- [FAILING] GS-20 Das Feld «Vorname» ist Pflicht.
- [FAILING] GS-21 Das Feld «E-Mail» ist Pflicht und wird auf gültiges Format geprüft.
- [FAILING] GS-22 Das Feld «Telefon» ist Pflicht und wird auf gültiges Format geprüft.
- [FAILING] GS-23 Die Auswahl «Lieferung» oder «Abholung» ist Pflicht.
- [FAILING] GS-24 Bei «Lieferung» erscheinen die Adressfelder; bei «Abholung» sind sie ausgeblendet und nicht Pflicht.
- [FAILING] GS-25 Das Feld «Strasse und Nr.» ist bei Lieferung Pflicht.
- [FAILING] GS-26 Das Feld «PLZ» ist bei Lieferung Pflicht und muss 4-stellig sein.
- [FAILING] GS-27 Das Feld «Ort» ist bei Lieferung Pflicht.
- [FAILING] GS-28 Beim Adressbereich steht «Lieferung nur innerhalb der Schweiz».
- [FAILING] GS-29 Die Auswahl der Zahlungsart «Twint» oder «Karte» ist Pflicht.
- [FAILING] GS-30 Sobald ein Wein gewählt ist, erscheint das Pflicht-Häkchen «Ich bin mindestens 16 Jahre alt»; ohne Wein erscheint es nicht.
- [FAILING] GS-31 Beim Formular steht ein Hinweis mit Link zur Datenschutzerklärung auf ssbl.ch.
- [FAILING] GS-32 Die Bestellung kommt als E-Mail bei laedeli@ssbl.ch an, mit allen Angaben der bestellenden Person.
- [FAILING] GS-33 Die bestellende Person erhält eine Bestätigungs-E-Mail: Eingang bestätigt, Übersicht ihrer Angaben, Rückmeldung des Lädeli innert 2 Arbeitstagen, noch nicht verbindlich.
- [FAILING] GS-34 Die Danke-Meldung sagt, dass eine Bestätigung per E-Mail kommt und sich das Lädeli innert 2 Arbeitstagen meldet.
- [FAILING] GS-35 Schlägt das Absenden fehl, nennt die Meldung die Telefonnummer des Lädeli und laedeli@ssbl.ch.
- [FAILING] GS-36 Ab 16.12.2026 ist das Formular automatisch ausgeblendet; stattdessen steht ein Hinweis zum Bestellschluss, die Produkte bleiben sichtbar.
- [FAILING] GS-37 Wer nach Bestellschluss eine noch offene Seite abschickt, erhält den Hinweis «Bestellschluss vorbei» statt einer Bestätigung.
- [FAILING] GS-38 Der Footer verlinkt Impressum und Datenschutz auf ssbl.ch und nennt als Kontakt laedeli@ssbl.ch und die Telefonnummer des Lädeli.
- [FAILING] GS-39 Beim Teilen auf Social Media zeigt die Vorschau ein Produktfoto und einen Titel zum Geschenkshop.
- [FAILING] GS-40 Die Seite ist unter geschenke.ssbl.ch mit sicherer Verbindung (https) erreichbar.
- [FAILING] GS-41 Bestellschluss (15.12.2026) und Lieferzeit (ca. eine Woche) stehen im Bestellbereich.
