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
| Überschriften-Farbe (11.09.) | h1–h3 in SSBL-Blau, Fliesstext dunkel (Nr. 18) |
| Rangfolge Design-Skills (11.09.) | fabrik-design vor frontend-design |
| Texte Geschenkshop (11.09.) | Überschrift «Weihnachtsgeschenke, die doppelt Freude machen», Hero-Foto Pflanzenstecker, übrige Texte wie vorgeschlagen freigegeben (Aufgabe 015) |

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

### 19. Tippfehler in der Produktliste stoppen die Veröffentlichung
- **Was:** Die Produktliste wird bei jedem Bauen geprüft (Preis grösser als 0,
  mit Punkt und höchstens zwei Stellen danach; Stückzahl ganze Zahl ab 0; Foto
  vorhanden). Findet die Prüfung einen Fehler, wird nicht veröffentlicht, und
  die Meldung nennt Produkt und Feld, z.B. «Produkt anzuendholz-buendel, Feld
  preis: muss eine Zahl sein, z.B. 24.50 (mit Punkt)». Zum Lesen der Liste
  dient das kostenlose Werkzeug «yaml».
- **Warum:** Lieber keine neue Seite als eine mit falschem Preis oder
  negativer Stückzahl.
- **Folge für Sie:** Nach einer Änderung auf GitHub kurz prüfen, ob die neue
  Zahl auf der Seite erscheint. Wenn nicht, zeigt der Anbieter die
  Fehlermeldung (wo genau, klärt sich mit Aufgabe 027).

### 20. Nach dem Bauen werden ungenutzte Foto-Originale weggeräumt
- **Was:** Der Bild-Baustein erzeugt aus jedem Foto kleine Fassungen in den
  modernen Formaten AVIF und WebP (400, 800 und 1200 px breit); der Browser
  wählt die passende. Ein kleiner Aufräum-Schritt entfernt danach alle
  Original-Fotos, die keine Seite zeigt. Eine eigene Prüfung schlägt Alarm,
  wenn eine Handy-Fassung grösser als 300 KB oder irgendeine Datei grösser als
  1 MB ist.
- **Warum:** Ohne diesen Schritt hätte das Werkzeug alle Originale (25 MB)
  mitgeliefert, obwohl nie jemand sie sieht. Das kostet Speicher beim Anbieter
  und im schlimmsten Fall Ladezeit.
- **Folge für Sie:** Keine. Ein Produktfoto im Handy-Format ist ca. 10–60 KB
  gross statt 3–8 MB. Fotos weiterhin einfach in Originalgrösse liefern.

### 21. Die Bausteine halten die Design-Regeln selbst ein
- **Was:** Hero und Nutzen-Abschnitt zählen Wörter und Sätze. Hat die
  Hero-Überschrift mehr als 8 Wörter, die Unterzeile mehr als einen Satz oder
  ein Nutzen-Punkt mehr als 2 Sätze (bzw. mehr als 3 Punkte), bricht das Bauen
  mit einer Meldung ab. Abkürzungen wie «ca.» oder «z.B.» und Daten wie
  «15.12.2026» beenden keinen Satz. Fehlt im Hero das Produktfoto, ebenso.
- **Warum:** So kann keine Seite die Regeln aus Versehen brechen, auch nicht
  bei späteren Textänderungen.
- **Folge für Sie:** Wenn Sie Texte ändern und das Bauen meldet «hat 9 Wörter»,
  bitte kürzen — die Meldung nennt den betroffenen Text.

### 22. Musterseite nur in der Vorschau
- **Was:** Unter http://localhost:4321/muster/ zeigt die Vorschau
  (`npm run dev`) die Bausteine mit Mustertexten. Beim Bauen für den Anbieter
  entsteht diese Seite nicht.
- **Warum:** Sie können Aussehen und Abstände prüfen, bevor die echte Seite
  zusammengesetzt wird — ohne dass Mustertexte je öffentlich werden.
- **Folge für Sie:** Keine.

### 23. Links in Textfarbe, unterstrichen
- **Was:** Textlinks (z.B. Impressum, Datenschutz, Kontakt im Footer) erscheinen
  in der dunklen Textfarbe und unterstrichen, nicht im Standard-Blau des
  Browsers. Mit der Tab-Taste erhalten sie einen deutlichen dunklen Rahmen.
- **Warum:** Das Browser-Blau wäre eine weitere Farbe, die die Design-Regeln
  nicht vorsehen, und würde mit dem SSBL-Blau des Kauf-Buttons konkurrieren.
  Die Unterstreichung zeigt trotzdem klar: Das ist ein Link.
- **Folge für Sie:** Keine. Fehlen Impressum- oder Datenschutz-Link noch, lässt
  der Footer sie weg, statt einen leeren Link zu zeigen.

### 24. Browser-Werkzeug für Claude (Playwright MCP)
- **Was:** Claude kann über das kostenlose Microsoft-Werkzeug «Playwright MCP»
  (Version 0.0.80, eingetragen in `.mcp.json`) einen Edge-Browser steuern: die
  Vorschau öffnen, Bildschirmfotos machen, Klicks und Handy-Breite ausprobieren.
  Der Browser darf NUR die lokale Vorschau http://localhost:4321 öffnen und
  vergisst nach jeder Sitzung alles (keine Cookies, kein Verlauf).
- **Warum:** Auf Ihren Wunsch. Claude kann damit Sichtprüfungen vorbereiten,
  statt nur Code zu lesen. Die Beschränkung auf localhost erhält die Regel
  «Claude greift nicht aufs Internet zu» (KURSANLEITUNG).
- **Kosten / Datenschutz:** Keine Kosten. Beim Start lädt npm das Werkzeug
  einmalig herunter; danach läuft alles auf Ihrem Rechner. Die Besucher der
  Seite merken davon nichts — es ist nur ein Werkzeug für die Entwicklung.

### 25. Browser-Prüfungen mit dem installierten Edge (Aufgabe 004)
- **Was:** `./scripts/verify.sh --deep` öffnet jede fertige Seite in Microsoft
  Edge (unsichtbar im Hintergrund) und prüft: Handy-Breite 375 px ohne
  seitliches Scrollen, alles per Tab-Taste erreichbar mit sichtbarem Rahmen,
  Barrierefreiheit (Werkzeug «axe»), Google-Lighthouse (Handy) mit mindestens
  90 Punkten je Bereich, und ob Links auf fremde Seiten funktionieren.
  Werkzeuge: Playwright, axe-core, Lighthouse — alle kostenlos, nur auf Ihrem
  Rechner, gehören nicht zur Seite.
- **Warum Edge:** Er ist auf allen SSBL-Rechnern schon installiert; so muss
  kein zusätzlicher Browser (ca. 150 MB) heruntergeladen werden.
- **Lighthouse-Schwelle:** fest 90, wird nie gesenkt. Jede Seite wird 3-mal
  gemessen, es zählt der mittlere Wert — so kippt die Prüfung nicht wegen
  eines zufällig langsamen Moments. Stand heute: 100 in allen vier Bereichen.
- **Selbsttest:** Absichtlich fehlerhafte Testseiten (zu breit, ohne
  Fokusrahmen, mit Tastatur-Falle) müssen durchfallen. So ist bewiesen, dass
  die Prüfung Fehler wirklich findet.
- **Internet:** Nur der Link-Test fragt fremde Adressen ab, die auf der Seite
  verlinkt sind (heute: keine). Das macht das Prüfprogramm, nicht Claude.
- **Folge für Sie:** `--deep` dauert jetzt ca. 1,5 Minuten. Keine Kosten.

### 26. Fehlerseite für falsche Adressen (Aufgabe 011)
- **Was:** Wer eine falsche Adresse aufruft, sieht das SSBL-Logo, die
  Überschrift «Diese Seite gibt es leider nicht», einen erklärenden Satz und
  den Textlink «Zur Startseite», unten den Kontakt-Link. Wortlaut: Ihre
  Freigabe vom 11.09.2026 (Variante A).
- **Warum ein Textlink:** Der einzige Button jeder Seite ist der Kauf-Button.
- **Suchmaschinen:** Die Fehlerseite ist für Google gesperrt («noindex»), damit
  sie nie in Suchergebnissen erscheint. Lighthouse zieht dafür Punkte ab, weil
  es davon ausgeht, dass jede Seite gefunden werden will. Bei gesperrten Seiten
  wird darum nur dieser eine Messpunkt nicht gewertet. Die Schwelle 90 gilt
  unverändert für alles andere (Ergebnis: 100 Punkte). Ein Test stellt sicher,
  dass die Shop-Seite selbst nie gesperrt ist.
- **Folge für Sie:** «Zur Startseite» führt auf die Hauptadresse (`/`). Dass
  dort beim Anbieter der Geschenkshop erscheint, wird beim Hosting (027/028)
  eingerichtet. In der Vorschau zeigt `/` noch die interne Übersicht.

### 27. Formular-Bausteine: Hinweise am Feld, ohne neue Farbe (Aufgabe 009)
- **Was:** Alle Formulare der Fabrik bestehen aus denselben Bausteinen
  (Textfeld, Auswahl, Menge, Häkchen). Pflichtfelder tragen «*», darüber steht
  «* Pflichtfeld». Hinweise erscheinen direkt am Feld, sobald man es verlässt
  und beim Absenden, und das Formular springt zum ersten falschen Feld. Die
  Hinweistexte haben Sie am 11.09.2026 freigegeben.
- **Aussehen der Hinweise:** fett in der dunklen Textfarbe mit «⚠», das Feld
  bekommt einen dickeren Rahmen, kein Rot (Ihre Wahl vom 11.09.2026).
- **Absenden:** Der Button sperrt sich und zeigt «Wird gesendet …», so gibt es
  bei einem Doppelklick nur eine Bestellung. Klappt das Senden, erscheint der
  Danke-Text statt des Formulars. Scheitert es technisch, erscheint ein
  Hinweis mit Telefon und E-Mail, und alle Eingaben bleiben stehen.
- **Telefon:** Erlaubt sind Ziffern, Leerzeichen und + - / ( ), mindestens 9
  Ziffern. Das ist dieselbe Regel wie später auf dem Server (Aufgabe 018),
  damit der Browser nichts ablehnt, was der Server annehmen würde.
- **Folge für Sie:** Solange die Telefonnummer des Lädeli fehlt, nennt der
  Fehler-Hinweis nur die E-Mail-Adresse. Solange es keinen Empfänger gibt
  (Aufgabe 010/027), endet jedes Absenden mit diesem Hinweis. Ausprobieren
  können Sie das auf http://localhost:4321/muster/.

### 28. Bestellregeln an einer einzigen Stelle (Aufgabe 018)
- **Was:** Die Regeln einer Bestellung stehen in einer Datei
  (`src/sites/geschenkshop-ssbl/bestellregeln.ts`): mindestens ein Geschenk,
  nicht mehr als vorrätig, nichts Ausverkauftes oder «Preis folgt», Name,
  Vorname, E-Mail, Telefon, Lieferung oder Abholung, bei Lieferung Strasse,
  4-stellige PLZ und Ort, Twint oder Karte, bei Wein das Häkchen «ab 16».
  Die Hinweistexte haben Sie am 11.09.2026 freigegeben.
- **Warum:** Browser und Server prüfen mit genau denselben Regeln. So kann die
  Seite nie etwas durchlassen, das der Server danach ablehnt, oder umgekehrt.
- **Folge für Sie:** Keine. Leere Felder zeigen im Browser den allgemeinen
  Hinweis «Bitte füllen Sie dieses Feld aus.». Die genaueren Texte («Bitte
  geben Sie Ihren Vornamen an.») erscheinen, wenn der Server etwas ablehnt.

### 29. Bestellformular auf der Shop-Seite (Aufgabe 019)
- **Was:** Jedes bestellbare Produkt hat in seiner Karte ein Feld «Menge»
  (0 bis zur verfügbaren Stückzahl). Darunter folgt «Ihre Angaben»: Name,
  Vorname, E-Mail, Telefon, Lieferung per Post oder Abholung im Lädeli,
  Twint oder Karte, dann der Button «Bestellung absenden». Danach erscheint
  «Vielen Dank für Ihre Bestellung!» mit dem Hinweis auf die Bestätigung per
  E-Mail und die Rückmeldung innert 2 Arbeitstagen. Texte: Ihre Freigabe vom
  11.09.2026.
- **Warum Mengen in den Karten:** Man sieht Foto, Preis und Vorrat direkt
  neben dem Feld und kann mehrere Geschenke in einer Bestellung wählen.
- **Folge für Sie:** Solange überall «Preis folgt» steht, hat die Shop-Seite
  noch keine Mengenfelder und das Absenden meldet «Bitte wählen Sie
  mindestens ein Geschenk aus.». Sobald Preise und Stückzahlen eingetragen
  sind (Aufgabe 026), erscheinen die Felder von selbst. Adresse und
  Altersbestätigung für Wein folgen mit Aufgabe 020; vorher ist die Seite
  nicht bereit für echte Bestellungen.

### 30. Lieferadresse und Altersbestätigung nur bei Bedarf (Aufgabe 020)
- **Was:** Wählt man «Lieferung per Post», erscheint unter der Auswahl die
  «Lieferadresse» mit dem Hinweis «Lieferung nur innerhalb der Schweiz» und
  den Pflichtfeldern Strasse und Nr., PLZ (4 Ziffern) und Ort. Bei «Abholung»
  verschwindet sie wieder samt allen Hinweisen und wird nicht mitgeschickt.
  Das Häkchen «Ich bin mindestens 16 Jahre alt» erscheint vor dem Button,
  sobald ein Wein eine Menge von 1 oder mehr hat. Aufbau: Ihre Freigabe vom
  11.09.2026.
- **Verbesserung für alle Formulare:** Solange die Maustaste oder der Finger
  gedrückt ist, erscheint ein Hinweis erst nach dem Loslassen. Vorher konnte
  ein neuer Hinweis beim Verlassen eines Feldes die Seite verschieben, und der
  Klick (z.B. auf «Bestellung absenden») ging ins Leere.
- **Folge für Sie:** Keine. Die Ausweiskontrolle beim Wein macht weiterhin
  das Lädeli bei der Übergabe.

### 31. Formular-Empfänger: prüfen, per Mail weiterleiten, nichts speichern (Aufgabe 010)
- **Was:** Ein kleines Programmstück auf dem Server nimmt jede Bestellung
  entgegen. Es prüft sie mit denselben Regeln wie die Seite und schickt dann
  zwei Mails: zuerst an das Lädeli, danach die Bestätigung an die bestellende
  Person. Gespeichert wird nichts. Spam (unsichtbares Feld ausgefüllt) wird
  still verworfen, Einsendungen nach dem Bestellschluss abgelehnt,
  übergrosse Einsendungen (über 20 KB) ebenso.
- **Wenn etwas scheitert:** Kommt die Mail ans Lädeli nicht an, sieht die
  Person den Hinweis mit Telefon und E-Mail und kann es nochmals versuchen.
  Scheitert nur die Bestätigung, gilt die Bestellung trotzdem als
  eingegangen (sie liegt ja beim Lädeli); der Fehler wird ohne Personendaten
  protokolliert.
- **Werkzeug:** nodemailer (Version 10), eine kostenlose Programmbibliothek
  (freie Lizenz MIT-0) für den Versand über einen normalen Mailserver. Kein
  zusätzlicher Dienst: Die Daten gehen nur über den Mailserver, den die
  SSBL-IT bestimmt.
- **Folge für Sie:** Die Zugangsdaten (SMTP_HOST, SMTP_PORT, SMTP_USER,
  SMTP_PASS, MAIL_FROM) trägt die SSBL-IT beim Anbieter ein, nie ins Projekt.
  Fehlt etwas, nennt die Fehlermeldung nur die Namen, nie die Werte.

### 32. Bestell-Mails als reiner Text (Aufgabe 021)
- **Was:** Pro Bestellung zwei Mails: an laedeli@ssbl.ch mit allen Angaben
  (Produkte mit Menge und Einzelpreis, Summe ohne Versand, Kontakt, Lieferung
  oder Abholung, Zahlungsart, bei Wein die Altersbestätigung, Eingangszeit in
  Zürcher Zeit) und die Bestätigung an die bestellende Person. Antworten auf
  die Lädeli-Mail gehen direkt an die bestellende Person. Wortlaut: Ihre
  Freigabe vom 11.09.2026; Beispiel in `docs/state/beispiel-mails.md`.
- **Warum nur Text:** Kommt in jedem Mailprogramm gleich an, auch auf dem
  Handy, und kann nicht falsch dargestellt werden.
- **Sicherheit:** Zeilenumbrüche in Namen oder anderen Feldern werden zu
  Leerzeichen. So kann niemand über das Formular heimlich weitere Empfänger
  (z.B. «Bcc:») oder falsche Zeilen einschleusen.
- **Bestellschluss:** Wer nach dem 16.12.2026, 00:00 Uhr, eine noch offene
  Seite abschickt, erhält «Bestellschluss vorbei: Seit dem 16.12.2026 nehmen
  wir keine Bestellungen mehr an. Herzlichen Dank für Ihr Interesse!» (Ihre
  Wahl vom 11.09.2026). Die Anzeige im Formular folgt mit Aufgabe 022.
- **Folge für Sie:** Keine. Aktiv wird der Versand mit dem Anschluss an den
  Anbieter (Aufgabe 027).

### 33. Bestellschluss auf der Seite (Aufgabe 022) — und ein behobener Anzeigefehler
- **Was:** Ab 16.12.2026, 00:00 Uhr Zürcher Zeit verschwinden Formular und
  Mengenfelder von selbst; die Produkte bleiben sichtbar. An Stelle des
  Formulars steht «Der Bestellschluss war am 15.12.2026. Herzlichen Dank für
  Ihr Interesse!» (Ihre Freigabe vom 11.09.2026). Wird die Seite erst nach dem
  Schluss neu gebaut, entsteht gar kein Formular mehr. Wer eine vorher
  geöffnete Seite danach abschickt, erhält «Bestellschluss vorbei …» (Nr. 32).
- **Behobener Fehler aus 019/020:** Ausgeblendete Bereiche blieben im Browser
  sichtbar, weil eine Gestaltungsregel das Ausblenden überstimmte. Betroffen:
  Die Lieferadresse war schon beim Laden sichtbar (statt nur bei «Lieferung»),
  und nach erfolgreichem Absenden wäre das Formular neben dem Danke-Text
  stehen geblieben. Eine allgemeine Regel verhindert das jetzt; `--deep`
  prüft auf jeder Seite, dass Ausgeblendetes wirklich unsichtbar ist.
- **Folge für Sie:** Keine Handarbeit am Stichtag. Bitte bei der Sichtprüfung
  auf /muster/ nochmals kurz «Lieferung»/«Abholung» wechseln.

### 34. Hinweise zu Abholung, Versand, Zahlung und Verbindlichkeit (Aufgabe 017)
- **Was:** Im Bestellbereich, direkt unter der Überschrift und vor den
  Produkten, stehen vier kurze Punkte: Bestellschluss und Lieferzeit, Abholung
  im Lädeli oder Versand in der Schweiz, Zahlung (Twint oder Karte, keine
  Rechnung; im Lädeli bzw. per Zahlungslink) und wann die Bestellung
  verbindlich wird. Wortlaut: Ihre Freigabe vom 11.09.2026.
- **Warum dort:** Wer bestellen will, sieht die Antworten auf «Kommt es
  rechtzeitig an?» und «Wie bezahle ich?» vor der Auswahl (Einwand im Brief).
- **Bewusst weggelassen:** Versandkosten (laut Brief nicht auf der Seite),
  Adresse und Öffnungszeiten des Lädeli (noch nicht geliefert).
- **Folge für Sie:** Keine.

### 35. Social-Media-Vorschau (Aufgabe 024)
- **Was:** Wer den Link zum Geschenkshop teilt (WhatsApp, Facebook, LinkedIn
  …), sieht das Foto der Keramik-Pflanzenstecker, den Titel «Weihnachtsgeschenke
  aus der SSBL, die doppelt Freude machen» und den Text «Keramik, Anzündholz
  und Klosterwein aus der SSBL: Mit jedem Geschenk unterstützen Sie die
  Stiftung. Bestellen bis 15.12.2026.» (Ihre Wahl vom 11.09.2026). Der Titel im
  Browser-Tab bleibt, wie er ist.
- **Wie:** Das Foto wird beim Bauen automatisch auf das Vorschau-Format
  1200 × 630 Pixel zugeschnitten (unter 300 KB) und liegt unter
  `/geschenkshop-ssbl/vorschau.jpg`. Der Ausschnitt richtet sich nach dem
  Bereich mit den meisten Details. Das Werkzeug dafür («sharp») verkleinert
  schon heute alle Fotos für Astro; es ist jetzt ausdrücklich eingetragen.
  Kein externer Dienst, keine Kosten, keine Daten verlassen den Computer.
- **Warum nicht die Weinflaschen:** Hochformat-Fotos zeigen im breiten
  Vorschau-Format nur den Flaschenhals.
- **Kein Tracking:** Keine Facebook-/Instagram-Kennungen (Pixel, App-ID); ein
  Test prüft das.
- **Folge für Sie:** Die Vorschau mit Bild erscheint erst, wenn die
  Internetadresse feststeht (Aufgabe 028) — die Plattformen brauchen eine
  vollständige Adresse. Anderes Foto oder anderer Text: in
  `src/sites/geschenkshop-ssbl/site.ts` unter `vorschau`. Die Plattformen
  merken sich eine Vorschau oft tagelang; eine Änderung erscheint verzögert.

### 36. Neue Seiten per Befehl (Aufgabe 003)
- **Was:** `npm run new -- <slug>` legt aus dem Brief `docs/briefs/<slug>.md`
  zwei Dateien an: die Einstellungen (`src/sites/<slug>/site.ts`) und die
  Seite (`src/pages/<slug>/index.astro`). Er überschreibt nie etwas: Gibt es
  die Seite schon, fehlt der Brief oder ist er unvollständig, bricht er mit
  einem Hinweis ab, was zu tun ist.
- **Aus dem Brief übernommen:** der Titel (erste Zeile «# Brief — <Name>»), die
  E-Mail-Adresse bei «Wohin gehen die Daten?» (für Kontakt und Formular) und
  das Ziel als vorläufige Kurzbeschreibung für Google, die später mit Ihnen
  abgestimmt wird. Adresse, Telefon und Rechtslinks bleiben leer, bis Sie sie
  liefern; der Live-Gang-Check (`npm run check:golive -- <slug>`) meldet sie.
- **Die neue Seite zeigt vorerst nur «Diese Seite ist im Aufbau.»** und ist für
  Suchmaschinen gesperrt. So entsteht nie eine halbfertige Seite mit
  erfundenen Texten. Die Abschnitte baut Claude danach mit den Aufgaben für
  diese Seite (KURSANLEITUNG «Weitere Seiten»); der Befehl gibt am Ende die
  nächsten Schritte aus.
- **Folge für Sie:** Keine. Der Befehl erzeugt weder Aufgaben noch Texte.

### 37. Browser-Abnahme: auch aufgeklappte Formularteile geprüft (Aufgabe 029)
- **Ergebnis:** Die Shop-Seite besteht alle Browser-Prüfungen: Auf dem Handy
  (375 px) steht nichts seitlich über, alles ist per Tab-Taste mit sichtbarem
  Rahmen erreichbar, Lighthouse (Handy) gibt in allen vier Bereichen 100
  Punkte. An der Seite musste nichts geändert werden.
- **Ergänzt:** Bisher prüften die Tests nur, was beim Laden sichtbar ist. Die
  Lieferadresse (erscheint bei «Lieferung») blieb so ungeprüft. Jetzt klappt
  die Prüfung alles auf, was ein Besucher aufklappen kann, und prüft Breite
  und Tastatur ein zweites Mal. Ein Selbsttest beweist, dass sie einen Fehler
  in einem aufgeklappten Bereich findet.
- **Noch nicht im Browser geprüft:** Mengenfelder und das Häkchen «mindestens
  16» beim Wein — beides gibt es auf der echten Seite erst, wenn Preise und
  Stückzahlen eingetragen sind (Aufgabe 026). Die Prüfung erfasst sie dann von
  selbst; nach 026 `./scripts/verify.sh --deep` erneut laufen lassen.
- **Folge für Sie:** Keine.
