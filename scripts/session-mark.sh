#!/usr/bin/env bash
# session-mark.sh — SessionStart-Hook. Merkt sich den Commit, auf dem die
# Sitzung begann (.claude/session-head, steht in .gitignore), damit
# stop-guard.sh am Ende weiss, ob seit Sitzungsbeginn committet wurde.
# Bei Komprimierung (compact) und Resume bleibt die Marke stehen — die Sitzung
# geht ja weiter. Gibt nichts aus: SessionStart-Ausgabe landet im Kontext.
# Startkit-Vertrag: wird vom Initializer NICHT ersetzt.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
src=""
[ -t 0 ] || src=$(sed -n 's/.*"source"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)
case "$src" in
  compact|resume) [ -f .claude/session-head ] && exit 0 ;;
esac
git rev-parse HEAD > .claude/session-head 2>/dev/null || rm -f .claude/session-head
exit 0
