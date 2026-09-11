# Handoff — 2026-09-11

## Letzte Sitzung

- Ersten Brief per Interview erstellt: `docs/briefs/geschenkshop-ssbl.md`.
  Öffentliche Bestellseite (Produkte ansehen, per Formular bestellen,
  Zahlung Twint/Karte). Interne Produktverwaltung bewusst als separates
  Folgeprojekt ausgeschlossen (passt nicht zu "landingpage-fabrik":
  braucht Login + Datenbank).
- 5 Produktfotos angelegt unter `assets/products/` (Keramik-
  Pflanzenstecker, Anzündholz-Bündel, Keramik-Schalen-Set, 2x
  Klosterwein Rathausen). Noch unkomprimiert (3–8 MB je Foto) — vor
  Seitenbau verkleinern.
- Alles committet und gepusht (Login-Konflikt auf dem Rechner des
  Auftraggebers zwischen bettinabach-a11y/bettinabach-tech wurde vom
  Auftraggeber über GitHub selbst gelöst).

## Achtung nächste Sitzung

- Initialisierung noch NICHT ausgeführt. scripts/*.sh sind Platzhalter (exit 0).
- Preis und verfügbare Stückzahl pro Produkt fehlen noch (Auftraggeber:
  "kommt später") — ohne diese ist die Seite laut Brief nicht baubar
  (Pflichtfakten).
- Zahlung per Twint/Karte braucht externen Zahlungsdienstleister —
  Kosten & Datenschutz-Folge müssen VOR Einbindung in decisions.md rein.
- git push ist per deny-Regel in .claude/settings.json für den Agenten
  gesperrt (Absicht). Pushen macht der Auftraggeber selbst: "! git push".

## Für den Auftraggeber zu prüfen

- Preis und Stückzahl je der 5 Produkte liefern.
- Domain/Hosting noch offen.

## Vorgeschlagene nächste Aufgabe

- Preis/Stückzahl je Produkt einsammeln, danach Initialisierung:
  docs/templates/initializer-prompt.md in neuer Sitzung ausführen.
