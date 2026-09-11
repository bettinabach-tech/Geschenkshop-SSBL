---
id: 002
title: "Grundlayout mit Schrift, Farben und Kopfdaten bauen"
depends_on: [001]
features: [F-02, F-03, F-04, F-05, F-06, F-08, F-09, F-24, F-31]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/layout.test.ts"
human_review: true
class: open
---

# Kontext
Gemeinsames Grundgerüst aller Seiten. Die Skill `fabrik-design` gilt
verbindlich (Farben, Poppins, Kontrast). Die Schrift wird mitgeliefert statt
von Google geladen (decisions.md: «Schrift vom eigenen Server»). Kein Cookie,
kein Tracking (Brief: Tracking keins).

# Umfang
- `src/layouts/Seite.astro`: erhält die Site-Konfiguration (001); setzt
  `lang="de"`, charset, viewport, `<title>` = titel, meta description,
  og:title, og:description, og:image (nur wenn `adresse` und ein Bild gesetzt
  sind — dann als absolute URL), Favicon aus dem Logo (`rel="icon"`).
- Poppins 400 und 600 über `@fontsource/poppins` (lokal gebündelt).
- `src/styles/tokens.css`: `--farbe-primaer`, `--farbe-text: #1a1a1a`,
  `--farbe-hintergrund: #ffffff`, Schriftfamilie. Überschreibung der
  Primärfarbe pro Seite per Inline-Variable am `<html>`.
- `src/styles/basis.css`: Text Poppins 400 in --farbe-text, Überschriften 600.
- `src/lib/kontrast.ts`: WCAG-Kontrastverhältnis. Eine überschriebene
  Primärfarbe mit < 4.5:1 gegen Weiss bricht den Build mit klarer Meldung ab.
- Konvention (auch für alle Folgeaufgaben, steht in CLAUDE.md): Stile als
  globale CSS-Dateien unter `src/styles/`, keine scoped `<style>` in
  Komponenten — Tests lesen die CSS-Dateien.

# Nicht Teil dieser Aufgabe
- Logo im Kopf, Footer (005), Abschnitte (006/007), Bilder (008).
- Social-Media-Bild des Geschenkshops (024).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/layout.test.ts` rendert das Layout (Container-API) und prüft einzeln:
  F-24 `lang="de"` · F-08 `<title>` = titel und `rel="icon"` zeigt aufs Logo ·
  F-09 og:title, og:description und og:image (absolut) bei einer Fixture mit
  adresse und Bild · F-03 kein `src`/`href` von script, link, img, iframe zeigt
  auf eine fremde Domain (auch nicht fonts.googleapis.com / fonts.gstatic.com) ·
  F-04 kein `document.cookie`, kein Analytics-Skript im gerenderten HTML ·
  F-02 basis.css setzt Poppins mit font-weight 400 für Text und 600 für h1–h3 ·
  F-05 tokens.css enthält exakt #1a1a1a, #ffffff, #005CA9 ·
  F-31 zwei Fixture-Seiten mit anderer Primärfarbe und anderem Logo rendern je
  ihre eigenen Werte; die Geschenkshop-Seite bleibt bei #005CA9.
- F-06: Der Test MUSS für #1a1a1a/#ffffff 17.40 (±0.05) und für
  #ffffff/#005CA9 6.77 (±0.05) erwarten, und eine Überschreibung mit #7fb2e5
  MUSS abgelehnt werden. Stimmt die Rechnung nicht, die Formel korrigieren —
  NIE die Erwartung.
- Menschliche Prüfung: Schrift und Farben im Browser (npm run dev).
