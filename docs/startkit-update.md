---
title: "Startkit-Update holen"
subtitle: "Wie Sie Verbesserungen der Vorlage in Ihr eigenes Projekt übernehmen"
lang: de-CH
---

# Worum es geht

Ihr Projekt ist aus der Vorlage **project-template** entstanden. Diese Vorlage wird weiterentwickelt: bessere Skripte, klarere Anleitung, schärfere Fragen im Brief. Diese Anleitung zeigt, wie Sie den neuen Stand in Ihr eigenes Projekt übernehmen — ohne Ihre eigene Arbeit zu verlieren.

Dauer: etwa fünf Minuten. Sie tippen fünf Befehle ab, den Rest erledigen Sie in GitHub Desktop.

## Warum es dafür keinen Knopf gibt

Als Sie Ihr Projekt mit **«Use this template»** erstellt haben, hat GitHub bewusst _keine_ Verbindung zur Vorlage angelegt. Ihr Projekt ist eine eigenständige Kopie und weiss nichts von seiner Herkunft. Deshalb gibt es in GitHub Desktop auch keinen Knopf «Update von der Vorlage holen».

Sie stellen diese Verbindung einmalig selbst her. Danach sind es bei jedem weiteren Update nur noch zwei Befehle.

## Bevor Sie beginnen

**Committen Sie zuerst Ihre eigene Arbeit.** Öffnen Sie GitHub Desktop, und wenn dort noch geänderte Dateien liegen: Commit-Nachricht schreiben, **Commit to main**, **Push origin**. Erst danach das Update holen.

Grund: Solange Ihre Arbeit nicht committet ist, kann sie beim Aufräumen versehentlich verloren gehen. Committet ist sie sicher.

## Was aktualisiert wird — und was bleibt

| Wird auf den neuen Stand gebracht                | Bleibt unberührt                                |
| ------------------------------------------------ | ----------------------------------------------- |
| `scripts/` — die Prüf- und Schutzskripte         | `.claude/skills/` — **Ihre Design-Skill**       |
| `.claude/settings.json`, `.mcp.json` — Konfig    | `docs/briefs/` — Ihre Briefs                    |
| `docs/templates/`, `docs/profil/` — die Vorlagen | `docs/state/` — Projektstand und Entscheidungen |
| `docs/KURSANLEITUNG.md`, `KURSANLEITUNG.docx`    | `docs/tasks/` — Ihre Aufgaben                   |
| `README.md`, `.gitattributes`, `.gitignore`      | Ihr Seiten-Code                                 |
| `docs/startkit-update.*` — diese Anleitung       | `CLAUDE.md` — je nach Fall, siehe Schritt 4     |

**Ihre Design-Skill ist sicher.** Sie liegt in `.claude/skills/fabrik-design/SKILL.md`. Diese Datei kommt in der Vorlage gar nicht vor, und die Befehle unten überschreiben ausschliesslich Dateien, die es in der Vorlage auch wirklich gibt. Gelöscht wird dabei nie etwas.

# Vorbereitung: Das Terminal öffnen

1. GitHub Desktop öffnen.
2. Oben links bei **«Current Repository»** Ihr eigenes Projekt auswählen — nicht `project-template`.
3. Menü **«Repository» → «Open in Terminal»** (Mac) bzw. **«Open in Git Bash»** (Windows).

Sie landen automatisch im richtigen Ordner. Zur Kontrolle tippen Sie:

```
git remote -v
```

Dort muss der Name **Ihres** Projekts stehen. Steht dort `project-template`, sind Sie im falschen Repo — zurück zu Punkt 2.

# Schritt 1: Die Vorlage als Quelle eintragen

Nur beim allerersten Mal nötig.

```
git remote add startkit https://github.com/hwitzthum/project-template.git
```

Keine Rückmeldung bedeutet: hat geklappt. Erscheint `remote startkit already exists`, haben Sie es früher schon gemacht — gehen Sie einfach weiter zu Schritt 2.

«startkit» ist dabei nur ein Spitzname für die Vorlage. Sie können ihn frei wählen, müssen ihn dann aber in den folgenden Befehlen ebenfalls anpassen.

# Schritt 2: Den neuen Stand herunterladen

```
git fetch startkit
```

Das lädt die aktuelle Vorlage herunter. An Ihren Dateien ändert sich dabei noch **nichts**.

# Schritt 3: Die Startkit-Dateien übernehmen

Diesen Befehl am besten kopieren statt abtippen — er ist lang und muss auf **einer** Zeile stehen:

```
git checkout startkit/main -- scripts docs/templates docs/profil docs/KURSANLEITUNG.md KURSANLEITUNG.docx docs/startkit-update.md docs/startkit-update.docx docs/startkit-update-email.md README.md .gitattributes .gitignore .claude/settings.json .mcp.json
```

Jetzt sind diese Dateien auf dem neuen Stand. Ihre Briefs, Ihr Projektstand, Ihre Aufgaben und Ihr Seiten-Code sind nicht angefasst worden.

Beachten Sie: `.claude/skills/` steht bewusst nicht in der Liste. Der Ordner mit Ihrer Design-Skill wird von diesem Befehl nicht einmal berührt.

# Schritt 4: `CLAUDE.md` — zwei mögliche Fälle

`CLAUDE.md` fehlt in der Liste oben mit Absicht. In dieser Datei stehen die Regeln, nach denen Claude in Ihrem Projekt arbeitet. Sie ist die einzige Startkit-Datei, die im Lauf eines Projekts auch **Ihre** Inhalte aufnimmt: Bei der Initialisierung trägt Claude dort Ihre Projektbefehle ein (`dev`, `build`, `new`), und beim Meilenstein-Review kommen «Bekannte Fallen» dazu.

Ist das bei Ihnen noch nicht passiert, ist Ihre `CLAUDE.md` unverändert die alte Fassung der Vorlage — dann können Sie die neue einfach übernehmen.

## Welcher Fall trifft auf Sie zu?

```
git log --oneline -- CLAUDE.md
```

- **Genau eine Zeile** (der erste Commit, mit dem Ihr Projekt entstanden ist) → `CLAUDE.md` wurde seither nie verändert → **Fall A**.
- **Mehrere Zeilen** → die Datei wurde bearbeitet → **Fall B**.

Mit der Taste `q` verlassen Sie die Ansicht. Dasselbe sehen Sie in GitHub Desktop unter **«History»**: Taucht `CLAUDE.md` dort in mehr als einem Eintrag auf, sind Sie in Fall B.

Im Zweifelsfall nehmen Sie Fall B. Der Weg dauert ein paar Minuten länger, kann aber nichts überschreiben.

Voraussetzung ist, dass Sie wie oben beschrieben zuerst Ihre Arbeit committet haben. `git log` kennt nur Gespeichertes — eine Änderung, die noch nicht committet ist, taucht dort nicht auf.

## Fall A: `CLAUDE.md` wurde nie verändert

Der Normalfall, solange die Initialisierung noch aussteht. Ein Befehl, fertig:

```
git checkout startkit/main -- CLAUDE.md
```

Weiter zu Schritt 5.

## Fall B: `CLAUDE.md` wurde verändert

Sie brauchen beides: die neuen Regeln aus der Vorlage **und** Ihre eigenen Einträge. Zwei Wege führen dahin.

**Weg 1 — Claude erledigt es (empfohlen).** Starten Sie Claude Code im Projektordner und geben Sie ihm diesen Auftrag:

> Vergleiche meine CLAUDE.md mit der Fassung in startkit/main (`git diff startkit/main -- CLAUDE.md`). Trage die neuen Zeilen aus dem Startkit nach, aber verändere meine projektspezifischen Einträge nicht — insbesondere nicht die Befehle unter «Befehle» und nichts unter «Bekannte Fallen». Zeig mir vorher, was du ändern willst.

**Weg 2 — von Hand, mit beiden Fassungen nebeneinander.** Legen Sie die neue Fassung als zusätzliche Datei ab:

```
git show startkit/main:CLAUDE.md > CLAUDE-neu.md
```

Jetzt liegen im Projektordner `CLAUDE.md` (Ihre Fassung) und `CLAUDE-neu.md` (die neue) nebeneinander. Öffnen Sie beide in einem Texteditor, übertragen Sie die neuen Abschnitte in Ihre `CLAUDE.md` und lassen Sie Ihre eigenen Einträge stehen.

**Die Hilfsdatei danach unbedingt löschen** — sie gehört nicht ins Projekt:

```
rm CLAUDE-neu.md
```

Oder einfach im Finder bzw. Explorer löschen. Wenn `CLAUDE-neu.md` in GitHub Desktop noch in der Dateiliste auftaucht, ist sie noch da.

# Schritt 5: Prüfen und abschicken

Zurück in GitHub Desktop. Links sehen Sie jetzt alle geänderten Dateien und können jede einzeln anklicken, um zu sehen, was sich ändert.

**Schauen Sie sich `.claude/settings.json` besonders an.** Falls Sie dort eigene Berechtigungen ergänzt hatten, wären die jetzt überschrieben. Wenn Ihnen etwas fehlt: Rechtsklick auf genau diese eine Datei → **«Discard changes»**. Dann bleibt Ihre Fassung erhalten, alles andere wird trotzdem aktualisiert.

Wenn alles gut aussieht:

1. Unten links eine Nachricht eintippen, zum Beispiel `Startkit-Update von der Vorlage übernommen`
2. **«Commit to main»** klicken
3. Oben **«Push origin»** klicken

Fertig.

# Wenn etwas schiefaussieht

Solange Sie noch **nicht** committet haben, können Sie in GitHub Desktop mit Rechtsklick auf die Dateiliste → **«Discard all changes»** alles zurücksetzen und von vorn beginnen. Nichts geht kaputt.

Das ist auch der Grund, warum Sie oben zuerst Ihre eigene Arbeit committen sollten: «Discard all changes» wirft alles Ungespeicherte weg, nicht nur das Update.

# Beim nächsten Mal

Schritt 1 entfällt — die Verbindung bleibt bestehen. Es bleiben:

```
git fetch startkit
git checkout startkit/main -- scripts docs/templates docs/profil docs/KURSANLEITUNG.md KURSANLEITUNG.docx docs/startkit-update.md docs/startkit-update.docx docs/startkit-update-email.md README.md .gitattributes .gitignore .claude/settings.json .mcp.json
```

Für `CLAUDE.md` sind Sie ab der Initialisierung dauerhaft in **Fall B** — behandeln Sie die Datei künftig immer nach Schritt 4, Fall B.

Danach wie gewohnt in GitHub Desktop prüfen, committen, pushen.
