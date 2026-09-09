#!/usr/bin/env bash
# finish-task.sh — DER einzige Weg, eine Aufgabe abzuschliessen.
# Aufruf: ./scripts/finish-task.sh <id> [modell] [runden] [tokens]
# Feste Reihenfolge: volles verify.sh -> alle acceptance-Befehle der Aufgabe
# -> status: done -> Zeile in docs/state/metrics.csv -> Commit.
# Schlägt eine Prüfung fehl, ändert das Skript NICHTS (Exit 1).
# Ein Commit allein macht keine Aufgabe fertig — Zwischenstände sind erlaubt;
# erst dieser Befehl ist der Zustandsübergang, und er hat eine Vorbedingung.
# Nur bash + grep/awk/sed. Startkit-Vertrag: wird vom Initializer NICHT ersetzt.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || { echo "finish-task: Projektwurzel nicht gefunden" >&2; exit 1; }

id=${1:-}
[ -n "$id" ] || { echo "Aufruf: ./scripts/finish-task.sh <id> [modell] [runden] [tokens]" >&2; exit 1; }
model=${2:--}; rounds=${3:--}; tokens=${4:--}

# Aufgabe über das Frontmatter-Feld id finden, nicht über den Dateinamen.
file=$(grep -l -E "^id:[[:space:]]*\"?${id}\"?[[:space:]]*$" docs/tasks/*.md 2>/dev/null | head -n 1)
[ -n "$file" ] || { echo "finish-task: keine Aufgabe mit id: $id in docs/tasks/" >&2; exit 1; }

front() { awk '/^---[[:space:]]*$/{n++; next} n==1' "$file"; }
field() {   # field <name> — Wert ohne Anführungszeichen und ohne Kommentar
  front | sed -n "s/^$1:[[:space:]]*//p" | head -n 1 \
    | sed -e 's/[[:space:]]\{1,\}#.*$//' -e 's/^"\(.*\)"$/\1/'
}
status=$(field status); title=$(field title); class=$(field class); review=$(field human_review)
[ "$status" != "done" ] || { echo "finish-task: $id ist bereits done ($file)" >&2; exit 1; }

# Prüfungen: alle durchlaufen, alle Fehler auf einmal melden (kein set -e).
fail=0
step() {   # step <bezeichnung> <befehl>
  local out
  if out=$(bash -c "$2" 2>&1); then echo "ok: $1"
  else fail=1; echo "FAILED: $1"; echo "$out" | tail -n 15; fi
}
step "verify.sh (voll)" "./scripts/verify.sh"
while IFS= read -r cmd; do
  [ -n "$cmd" ] && [ "$cmd" != "./scripts/verify.sh" ] && step "acceptance: $cmd" "$cmd"
done < <(front | awk '/^acceptance:/{a=1; next}
                       a && /^[[:space:]]+-[[:space:]]/{sub(/^[[:space:]]+-[[:space:]]*/,""); print; next}
                       a && !/^[[:space:]]/{a=0}' | sed 's/^"\(.*\)"$/\1/')
if [ "$fail" -ne 0 ]; then
  echo "finish-task: RED — nichts geändert. Beheben, dann erneut ausführen." >&2
  echo "verify: RED"; exit 1
fi

# Zustandsübergang: nur die status-Zeile im Frontmatter anfassen.
tmp=$(mktemp) || exit 1
awk '/^---[[:space:]]*$/{n++} n==1 && /^status:/{print "status: done"; next} {print}' "$file" > "$tmp" \
  && mv "$tmp" "$file"
printf '%s,%s,%s,%s,%s,%s,%s\n' "$id" "${class:--}" "$model" "$rounds" "$tokens" done "$(date +%F)" \
  >> docs/state/metrics.csv

git add -A
git status --short
git commit -q -m "task $id: $title" || { echo "finish-task: Commit fehlgeschlagen — status/metrics sind geändert, aber nicht committet" >&2; exit 1; }
echo "done: $id — $title"
[ "$review" = "true" ] && echo "human_review: true — in docs/state/handoff.md unter «Für den Auftraggeber zu prüfen» eintragen, was und wo (URL/Pfad) zu prüfen ist."
echo "verify: GREEN"
exit 0
