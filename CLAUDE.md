# project-template (aktives Profil: landingpage-fabrik)

## Befehle

- Einzige Prüfung: `./scripts/verify.sh` (exit 0 = fertig)
- Aufgabe abschliessen: `./scripts/finish-task.sh <id> <modell> <runden> <tokens>`
  — der EINZIGE Weg. Prüft voll, setzt `status: done`, schreibt metrics.csv,
  committet. Ein blosser Commit schliesst nichts ab; bei RED ändert sich nichts.
  Modell, Runden und Tokens IMMER mitgeben: Modell = das aktive Modell,
  Runden = deine Antworten an dieser Aufgabe, Tokens = grobe Schätzung des
  Verbrauchs. Ohne sie steht in metrics.csv nur ein Strich, und das
  Meilenstein-Review (KURSANLEITUNG, Schritt 5) hat keine Zahlen.
- (weitere Befehle trägt der Initializer ein — z.B. dev, build, new)

## Nicht-offensichtliche Konventionen

- Der Nutzer ist kein Entwickler. Erkläre Entscheidungen in
  docs/state/decisions.md in Alltagssprache, nie nur im Code.
- Tech-Entscheidungen triffst du selbst; Business-Fragen (Texte, Ziel,
  Rechtliches) stellst du IMMER, bevor du rätst.
- Keine externen Dienste (Formular, Analytics) ohne Eintrag in decisions.md
  mit Kosten und Datenschutz-Folge.

## Bekannte Fallen

- (leer — wächst durch Erfahrung, nicht durch Vorhersage)

## Projektzustand

- Profil (was gebaut wird): docs/profil/ · Briefs: docs/briefs/
- Status: docs/state/features.md · Entscheidungen: docs/state/decisions.md
- Letzte Übergabe: docs/state/handoff.md
- Aufgaben: docs/tasks/ (bereit: ./scripts/next-tasks.sh)

## Sitzungsstart

- Der Projektzustand (./scripts/state-summary.sh) wird per SessionStart-Hook
  automatisch eingespielt — bei Start, /clear und nach Komprimierung. Bei
  Bedarf erneut ausführen.
- Am Ende docs/state/handoff.md aktualisieren (max. 30 Zeilen), inkl.
  Abschnitt "Für den Auftraggeber zu prüfen". Ein Stop-Hook
  (scripts/stop-guard.sh) blockiert das Sitzungsende, solange seit
  Sitzungsbeginn committet wurde, aber handoff.md unverändert ist. Reine
  Startkit-Wartung (nur scripts/, .claude/, docs/templates/, docs/profil/,
  CLAUDE.md, README.md, KURSANLEITUNG) ist davon ausgenommen.
