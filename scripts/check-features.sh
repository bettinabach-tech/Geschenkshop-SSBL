#!/usr/bin/env bash
# check-features.sh — verify-Stufe "features". Jedes Feature, das in
# docs/state/features.md auf [PASSING] steht, muss in mindestens einem Test
# unter tests/ mit seiner ID vorkommen (z.B. it("GS-07: Preis in CHF", ...)).
# Ohne Test kein PASSING — sonst wäre das Abhaken nur eine Behauptung.
# Nur bash + grep/sed.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 1
f=docs/state/features.md
[ -f "$f" ] || { echo "check-features: $f fehlt"; exit 1; }
missing=0
while IFS= read -r id; do
  if ! grep -rqE "(^|[^A-Za-z0-9-])${id}([^0-9]|$)" tests/ 2>/dev/null; then
    echo "PASSING ohne Test: $id (kein Test in tests/ nennt diese ID)"
    missing=1
  fi
done < <(sed -n 's/^- \[PASSING\] \([A-Z]\{1,4\}-[0-9]\{2,3\}\).*/\1/p' "$f")
exit "$missing"
