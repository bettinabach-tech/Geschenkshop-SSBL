---
title: "Startkit-Update — E-Mail an die Teilnehmenden"
subtitle: "Fertiger Text zum Kopieren in den Mail-Body"
lang: de-CH
---

# Hinweise für den Versand (nicht mitschicken)

- Der Text unten ist bewusst **vollständig**. Die ausführliche Fassung
  (`docs/startkit-update.md`) erreicht die Teilnehmenden erst _mit_ dem Update —
  vorher haben sie sie ja noch nicht. Die E-Mail muss deshalb allein tragen.
- Vor dem Versand **einen Abschnitt anpassen**: «Was in diesem Update steckt».
  Dort steht, was die Teilnehmenden konkret bekommen. Den Rest können Sie
  unverändert bei jedem Update wiederverwenden.
- Als reiner Text versenden (kein HTML nötig). Der lange Befehl in Schritt 3
  muss beim Empfänger auf **einer** Zeile ankommen — prüfen Sie das in der
  Vorschau, manche Mailprogramme brechen lange Zeilen um.

---

## Ab hier kopieren

**Betreff:** Startkit-Update für Ihr Landingpage-Projekt — 5 Minuten Aufwand

Guten Tag

Ich habe die Vorlage, aus der Ihr Projekt entstanden ist, verbessert. Damit Sie
etwas davon haben, müssen Sie den neuen Stand einmal aktiv abholen. Das dauert
etwa fünf Minuten.

WAS IN DIESEM UPDATE STECKT

- Der Brief fragt jetzt genauer nach dem, woraus Ihre Seite bestehen soll.
- Die Kursanleitung erklärt das Vorgehen beim Ausfüllen des Briefs Schritt für
  Schritt.
- Aufgaben werden neu mit einem einzigen Befehl abgeschlossen, der gleich alles
  mitprüft.
- Kleinere Korrekturen an den Schutzskripten.

VORWEG: IHRE ARBEIT BLEIBT ERHALTEN

Aktualisiert werden nur die Dateien des Startkits — die Skripte, die Vorlagen,
die Kursanleitung und diese Update-Anleitung selbst. Unberührt bleiben:

- Ihre Design-Skill
- Ihre Briefs
- Ihr Projektstand und Ihre Entscheidungen
- Ihre Aufgaben
- der Code Ihrer Seiten

Warum es dafür keinen Knopf gibt: Als Sie Ihr Projekt mit «Use this template»
erstellt haben, hat GitHub bewusst keine Verbindung zur Vorlage angelegt. Ihr
Projekt weiss nichts von seiner Herkunft. Diese Verbindung stellen Sie jetzt
einmalig selbst her — beim nächsten Update entfällt der Schritt dann.

BEVOR SIE BEGINNEN

Committen Sie zuerst Ihre eigene Arbeit: GitHub Desktop öffnen, und falls dort
noch geänderte Dateien liegen, eine Nachricht schreiben, «Commit to main», dann
«Push origin». Erst danach das Update holen.

SO GEHEN SIE VOR

Vorbereitung — das Terminal öffnen:

1. GitHub Desktop öffnen.
2. Oben links bei «Current Repository» IHR Projekt auswählen (nicht
   project-template).
3. Menü «Repository» → «Open in Terminal» (Mac) bzw. «Open in Git Bash»
   (Windows).

Sie landen automatisch im richtigen Ordner. Die folgenden Befehle tippen oder
kopieren Sie dort hinein und bestätigen jeweils mit Enter.

Schritt 1 — die Vorlage als Quelle eintragen (nur beim ersten Mal):

git remote add startkit https://github.com/hwitzthum/project-template.git

Keine Rückmeldung heisst: hat geklappt. Erscheint «remote startkit already
exists», haben Sie es früher schon gemacht — einfach weiter zu Schritt 2.

Schritt 2 — den neuen Stand herunterladen:

git fetch startkit

Das lädt die Vorlage herunter, ändert an Ihren Dateien aber noch gar nichts.

Schritt 3 — die Startkit-Dateien übernehmen. Bitte kopieren statt abtippen,
der Befehl gehört auf EINE Zeile:

git checkout startkit/main -- scripts docs/templates docs/profil docs/KURSANLEITUNG.md KURSANLEITUNG.docx docs/startkit-update.md docs/startkit-update.docx docs/startkit-update-email.md README.md .gitattributes .gitignore .claude/settings.json .mcp.json

Schritt 4 — die Datei CLAUDE.md. Sie fehlt in der Liste oben mit Absicht: In
ihr stehen die Regeln, nach denen Claude in Ihrem Projekt arbeitet, und sie ist
die einzige Startkit-Datei, die im Lauf eines Projekts auch Ihre eigenen
Inhalte aufnimmt (bei der Initialisierung Ihre Projektbefehle, später die
«Bekannten Fallen»). Prüfen Sie zuerst, welcher Fall bei Ihnen zutrifft:

git log --oneline -- CLAUDE.md

Erscheint GENAU EINE Zeile, wurde die Datei nie verändert — Fall A. Erscheinen
MEHRERE Zeilen, wurde sie bearbeitet — Fall B. Mit der Taste «q» verlassen Sie
die Ansicht. Im Zweifelsfall nehmen Sie Fall B: etwas länger, aber es kann
nichts überschrieben werden.

Fall A — CLAUDE.md wurde nie verändert. Das ist der Normalfall, solange die
Initialisierung noch aussteht. Ein Befehl, fertig:

git checkout startkit/main -- CLAUDE.md

Fall B — CLAUDE.md wurde verändert. Sie brauchen beides: die neuen Regeln aus
der Vorlage und Ihre eigenen Einträge. Am einfachsten übernimmt das Claude
selbst. Starten Sie Claude Code im Projektordner und geben Sie ihm diesen
Auftrag:

Vergleiche meine CLAUDE.md mit der Fassung in startkit/main
(git diff startkit/main -- CLAUDE.md). Trage die neuen Zeilen aus dem
Startkit nach, aber verändere meine projektspezifischen Einträge nicht —
insbesondere nicht die Befehle unter «Befehle» und nichts unter «Bekannte
Fallen». Zeig mir vorher, was du ändern willst.

Lieber von Hand? Dann legen Sie sich die neue Fassung daneben:

git show startkit/main:CLAUDE.md > CLAUDE-neu.md

Nun liegen CLAUDE.md (Ihre) und CLAUDE-neu.md (die neue) im Projektordner.
Beide im Texteditor öffnen, die neuen Abschnitte übertragen, Ihre eigenen
Einträge stehen lassen. Danach die Hilfsdatei CLAUDE-neu.md wieder löschen —
sie gehört nicht ins Projekt.

Schritt 5 — prüfen und abschicken. Zurück in GitHub Desktop sehen Sie links
alle geänderten Dateien und können jede anklicken. Wenn alles gut aussieht:
Nachricht eintippen (zum Beispiel «Startkit-Update übernommen»), «Commit to
main», dann «Push origin». Fertig.

WENN ETWAS SCHIEFAUSSIEHT

Solange Sie noch nicht committet haben, setzen Sie in GitHub Desktop mit
Rechtsklick auf die Dateiliste → «Discard all changes» alles zurück und
beginnen von vorn. Es geht dabei nichts kaputt.

Nach dem Update finden Sie diese Anleitung dauerhaft in Ihrem Projekt unter
docs/startkit-update.md — beim nächsten Mal müssen Sie also nicht suchen.

Melden Sie sich, wenn etwas klemmt.

Freundliche Grüsse

## Ende des Kopierbereichs
