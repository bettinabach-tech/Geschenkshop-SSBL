# Handoff — 2026-09-11

## Letzte Sitzung

- Ersten Brief per Interview erstellt und committet:
  `docs/briefs/geschenkshop-ssbl.md`. Öffentliche Bestellseite (Produkte
  ansehen, per Formular bestellen, Zahlung Twint/Karte). Interne
  Produktverwaltung bewusst als separates Folgeprojekt ausgeschlossen
  (passt nicht zu "landingpage-fabrik": braucht Login + Datenbank).

## Achtung nächste Sitzung

- Initialisierung noch NICHT ausgeführt. scripts/*.sh sind Platzhalter (exit 0).
- Zahlung per Twint/Karte braucht externen Zahlungsdienstleister —
  Kosten & Datenschutz-Folge müssen VOR Einbindung in decisions.md rein
  (siehe Hinweis im Brief).
- git push ist per deny-Regel in .claude/settings.json für den Agenten
  gesperrt (Absicht). Pushen macht der Auftraggeber selbst: "! git push".

## Für den Auftraggeber zu prüfen

- Brief gegenlesen: docs/briefs/geschenkshop-ssbl.md
- Logo/Produktfotos noch von Canto herunterladen und ablegen.
- Domain/Hosting noch offen — Entscheidung liegt beim Auftraggeber.

## Vorgeschlagene nächste Aufgabe

- Initialisierung: docs/templates/initializer-prompt.md in neuer Sitzung ausführen.
