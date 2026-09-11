---
id: 028
title: "Adresse geschenke.ssbl.ch verbinden und live gehen"
depends_on: [027]
features: [GS-40]
status: blocked
acceptance:
  - "./scripts/verify.sh"
  - "./scripts/verify.sh --deep"
  - "npm run check:golive -- geschenkshop-ssbl"
human_review: true
class: open
---

# Kontext
BLOCKIERT — wartet auf die SSBL-IT: einmaliger Eintrag für geschenke.ssbl.ch
beim Adressverwalter von ssbl.ch (Auftraggeber-Entscheid «Unteradresse von
ssbl.ch»). Ziel: live ca. 15.10.2026 (Brief). Danach `status: todo` setzen.

# Umfang
- Der IT genau sagen, welcher Eintrag nötig ist (Wert kommt vom Anbieter aus 027).
- `adresse: https://geschenke.ssbl.ch` in site.ts; sichere Verbindung (https)
  beim Anbieter aktivieren.
- Live-Gang-Check (013) muss ohne Mängel durchlaufen — sonst NICHT live gehen
  und die Mängel im Handoff auflisten.

# Nicht Teil dieser Aufgabe
- Werbung, Social-Media-Beiträge.
- Weitere Adressen oder Umleitungen.

# Akzeptanzkriterien (über die acceptance-Befehle hinaus)
- Ein Browser-Test unter tests/browser/ (nennt GS-40) ruft
  https://geschenke.ssbl.ch auf: Status 200, gültiges Zertifikat, der Titel
  der Geschenkshop-Seite; http:// leitet auf https:// um.
- og:image (024) ist unter der Live-Adresse abrufbar.
- Menschliche Prüfung: Seite auf dem eigenen Handy aufrufen, Testbestellung.
