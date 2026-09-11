---
id: 003
title: "Befehl «npm run new» für neue Seiten bauen"
depends_on: [001]
features: []
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/new-site.test.ts"
human_review: false
class: patterned
---

# Kontext
Standard-Befehl des Profils (technik.md): Aus einem Brief entsteht das Gerüst
einer neuen Seite. Heute ist `scripts/new-site.mjs` ein Platzhalter mit Exit 1.

# Umfang
- `scripts/new-site.mjs` (Aufruf `npm run new -- <slug>`); Logik als Funktion
  mit der Projektwurzel als Parameter, damit Tests in einem Temp-Ordner laufen.
- Prüft: slug vorhanden und gültig (Regel aus 001) · `docs/briefs/<slug>.md`
  existiert · `src/sites/<slug>/` existiert noch nicht.
- Legt an: `src/sites/<slug>/site.ts` (titel aus der ersten Zeile des Briefs
  «# Brief — <Name>») und `src/pages/<slug>/index.astro`.
- Gibt am Ende die nächsten Schritte in Alltagssprache aus (KURSANLEITUNG,
  «Weitere Seiten»).

# Nicht Teil dieser Aufgabe
- Features und Aufgaben für die neue Seite erzeugen (macht der Agent nach
  KURSANLEITUNG, nicht das Skript).
- Inhalte, Texte, Design der neuen Seite.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/new-site.test.ts` prüft einzeln: kein slug → Exit ≠ 0 mit Meldung ·
  slug «Mein Shop» → Exit ≠ 0 · Brief fehlt → Exit ≠ 0, die Meldung nennt den
  erwarteten Pfad · Ordner existiert → Exit ≠ 0 und keine Datei verändert ·
  Erfolg → beide Dateien existieren, titel aus dem Brief übernommen, die
  erzeugte site.ts besteht das Schema aus 001.
- Der Platzhalter-Text «noch nicht gebaut» ist aus scripts/new-site.mjs entfernt.
