#!/usr/bin/env bash
# check-browser.sh — verify-Stufe "browser" (nur --deep), Aufgabe 004.
# Liefert dist/ lokal aus (scripts/serve-dist.mjs) und prüft jede Seite im installierten
# Edge: 375 px ohne seitliches Scrollen (F-01), Tab-Durchlauf mit sichtbarem
# Fokus (F-23), axe (keine serious/critical), Lighthouse Handy ≥ 90 je
# Kategorie (F-22, Median aus 3 Läufen), externe Links < 400.
# Dazu Selbsttests: Fixture-Seiten, an denen die Prüfungen scheitern MÜSSEN.
# Tests: tests/browser/*.spec.ts · Einstellungen: playwright.config.ts
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

if [ ! -f dist/index.html ]; then
  echo "dist/ fehlt — zuerst bauen (npm run build)."
  exit 1
fi

node_modules/.bin/playwright test
