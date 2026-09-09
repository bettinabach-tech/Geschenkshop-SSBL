#!/usr/bin/env bash
# stop-guard.sh — Stop-Hook. Der Agent darf die Sitzung nicht beenden, wenn
# seit Sitzungsbeginn (Marke aus session-mark.sh) committet wurde, aber
# docs/state/handoff.md weder in diesen Commits noch im Arbeitsbaum geändert
# ist. Exit 2 = Stopp blockiert, stderr geht an den Agenten (Hook-Vertrag).
# Erzwingt nur die PFLICHT, nicht den Inhalt: Den Handoff schreibt der Agent,
# weil er Urteil braucht (Fallen, was der Auftraggeber prüfen soll) — die
# mechanischen Fakten liefert state-summary.sh ohnehin.
# Wartungs-Commits sind ausgenommen: Berühren ALLE Commits seit Sitzungsbeginn
# nur Startkit-Dateien (STARTKIT unten), gab es keine Produktarbeit — dann
# bleiben die state-Dateien absichtlich unangetastet.
# stop_hook_active = wir laufen bereits wegen einer Blockade -> nicht erneut
# blockieren, sonst Endlosschleife.
# Startkit-Vertrag: wird vom Initializer NICHT ersetzt.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
input=""; [ -t 0 ] || input=$(cat)
printf '%s' "$input" | grep -Eq '"stop_hook_active"[[:space:]]*:[[:space:]]*true' && exit 0
[ -f .claude/session-head ] || exit 0
base=$(cat .claude/session-head)
git cat-file -e "$base^{commit}" 2>/dev/null || exit 0             # Marke zeigt ins Leere (Rebase, Branchwechsel)
[ -n "$(git rev-list "$base"..HEAD 2>/dev/null)" ] || exit 0        # nichts committet -> nichts zu übergeben
STARTKIT='^(scripts/|\.claude/|docs/templates/|docs/profil/|CLAUDE\.md$|README\.md$|\.gitignore$|\.gitattributes$|\.mcp\.json$|docs/KURSANLEITUNG\.md$|KURSANLEITUNG\.docx$|docs/startkit-update)'
git diff --name-only "$base" HEAD | grep -Evq "$STARTKIT" || exit 0  # nur Startkit-Dateien -> Wartung, frei
[ -z "$(git diff --name-only "$base" HEAD -- docs/state/handoff.md)" ] || exit 0
[ -z "$(git status --porcelain -- docs/state/handoff.md)" ] || exit 0
n=$(git rev-list --count "$base"..HEAD)
echo "Stopp blockiert durch scripts/stop-guard.sh: $n Commit(s) seit Sitzungsbeginn, darunter Produktarbeit, aber docs/state/handoff.md ist unverändert. Jetzt handoff.md aktualisieren (Vorlage docs/templates/handoff-template.md, max. 30 Zeilen, inkl. «Für den Auftraggeber zu prüfen») und committen — danach beenden." >&2
exit 2
