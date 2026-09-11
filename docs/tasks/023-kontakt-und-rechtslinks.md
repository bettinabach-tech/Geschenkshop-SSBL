---
id: 023
title: "Lädeli-Kontakt, Rechtslinks und Datenschutz-Hinweis eintragen"
depends_on: [005, 019]
features: [GS-31, GS-35, GS-38]
status: blocked
acceptance:
  - "./scripts/verify.sh"
  - "node_modules/.bin/vitest run tests/kontakt-recht.test.ts"
human_review: true
class: open
---

# Kontext
BLOCKIERT — wartet auf den Auftraggeber: (1) Telefonnummer des Lädeli,
(2) genaue Adressen von Impressum und Datenschutzerklärung auf ssbl.ch,
(3) Bestätigung, dass die SSBL ihre Datenschutzerklärung um den Bestellweg
ergänzt hat (Auftraggeber-Entscheid «SSBL ergänzt ssbl.ch»). Danach
`status: todo` setzen.

# Umfang
- site.ts: kontakt.telefon, rechtliches.impressumUrl, rechtliches.datenschutzUrl.
- Beim Formular: ein Satz mit Textlink zur Datenschutzerklärung auf ssbl.ch.
- Footer (005) und Fehlermeldung des Formulars (009) zeigen die Nummer dann
  automatisch aus der Konfiguration — prüfen, nicht neu bauen.

# Nicht Teil dieser Aufgabe
- Eigene Datenschutzerklärung schreiben (Auftraggeber-Entscheid: macht die SSBL).
- Impressum auf dieser Seite.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- `tests/kontakt-recht.test.ts` prüft einzeln mit der echten site.ts:
  GS-31 beim Formular ein Link auf rechtliches.datenschutzUrl ·
  GS-35 Fehlermeldung nach Netzfehler enthält die Telefonnummer und
  laedeli@ssbl.ch · GS-38 Footer-Links Impressum und Datenschutz zeigen auf
  https://…ssbl.ch…, Kontakt enthält laedeli@ssbl.ch und die Telefonnummer.
- Die Werte stammen wörtlich vom Auftraggeber (Quelle im Handoff notieren).
