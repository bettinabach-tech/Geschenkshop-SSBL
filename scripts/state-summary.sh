#!/usr/bin/env bash
# state-summary.sh — Projektzustand in ≤ 250 Tokens. Läuft automatisch als
# SessionStart-Hook (.claude/settings.json): Die Ausgabe landet direkt im
# Kontext der neuen Sitzung — auch nach /clear und nach jeder Komprimierung.
# Obergrenze PRO ABSCHNITT (kein globales Abschneiden):
#   git 1 Zeile · Scoreboard 1 Zeile · max. 8 FAILING des aktuellen
#   Meilensteins (je max. 90 Zeichen) · handoff.md (max. 30 Zeilen) ·
#   Verify-Urteil 1 Zeile.
# Nur bash + git/grep/sed/awk.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0

# --- git ---
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '-')
dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
last=$(git log -1 --format='%h %s' 2>/dev/null | cut -c1-70)
echo "git: $branch | uncommitted: $dirty | letzter Commit: ${last:--}"

# --- Scoreboard ---
f=docs/state/features.md
if [ -f "$f" ]; then
  pass=$(grep -c '^- \[PASSING\]' "$f")
  fail=$(grep -c '^- \[FAILING\]' "$f")
  echo "features: $pass/$((pass + fail)) passing"

  # --- FAILING im aktuellen Meilenstein ---
  ms=$(head -n 1 docs/state/current-milestone 2>/dev/null)
  if [ -n "$ms" ]; then
    open=$(awk -v ms="$ms" '$0 == ms {on=1; next} /^## / {on=0} on && /^- \[FAILING\]/' "$f")
    n=$(printf '%s' "$open" | grep -c . || true)
    echo "Meilenstein ${ms#\#\# }: $n offen$([ "$n" -gt 8 ] && echo ' (erste 8)')"
    printf '%s\n' "$open" | head -n 8 | sed 's/^- \[FAILING\] /  /' | cut -c1-90
  fi
else
  echo "features: $f fehlt"
fi

# --- Handoff ---
echo "--- handoff ---"
if [ -f docs/state/handoff.md ]; then
  head -n 30 docs/state/handoff.md
  [ "$(wc -l < docs/state/handoff.md)" -gt 30 ] && echo "(handoff.md > 30 Zeilen — gekürzt; bitte straffen)"
else
  echo "(kein handoff.md)"
fi

# --- Verify ---
echo "--- verify --quick: $(./scripts/verify.sh --quick 2>&1 | tail -n 1)"
