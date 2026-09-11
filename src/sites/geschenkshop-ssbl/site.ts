// Einstellungen der Seite «Geschenkshop SSBL» (Brief: docs/briefs/geschenkshop-ssbl.md).
// titel/beschreibung: vom Auftraggeber freigegeben am 11.09.2026 (Aufgabe 015).
// Noch unbekannt und darum bewusst weggelassen (nie raten): adresse,
// kontakt.telefon, rechtliches.impressumUrl/datenschutzUrl, formular.endpunkt.
import { defineSite } from "../../lib/site";

// Merker für den Live-Gang-Check (Aufgabe 013): auf true setzen, sobald die
// Werkstatt-Geschichte mit Foto im Vertrauens-Abschnitt steht (Aufgabe 025).
export const geschichteEingebaut = false;

export default defineSite({
  slug: "geschenkshop-ssbl",
  titel: "Weihnachtsgeschenke aus der SSBL – Geschenkshop",
  beschreibung:
    "Keramik, Anzündholz und Klosterwein aus der SSBL: bis 15.12.2026 bestellen, im Lädeli in Rathausen abholen oder liefern lassen.",
  logoAlt: "SSBL – Stiftung für selbstbestimmtes und begleitetes Leben",
  kontakt: {
    email: "laedeli@ssbl.ch",
  },
  formular: {
    empfaenger: "laedeli@ssbl.ch",
    // Bestellschluss 15.12.2026 → ab 16.12.2026, 00:00 Zürcher Zeit geschlossen
    schluss: "2026-12-16T00:00:00+01:00",
  },
  // Social-Media-Vorschau: Foto, Titel und Text vom Auftraggeber gewählt am
  // 11.09.2026 (Aufgabe 024).
  vorschau: {
    titel: "Weihnachtsgeschenke aus der SSBL, die doppelt Freude machen",
    beschreibung:
      "Keramik, Anzündholz und Klosterwein aus der SSBL: Mit jedem Geschenk unterstützen Sie die Stiftung. Bestellen bis 15.12.2026.",
    bild: "assets/products/keramik-pflanzenstecker-kraeuter.jpg",
    bildAlt:
      "Fünf Pflanzenstecker aus heller Keramik mit türkis glasierten, gemusterten Spitzen, beschriftet mit Basilikum, Rosmarin, Schnittlauch und Oregano",
  },
});
