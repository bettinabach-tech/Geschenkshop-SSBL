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
- `npm run dev` (Vorschau) · `npm run build` (nach dist/) · `npm test` ·
  `npm run new -- <slug>` (neue Seite aus docs/briefs/<slug>.md)
- `./scripts/verify.sh --quick` (Commit-Hook) · `--deep` (Browser, Lighthouse, audit)
- `./scripts/next-tasks.sh` — bereite Aufgaben

## Nicht-offensichtliche Konventionen

- Der Nutzer ist kein Entwickler. Erkläre Entscheidungen in
  docs/state/decisions.md in Alltagssprache, nie nur im Code.
- Tech-Entscheidungen triffst du selbst; Business-Fragen (Texte, Ziel,
  Rechtliches) stellst du IMMER, bevor du rätst.
- Keine externen Dienste (Formular, Analytics) ohne Eintrag in decisions.md
  mit Kosten und Datenschutz-Folge.
- Stack: Astro + TypeScript, Tests mit Vitest (.astro über astro/container).
  Seiten: `src/sites/<slug>/` (Einstellungen) + `src/pages/<slug>/`.
- Design-Skills: `fabrik-design` hat IMMER Vorrang vor allgemeinen Skills
  (z.B. `frontend-design`). Diese dürfen nur ergänzen, was fabrik-design offen
  lässt — nie andere Schriften, Farben, Buttons oder Abschnitts-Reihenfolge
  (Freigabe Auftraggeber 11.09.2026).
- Stile nur als globale CSS-Dateien in `src/styles/` (keine scoped
  `<style>`), damit Tests sie lesen können.
- Feature auf [PASSING] nur, wenn ein Test in tests/ seine ID nennt
  (verify-Stufe "features"). Browser-Tests: `tests/browser/*.spec.ts`.
- `status: blocked` = wartet auf Auftraggeber/IT (Grund im Kontext der
  Aufgabe); erst nach Lieferung auf `todo` setzen.
- `.env` existiert ggf. lokal, ist in .gitignore und wird NIE gelesen oder
  zitiert. Variablennamen stehen in `.env.example`.

## Bekannte Fallen

- `import.meta.glob` über Bilder (auch lazy) legt JEDES getroffene Original
  nach dist/ (25 MB Produktfotos). Aufräumen: Integration
  src/integrations/ungenutzte-bilder.ts; Wächter: verify-Stufe «bilder».
- Astro liefert ein Original mit aus, sobald Code eine Eigenschaft liest
  (`foto.width`) — Masse nur über `masse()` aus src/lib/fotos.ts.
- Prettier schreibt Hex-Farben in CSS klein (#005ca9) — Farbtests ohne
  Rücksicht auf Gross-/Kleinschreibung vergleichen.
- Zod v4: `.regex()` bricht die Prüfkette nicht ab; ein folgendes `.refine()`
  läuft auch bei falschem Format → `{ abort: true }` setzen.

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
