# Handoff — 2026-09-09

## Letzte Sitzung

- Design-Regeln per Interview erstellt und gespeichert:
  `.claude/skills/fabrik-design/SKILL.md`. Enthält CTA, Farben (mit
  Kontrastprüfung), Schrift, Tonalität, Seitenaufbau, Logo-Pfad
  (`assets/SSBL_Logo.svg`). Kein Commit ausgeführt.

## Achtung nächste Sitzung

- Initialisierung noch NICHT ausgeführt. scripts/*.sh sind Platzhalter (exit 0).
- Vor der Initialisierung: ersten Brief in docs/briefs/ anlegen
  (Vorlage: docs/profil/brief-template.md).
- Gotham Rounded (Schrift aus der Design-Skill) ist kostenpflichtig,
  kein Google Font — Lizenz/Fallback vor Umsetzung klären.
- git push ist per deny-Regel in .claude/settings.json für den Agenten
  gesperrt (Absicht). Pushen macht der Auftraggeber selbst: "! git push".

## Für den Auftraggeber zu prüfen

- Design-Regeln-Datei gegenlesen (siehe oben) — inhaltlich schon
  bestätigt, aber nochmals in Ruhe pruefen.
- Ersten Brief schreiben.
- Klären, ob eine Gotham-Rounded-Lizenz vorliegt oder eine Fallback-
  Schrift genutzt werden soll.

## Vorgeschlagene nächste Aufgabe

- Initialisierung: docs/templates/initializer-prompt.md in neuer Sitzung ausführen.
