---
id: 011
title: "Fehlerseite für falsche Adressen bauen"
depends_on: [002]
features: [F-25]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/fehlerseite.test.ts"
  - "test -f dist/404.html"
human_review: true
class: open
---

# Kontext
Wer eine falsche Adresse aufruft (Tippfehler, alter Link aus Social Media),
soll nicht auf einer leeren Browser-Fehlermeldung landen.

# Umfang
- `src/pages/404.astro` mit Seite.astro (002): Überschrift, ein Satz in
  Sie-Form, Textlink «Zur Startseite» auf `/`, `<meta name="robots" content="noindex">`.

# Nicht Teil dieser Aufgabe
- Umleitungen alter Adressen, Suchfunktion.
- Einrichtung beim Hosting-Anbieter (027).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/fehlerseite.test.ts` prüft einzeln: F-25 genau ein `<h1>` · Link mit
  Text «Zur Startseite» und href="/" · der Link hat keine Button-Klasse ·
  noindex gesetzt · lang="de".
- Menschliche Prüfung: Wortlaut.
