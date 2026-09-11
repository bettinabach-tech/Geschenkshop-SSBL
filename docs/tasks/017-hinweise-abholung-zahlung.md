---
id: 017
title: "Hinweise zu Abholung, Versand, Zahlung und Verbindlichkeit schreiben"
depends_on: [015]
features: [GS-14, GS-15, GS-16, GS-41]
status: todo
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/hinweise.test.ts"
human_review: true
class: open
---

# Kontext
Einwand aus dem Brief: «Kommt die Bestellung rechtzeitig vor Weihnachten an?»
Auftraggeber-Entscheide: Zahlung nicht auf der Seite, sondern später (Abholung:
im Lädeli; Versand: Zahlungslink nach Rückmeldung) · Lieferung nur Schweiz ·
verbindlich erst mit Rückmeldung des Lädeli (decisions.md).

# Umfang
- Kurzer Hinweisblock im Kauf-Bereich, oberhalb der Produkte:
  1. Bestellschluss 15.12.2026, Lieferzeit ca. eine Woche.
  2. Zwei Wege: Abholung im Lädeli in Rathausen (Emmen) oder Versand
     innerhalb der Schweiz (Versandkosten NICHT nennen — Brief).
  3. Zahlung: Twint oder Karte, keine Rechnung; bei Abholung im Lädeli, bei
     Versand per Zahlungslink, den das Lädeli nach der Rückmeldung schickt.
  4. «Ihre Bestellung wird verbindlich, sobald sich das Lädeli bei Ihnen
     gemeldet hat — innert 2 Arbeitstagen.»
- Nur Textlinks, kein zweiter Button-Stil (Skill).

# Nicht Teil dieser Aufgabe
- Öffnungszeiten oder Adresse des Lädeli (nicht geliefert — nicht erfinden).
- Versandkosten (Brief: stehen nicht auf der Seite).

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/hinweise.test.ts` prüft auf der gerenderten Seite, innerhalb von
  id="bestellen": GS-41 «15.12.2026» und «eine Woche» · GS-14 «Abholung»,
  «Rathausen», «Emmen», «Versand», «Schweiz» · GS-15 «Twint», «Karte»,
  «keine Rechnung», «Zahlungslink» · GS-16 «verbindlich» und «2 Arbeitstagen» ·
  kein Text «Versandkosten».
- Menschliche Prüfung: Wortlaut und Länge (kurz genug fürs Handy).
