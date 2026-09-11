---
id: 007
title: "Vertrauen, Kauf-Bereich und feste Abschnittsreihenfolge bauen"
depends_on: [005, 006]
features: [F-10, F-13, F-14, F-15]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/abschnitte-unten.test.ts"
human_review: true
class: open
---

# Kontext
Skill `fabrik-design`, «Aufbau einer Seite» Punkte 3–5, Reihenfolge verbindlich.
Beim Geschenkshop bilden Produkte und Bestellformular zusammen den Kauf-Bereich
(decisions.md: «Seitenaufbau»).

# Umfang
- `src/components/Vertrauen.astro`: Titel, Text-Slot, Pflicht-Slot `bild`
  (fehlt er, wirft der Baustein).
- `src/components/KaufBereich.astro`: `id="bestellen"` (Prop, Standard
  «bestellen»), Überschrift, Inhalts-Slot; Slot `aktion` — ohne ihn wird der
  KaufButton aus 006 gerendert.
- `src/components/Landingpage.astro`: nutzt Seite.astro (002), Kopf und Footer
  (005) und rendert die Slots hero, nutzen, vertrauen, kauf IMMER in dieser
  Reihenfolge — eine Seite kann die Reihenfolge nicht ändern.

# Nicht Teil dieser Aufgabe
- Inhalte des Geschenkshops (015 ff.), Produkte (016), Formular (009/019).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/abschnitte-unten.test.ts` prüft einzeln:
  F-10 Positionen im HTML: Hero < Nutzen < Vertrauen < Kauf-Bereich < Footer,
  auch wenn die Slots in anderer Reihenfolge übergeben werden ·
  F-13 Vertrauen ohne Bild wirft, mit Bild enthält es `<img>` und Text ·
  F-14 KaufBereich ohne `aktion` enthält einen `kauf-button` ·
  F-15 in einer ganzen Fixture-Seite zeigen alle `kauf-button` auf #bestellen;
  kein anderer Link (Kopf, Footer, Text) hat eine Button-Klasse.
