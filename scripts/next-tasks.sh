#!/usr/bin/env bash
# next-tasks.sh — listet bereite Aufgaben: status: todo UND jede id aus
# depends_on hat status: done. Eine Zeile pro Aufgabe:
#   READY: <id> | <titel> | <class>
# Aufgaben mit status: blocked (wartet auf Auftraggeber/IT) erscheinen nie.
# Nur bash + grep/awk/sed, keine Abhängigkeiten.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 1
ls docs/tasks/*.md >/dev/null 2>&1 || { echo "keine Aufgaben in docs/tasks/"; exit 0; }

front() { tr -d '\r' < "$1" | awk '/^---[[:space:]]*$/{n++; next} n==1'; }   # CRLF-fest
field() {   # field <datei> <name> — Wert ohne Anführungszeichen und Kommentar
  front "$1" | sed -n "s/^$2:[[:space:]]*//p" | head -n 1 \
    | sed -e 's/[[:space:]]\{1,\}#.*$//' -e 's/^"\(.*\)"$/\1/'
}

# Status aller Aufgaben einmal einsammeln: "<id> <status>"
statuses=$(for t in docs/tasks/*.md; do echo "$(field "$t" id) $(field "$t" status)"; done)
status_of() { printf '%s\n' "$statuses" | awk -v id="$1" '$1 == id {print $2; exit}'; }

found=0
for t in docs/tasks/*.md; do
  [ "$(field "$t" status)" = "todo" ] || continue
  deps=$(field "$t" depends_on | tr -d '[]"' | tr ',' ' ')
  ready=1
  for d in $deps; do
    [ "$(status_of "$d")" = "done" ] || { ready=0; break; }
  done
  [ "$ready" -eq 1 ] || continue
  echo "READY: $(field "$t" id) | $(field "$t" title) | $(field "$t" class)"
  found=1
done
[ "$found" -eq 1 ] || echo "keine bereite Aufgabe (alles erledigt, blockiert oder wartet auf Abhängigkeiten)"
exit 0
