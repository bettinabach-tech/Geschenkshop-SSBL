#!/usr/bin/env bash
# verify.sh — DIE einzige Prüfung. Stufen gemäss docs/profil/technik.md.
# Vertrag: exit 0 <=> alles bestanden. Letzte Zeile IMMER "verify: GREEN"
# oder "verify: RED". Pro Stufe "ok: <stufe>" bzw. "FAILED: <stufe>" + tail.
# Kein set -e: alle Stufen laufen durch, alle Fehler kommen auf einmal.
#
#   ./scripts/verify.sh           Standard (≤ 90 s): lint, format, tests,
#                                 typecheck, build, html, links, features
#   ./scripts/verify.sh --quick   Commit-Hook (≤ 10 s): lint, format, tests
#   ./scripts/verify.sh --deep    Standard + teure Stufen: audit, browser
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || { echo "verify: Projektwurzel nicht gefunden"; echo "verify: RED"; exit 1; }

mode=standard
case "${1:-}" in
  --quick) mode=quick ;;
  --deep) mode=deep ;;
  "") ;;
  *) echo "Aufruf: ./scripts/verify.sh [--quick|--deep]"; echo "verify: RED"; exit 1 ;;
esac

fail=0
step() {   # step <stufe> <befehl>
  local out
  if out=$(bash -c "$2" 2>&1); then
    echo "ok: $1"
  else
    fail=1
    echo "FAILED: $1"
    echo "$out" | tail -n 15
  fi
}

if [ ! -d node_modules ]; then
  echo "FAILED: setup"
  echo "node_modules fehlt — einmalig 'npm install' ausführen."
  echo "verify: RED"
  exit 1
fi

bin=node_modules/.bin

# --- schnell (auch --quick) ---
step lint "$bin/eslint . --max-warnings 0"
step format "$bin/prettier --check . --log-level warn"
step tests "$bin/vitest run --reporter=dot"

if [ "$mode" != quick ]; then
  # --- Standard ---
  step typecheck "$bin/astro check --minimumSeverity warning"
  step build "$bin/astro build --silent"
  step html "$bin/html-validate 'dist/**/*.html'"
  step links "node scripts/check-links.mjs dist"
  # Jedes Feature auf [PASSING] braucht einen Test, der seine ID nennt
  # (z.B. it(\"GS-07: ...\")). So kann niemand ein Feature ohne Beweis abhaken.
  step features "bash scripts/check-features.sh"
fi

if [ "$mode" = deep ]; then
  # --- teuer (nur --deep) ---
  step audit "npm audit --audit-level=high"
  step browser "bash scripts/check-browser.sh"
fi

if [ "$fail" -eq 0 ]; then echo "verify: GREEN"; exit 0; fi
echo "verify: RED"
exit 1
