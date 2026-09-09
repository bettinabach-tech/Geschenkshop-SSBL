# project-template

Startkit für Projekte mit Claude Code — Zustand in Dateien, eine Prüfung,
Schichtarbeit zwischen Sitzungen. Mitgeliefertes Profil: **Landingpage-Fabrik**.

**So startest du:**

1. Oben rechts «Use this template» → «Create a new repository».
2. Dein neues Repo auf den Rechner holen (GitHub Desktop → «Clone repository»).
3. `KURSANLEITUNG.docx` lesen (Quelle: `docs/KURSANLEITUNG.md`) — sie führt dich Schritt für Schritt.

Für ein anderes Projekt als Landingpages: `docs/profil/README.md`.

Die Word-Dateien sind erzeugt, nicht handgepflegt. Quelle ist jeweils die
Markdown-Datei daneben; nach jeder Änderung dort neu erzeugen mit:

```bash
pandoc docs/KURSANLEITUNG.md --toc -o KURSANLEITUNG.docx
pandoc docs/startkit-update.md --toc -o docs/startkit-update.docx
```

---

## Scripts — Zusammenarbeit mit Claude

Dieses Projekt steuert Claude durch Bash-Scripts. Jedes Script ist ein Vertrag: Claude kann die Befehle ausführen, der Output bestimmt was passiert.

### Hauptscripts (für dich und Claude)

**`./scripts/verify.sh`** — Die einzige Prüfung  
Läuft beim Commit (Hook) und vor jeder Aufgaben-Fertigstellung. Exit-Code 0 = alles bestanden.

- Letzte Zeile ist immer `verify: GREEN` oder `verify: RED`
- Was geprüft wird: definiert in `docs/profil/technik.md` (Stack, Linter, Tests)
- **Placeholder:** Initial nur `exit 0` — der Initializer ersetzt es später durch echte Prüfungen

**`./scripts/finish-task.sh <id> <modell> <runden> <tokens>`** — Aufgaben abschliessen  
Der _einzige_ Weg, eine Aufgabe als erledigt zu markieren.

```bash
./scripts/finish-task.sh 004 opus 3 45000
```

Was es macht:

1. Vollständiges `verify.sh` ausführen
2. Alle Akzeptanz-Befehle der Aufgabe ausführen (aus dem `acceptance:`-Feld im Frontmatter)
3. Die Aufgabe mit `id: 004` in `docs/tasks/` suchen (über das Frontmatter, nicht den Dateinamen) und auf `status: done` setzen
4. Eine Zeile in `docs/state/metrics.csv` schreiben (für Statistik)
5. Alles committen

Modell, Runden und Tokens sind technisch optional — ohne sie steht in `metrics.csv` nur ein Strich. `CLAUDE.md` verlangt deshalb, sie immer mitzugeben, damit das Meilenstein-Review echte Zahlen hat.

Wenn eine Prüfung rot ist: Das Script ändert **nichts** (exit 1). Ein normaler Commit reicht nicht — nur dieser Befehl ist der Zustandsübergang.

**`./scripts/next-tasks.sh`** — Verfügbare Aufgaben  
Zeigt Tasks, deren Abhängigkeiten alle erfüllt sind (Vorlage — der Initializer macht es später intelligent).

**`./scripts/state-summary.sh`** — Projektzustand in ≤250 Token  
Läuft automatisch beim Sitzungsstart (Hook in `.claude/settings.json`). Ausgabe:

- Aktueller Branch
- Feature-Zähler (`n/m Features fertig`)
- Erste 30 Zeilen von `docs/state/handoff.md`

Dieser Output steht direkt am Anfang jeder neuen Sitzung mit Claude — er weiss sofort, wo der Stand ist.

### Schutz-Hooks (automatisch, laufen im Hintergrund)

**`bash-guard.sh`** — Blockiert unsichere Bash-Befehle  
Claude darf **nicht**:

- Hochladen: `git push`, `curl`, `wget`
- Rekursiv löschen: `rm -r…`
- Ungespeicherte Arbeit verwerfen: `git reset --hard`, `git clean -f`, `git restore`

Wenn Claude so einen Befehl versucht, blockiert das Script ihn und sagt warum. Du machst solche Befehle selbst (oder über `! befehl` im Terminal).

**`stop-guard.sh`** — Erzwingt Handoff-Übergabe  
Wenn Claude seit Sitzungsbeginn Produktarbeit committet hat, darf die Sitzung nicht enden, bis **`docs/state/handoff.md` aktualisiert ist**. Das Script blockiert das Sitzungsende und sagt:

```
Stopp blockiert: n Commit(s) seit Sitzungsbeginn.
Jetzt handoff.md aktualisieren und committen — danach beenden.
```

Vorlage: `docs/templates/handoff-template.md` (max. 30 Zeilen, inkl. «Für den Auftraggeber zu prüfen»).

Ausnahme: Commits, die **nur** Startkit-Dateien berühren (scripts/, .claude/, docs/templates/, CLAUDE.md) — dann läuft alles unangetastet.

**`commit-gate.sh`** — Prüfung vor Claudes Commits  
Läuft als PreToolUse-Hook auf Bash und wird still, wenn der Befehl kein `git commit` ist. Sonst: `./scripts/verify.sh --quick` (schnelle Stufen, ≤ 10 s). Wenn rot: Commit blockiert. Kein Git-Hook — eigene Commits im Terminal prüft er nicht.

### Wartungs-Scripts

**`session-mark.sh`** — Sitzungsanfang markieren  
Läuft als SessionStart-Hook, speichert den aktuellen Commit-Hash in `.claude/session-head` — das ist die Marke für `stop-guard.sh`, um zu erkennen, was seit der Sitzung neu committet wurde.

**`autoformat.sh`** — Code formatieren  
Läuft als PostToolUse-Hook nach jedem Edit/Write. Ruft `node_modules/.bin/prettier` für `.ts/.tsx/.js/.mjs/.astro/.css/.json` auf — bewusst ohne `npx`, damit nie ungefragt etwas aus dem Netz nachgeladen wird. Fehlt das Binary, wird nicht formatiert. Der Initializer passt die Formatter an den Stack an.

---

## Projektzustand — Dateien

- **`docs/profil/`** — _Was_ gebaut wird (Ziele, Design, technische Anforderungen)
- **`docs/briefs/`** — Aufträge an Claude (Einzelbriefe für Aufgaben)
- **`docs/state/`**
  - `features.md` — Feature-Liste (`[ ] Feature A` / `[x] Feature B`)
  - `decisions.md` — Entscheidungen und Begründungen (extern sichtbar)
  - `handoff.md` — Übergabe zwischen Sitzungen (was läuft, was der Auftraggeber prüfen soll)
  - `metrics.csv` — Aufgaben-Statistik (automatisch gefüllt von `finish-task.sh`)
- **`docs/tasks/`** — Aufgaben (je eine `.md`, Frontmatter mit Status)
- **`docs/startkit-update.md`** — wie ein Projekt spätere Verbesserungen der Vorlage nachzieht
  (Word-Fassung: `docs/startkit-update.docx`, E-Mail-Fassung: `docs/startkit-update-email.md`)

---

## Zusammenhang: Claude, Scripts, Hooks

```
Claude startet eine Sitzung
  ↓ SessionStart-Hook
  └─→ state-summary.sh → Output in seinen Kontext

Claude schreibt Code und committet
  ↓ Pre-Commit-Hook
  └─→ commit-gate.sh → verify.sh --quick
      Wenn rot: Commit blockiert

Claude beendet eine Aufgabe
  ↓ (Claude ruft auf)
  └─→ finish-task.sh <id>
      - verify.sh (voll)
      - acceptance-Befehle
      - status: done
      - metrics.csv
      - Commit

Claude versucht zu beenden
  ↓ Stop-Hook
  └─→ stop-guard.sh
      Wenn commits aber kein handoff.md: blockiert
```
