# Entscheidungen

<!-- Jede Tech-Entscheidung: Was / Warum in Alltagssprache / Folge für den Auftraggeber.
     Wird bei der Initialisierung gefüllt und danach bei jeder neuen Entscheidung ergänzt. -->

## Ihre Entscheide aus der Initialisierung (11.09.2026)

Zur Nachvollziehbarkeit — diese hat der Auftraggeber getroffen, nicht der Agent:

| Frage | Entscheid |
| --- | --- |
| Zahlung | Nicht auf der Seite. Im Formular nur Twint/Karte wählen; Abholung: Zahlung im Lädeli; Versand: Zahlungslink vom Lädeli nach Rückmeldung |
| Mehrere Produkte | Ja, jedes mit Stückzahl, in einer Bestellung |
| Stückzahl aktuell halten | Von Hand, in einer Liste im Browser auf GitHub |
| Ausverkauft | Bleibt sichtbar mit «ausverkauft», nicht bestellbar |
| Nach Bestellschluss (ab 16.12.2026) | Formular verschwindet automatisch, Hinweis erscheint |
| Nach Weihnachten | Seite bleibt mit Hinweis stehen |
| Versand der Bestellung scheitert | Fehlermeldung mit Telefon + E-Mail, Eingaben bleiben stehen |
| Doppelte Bestellung | Doppelklick sperren, Rest sortiert das Lädeli von Hand |
| Falsche Eingaben | Hinweis direkt am Feld, vor dem Absenden |
| Anbieter für Seite und Bestellweg | Gibt die SSBL-IT vor |
| Datenschutzerklärung | Die SSBL ergänzt ihre Erklärung auf ssbl.ch; die Seite verlinkt |
| Wein | Häkchen «mind. 16 Jahre» nur, wenn Wein gewählt ist |
| Vertrauens-Abschnitt | Eine gemeinsame Geschichte über Werkstätten und Menschen, mit Foto |
| Bestätigungs-E-Mail | Eingang + Übersicht + Rückmeldung innert 2 Arbeitstagen, noch nicht verbindlich |
| Internetadresse | geschenke.ssbl.ch (Eintrag durch die SSBL-IT) |
| Lieferung | Nur Schweiz |

## Technische Entscheidungen des Agenten

### 1. Grundgerüst: Astro (Node.js)
- **Was:** Die Seiten entstehen mit dem kostenlosen Werkzeug «Astro». Es erzeugt
  aus unseren Bausteinen fertige, einfache Webseiten-Dateien.
- **Warum:** Eine Landingpage braucht keinen laufenden Server und keine
  Datenbank. Fertige Dateien sind schnell, sicher und überall günstig zu betreiben.
- **Folge für Sie:** Keine Lizenzkosten. Die Seite läuft bei praktisch jedem
  Anbieter, den die IT wählt.

### 2. Mehrere Seiten in einem Projekt
- **Was:** Jede Landingpage hat einen eigenen Ordner mit ihren Einstellungen
  (Titel, Farben, Logo, Kontakt, Formular-Empfänger). Alle Seiten teilen
  dieselben Bausteine und Design-Regeln.
- **Warum:** So entsteht die nächste Seite schnell aus einem neuen Brief
  (`npm run new`), und eine Verbesserung an einem Baustein hilft allen Seiten.
- **Folge für Sie:** Keine. Jede Seite bekommt ihre eigene Adresse beim Anbieter.

### 3. Schrift vom eigenen Server
- **Was:** Die Schrift Poppins wird mit der Seite mitgeliefert, statt sie bei
  Google abzurufen.
- **Warum:** Beim Abruf von Google würde jede Besucherin ihre Internet-Adresse
  an Google senden. Das ist datenschutzrechtlich heikel und unnötig.
- **Folge für Sie:** Keine Kosten (freie Lizenz), kein Hinweis in der
  Datenschutzerklärung nötig.

### 4. Keine Cookies, kein Tracking, keine eingebundenen fremden Dienste
- **Was:** Die Seite lädt nichts von fremden Firmen (keine Schriften, keine
  Videos, keine Statistik, keine Social-Media-Knöpfe).
- **Warum:** Brief: kein Tracking. Ohne Cookies braucht es kein Cookie-Banner.
- **Folge für Sie:** Sie sehen keine Besucherstatistik. Erfolg messen Sie an
  den Bestellungen im Postfach des Lädeli.

### 5. Produktliste als einfache Textdatei
- **Was:** Namen, Preise und Stückzahlen stehen in einer einfachen Liste
  (`src/sites/geschenkshop-ssbl/produkte.yaml`). Oben in der Datei steht, wie
  man sie im Browser auf GitHub ändert.
- **Warum:** Ihr Entscheid «von Hand nachführen». Eine Datenbank wäre teurer
  und passt nicht zur landingpage-fabrik.
- **Folge für Sie:** Nach Bestellungen muss jemand die Stückzahl ändern. Die
  Seite zeigt die neue Zahl, sobald der Anbieter sie veröffentlicht hat
  (meist wenige Minuten). Die Zahl kann kurz hinterherhinken — das Lädeli
  bestätigt jede Bestellung ohnehin selbst.

### 6. Fehlende Preise ergeben «Preis folgt» statt erfundener Werte
- **Was:** Solange Preis oder Stückzahl eines Produkts fehlen, zeigt die Seite
  «Preis folgt», und das Produkt ist nicht bestellbar.
- **Warum:** So kann weitergebaut werden, ohne dass je ein erfundener Preis
  sichtbar wird.
- **Folge für Sie:** Vor dem Live-Gang prüft ein eigener Check
  (`npm run check:golive -- geschenkshop-ssbl`), dass alles da ist. Er listet
  jede Lücke in Alltagssprache auf.

### 7. Bestellungen werden per E-Mail weitergeleitet, nie gespeichert
- **Was:** Ein kleines Programmstück nimmt die Bestellung entgegen, prüft sie
  und verschickt zwei E-Mails: eine an laedeli@ssbl.ch, eine Bestätigung an
  die bestellende Person. Es speichert nichts.
- **Warum:** Kein Speicher = keine Datenbank, die geschützt, gesichert und
  gelöscht werden muss. Die Bestellungen liegen dort, wo das Lädeli ohnehin
  arbeitet: im Postfach.
- **Folge für Sie:** Die Aufbewahrungsdauer bestimmt die SSBL für das Postfach
  des Lädeli (gehört in die Datenschutzerklärung auf ssbl.ch).

### 8. Anbieterneutral bauen, bis die IT entschieden hat
- **Was:** Das Programmstück aus Punkt 7 verschickt die Mails über einen
  normalen Mailserver (SMTP) — die Art Zugang, die jede IT anbieten kann
  (z.B. Microsoft 365, Infomaniak). Der Anschluss an den Anbieter ist eine
  dünne, austauschbare Datei (Aufgabe 027).
- **Warum:** Ihr Entscheid «Vorgabe der SSBL-IT». So kann alles andere
  weitergebaut werden, bis die Antwort da ist.
- **Folge für Sie:** Die IT muss liefern: (a) Anbieter für Seite und
  Programmstück, (b) Mailserver-Zugang mit freigegebener Absenderadresse,
  (c) den Adress-Eintrag für geschenke.ssbl.ch. Kosten und Datenschutz-Folge
  werden eingetragen, sobald der Anbieter feststeht — vor der Einbindung.
  Passwörter stehen nie im Projekt, nur beim Anbieter (Vorlage: `.env.example`).

### 9. Spam-Schutz ohne Captcha
- **Was:** Das Formular hat ein unsichtbares Feld. Menschen sehen es nicht,
  automatische Spam-Programme füllen es aus — solche Einsendungen werden still
  verworfen.
- **Warum:** Captchas (z.B. Google reCAPTCHA) senden Daten an Dritte und
  nerven Besucher.
- **Folge für Sie:** Keine Kosten. Einzelne Spam-Bestellungen können
  durchrutschen; das Lädeli löscht sie.

### 10. Bestellschluss nach Zürcher Zeit, doppelt abgesichert
- **Was:** Ab 16.12.2026, 00:00 Uhr Zürcher Zeit, blendet die Seite das
  Formular aus. Zusätzlich lehnt das Programmstück späte Bestellungen ab.
- **Warum:** Wer die Seite vor Mitternacht geöffnet und erst danach abgeschickt
  hat, soll trotzdem nicht durchrutschen.
- **Folge für Sie:** Keine Handarbeit am Stichtag.

### 11. Seitenaufbau: Produkte und Formular bilden den Kauf-Bereich
- **Was:** Die Design-Regeln schreiben die Reihenfolge Hero → Nutzen →
  Vertrauen → Kauf-Wiederholung → Footer vor. Produktkarten und Bestellformular
  stehen gemeinsam im Kauf-Bereich (Abschnitt 4); der Kauf-Button oben springt dorthin.
- **Warum:** So bleibt die verbindliche Reihenfolge gewahrt, und Auswählen und
  Bestellen geschieht an einer Stelle.
- **Folge für Sie:** Die Produkte stehen erst nach dem Vertrauens-Abschnitt.
  Ein Produktfoto ist bereits im Hero sichtbar. Wenn Ihnen das nicht gefällt:
  sagen, dann passen wir die Design-Regeln bewusst an.

### 12. Fotos werden beim Bauen automatisch verkleinert
- **Was:** Die Originalfotos (3–8 MB) bleiben unverändert im Projekt. Beim
  Bauen entstehen kleine, moderne Fassungen in passenden Grössen.
- **Warum:** Handy-Besucher aus Social Media sollen nicht Megabytes laden.
  Eine Prüfung schlägt Alarm, wenn ein Handy-Bild grösser als 300 KB wird.
- **Folge für Sie:** Neue Fotos einfach in Originalgrösse liefern.

### 13. Prüfwerkzeuge
- **Was:** `./scripts/verify.sh` prüft bei jeder Änderung: Programmierfehler
  (ESLint, TypeScript), einheitliche Schreibweise (Prettier), Tests (Vitest),
  Bauen, gültiges HTML inkl. Barrierefreiheits-Regeln (html-validate),
  kaputte Links (eigenes Skript) und dass jedes abgehakte Feature einen Test hat.
  `--deep` prüft zusätzlich im echten Browser (Lighthouse, Handy-Breite,
  Tastatur) und Sicherheitslücken in Bausteinen (npm audit).
- **Warum:** So kann nichts als «fertig» gelten, das nicht bewiesen ist.
- **Folge für Sie:** Keine Kosten. `--deep` ist bis Aufgabe 004 absichtlich
  rot — eine nicht eingerichtete Prüfung gilt nicht als bestanden.

### 14. Aufgaben mit «status: blocked»
- **Was:** Aufgaben, die auf Sie oder die IT warten, tragen `status: blocked`
  und erscheinen nicht in der Liste der bereiten Aufgaben.
- **Warum:** Sonst würde ein Agent sie anfangen und müsste raten.
- **Folge für Sie:** Wenn Sie etwas liefern, sagen Sie es in der nächsten
  Sitzung; der Agent stellt die Aufgabe dann auf `todo`.

### 15. Design-Regeln
- **Was:** Die Skill `.claude/skills/fabrik-design/SKILL.md` ist verbindlich.
  Es fehlte keine Skill, die das Profil vorsieht — kein Ersatz-Standard nötig.
- **Folge für Sie:** Änderungen an Farben, Schrift oder Aufbau gehen über diese
  Datei, nicht über einzelne Seiten.

### 16. Farbe pro Seite nur, wenn die Schrift darauf lesbar bleibt
- **Was:** Jede Seite kann in ihren Einstellungen eine eigene Hauptfarbe (für
  den Kauf-Button) wählen. Beim Bauen wird nachgerechnet, ob weisse Schrift auf
  dieser Farbe gut lesbar ist (Kontrast mind. 4.5:1). Ist sie zu hell, bricht
  das Bauen mit einer Meldung ab, die den gemessenen Wert nennt.
- **Warum:** Design-Regel «Kontrast mind. 4.5:1». Eine zu helle Farbe fällt
  am Bildschirm oft nicht auf, für Menschen mit Sehschwäche ist der Button dann
  aber kaum lesbar.
- **Folge für Sie:** Der Geschenkshop nutzt das SSBL-Blau #005CA9 (6.77:1). Eine
  zu helle Farbe kann gar nicht erst online gehen.

### 17. Logo als Browser-Symbol, nur SVG/PNG direkt in assets/
- **Was:** Das Logo aus den Einstellungen erscheint auch als kleines Symbol im
  Browser-Tab. Logos liegen als .svg oder .png direkt im Ordner `assets/`.
- **Warum:** Beim ersten Versuch hat das Werkzeug alle Bilder in `assets/`
  mitgeliefert, auch die ungenutzten Produktfotos (25 MB). Mit der engeren
  Regel liefert die Seite nur, was sie wirklich braucht (ca. 45 KB).
- **Folge für Sie:** Keine. Ein neues Logo für eine andere Seite einfach als
  SVG oder PNG in `assets/` legen.

### 18. Überschriften in SSBL-Blau (Ihr Entscheid, 11.09.2026)
- **Was:** Titel und Zwischentitel erscheinen im SSBL-Blau #005CA9, der
  Fliesstext bleibt dunkel (#1a1a1a). Die Design-Regeln (Skill) sind entsprechend
  angepasst und gelten für alle Seiten.
- **Warum:** Wunsch des Auftraggebers nach der Sichtprüfung. Nur die
  Überschriften, damit längere Texte gut lesbar bleiben und der blaue
  Kauf-Button sich noch abhebt.
- **Folge für Sie:** Blau auf Weiss hat einen Kontrast von 6.77:1, also gut
  lesbar. Wählt eine andere Seite eine eigene Hauptfarbe, werden auch ihre
  Überschriften in dieser Farbe gezeigt; zu helle Farben lehnt die Prüfung ab.
