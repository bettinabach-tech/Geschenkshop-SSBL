import { describe, expect, it } from "vitest";
import { defineSite, siteSchema } from "../src/lib/site";
import { getSite, getSites } from "../src/lib/sites";
import geschenkshop from "../src/sites/geschenkshop-ssbl/site";

const minimal = {
  slug: "test-seite",
  titel: "Testseite",
  beschreibung: "Eine Seite nur für Tests.",
  logoAlt: "Logo",
  kontakt: { email: "test@example.ch" },
  formular: { empfaenger: "test@example.ch" },
};

type Eingabe = Record<string, unknown>;

/** Kopie von minimal; `aendern` bekommt die Kopie und passt sie an. */
function variante(aendern: (e: Eingabe) => void): Eingabe {
  const kopie = structuredClone(minimal) as Eingabe;
  aendern(kopie);
  return kopie;
}

const ungueltig: [string, Eingabe][] = [
  ["fehlender slug", variante((e) => delete e.slug)],
  ["slug mit Grossbuchstaben", variante((e) => (e.slug = "Test-Seite"))],
  ["slug mit Leerzeichen", variante((e) => (e.slug = "test seite"))],
  ["fehlender titel", variante((e) => delete e.titel)],
  ["titel mit 61 Zeichen", variante((e) => (e.titel = "a".repeat(61)))],
  [
    "beschreibung mit 161 Zeichen",
    variante((e) => (e.beschreibung = "a".repeat(161))),
  ],
  ["fehlendes logoAlt", variante((e) => delete e.logoAlt)],
  ["fehlende kontakt.email", variante((e) => (e.kontakt = {}))],
  ["kontakt.email «abc»", variante((e) => (e.kontakt = { email: "abc" }))],
  ["farben.primaer «blau»", variante((e) => (e.farben = { primaer: "blau" }))],
  [
    "impressumUrl mit http://",
    variante(
      (e) => (e.rechtliches = { impressumUrl: "http://www.ssbl.ch/impressum" }),
    ),
  ],
  [
    "datenschutzUrl mit http://",
    variante(
      (e) =>
        (e.rechtliches = { datenschutzUrl: "http://www.ssbl.ch/datenschutz" }),
    ),
  ],
  ["fehlender formular.empfaenger", variante((e) => (e.formular = {}))],
  [
    "formular.schluss ohne Zeitzone",
    variante(
      (e) =>
        (e.formular = {
          empfaenger: "test@example.ch",
          schluss: "2026-12-16T00:00:00",
        }),
    ),
  ],
];

describe("Seiten-Konfiguration (defineSite)", () => {
  it("die minimale Konfiguration ist gültig", () => {
    expect(siteSchema.safeParse(minimal).success).toBe(true);
  });

  it.each(ungueltig)("ungültig: %s", (_name, eingabe) => {
    expect(siteSchema.safeParse(eingabe).success).toBe(false);
    expect(() => defineSite(eingabe as never)).toThrow();
  });

  it("Grenzfälle sind gültig: titel 60, beschreibung 160 Zeichen, https-URLs, schluss mit Zeitzone", () => {
    const eingabe = variante((e) => {
      e.titel = "a".repeat(60);
      e.beschreibung = "a".repeat(160);
      e.rechtliches = {
        impressumUrl: "https://www.ssbl.ch/impressum",
        datenschutzUrl: "https://www.ssbl.ch/datenschutz",
      };
      e.formular = {
        empfaenger: "test@example.ch",
        schluss: "2026-12-16T00:00:00+01:00",
      };
    });
    expect(siteSchema.safeParse(eingabe).success).toBe(true);
  });

  it("Standardwerte: primaer = #005CA9, logo = assets/SSBL_Logo.svg", () => {
    const site = defineSite(minimal);
    expect(site.farben.primaer).toBe("#005CA9");
    expect(site.logo).toBe("assets/SSBL_Logo.svg");
  });
});

describe("Seiten finden (getSite)", () => {
  it("die Geschenkshop-Konfiguration ist gültig und nutzt laedeli@ssbl.ch", () => {
    expect(siteSchema.safeParse(geschenkshop).success).toBe(true);
    expect(geschenkshop.kontakt.email).toBe("laedeli@ssbl.ch");
    expect(geschenkshop.formular.empfaenger).toBe("laedeli@ssbl.ch");
    expect(geschenkshop.formular.schluss).toBe("2026-12-16T00:00:00+01:00");
  });

  it("getSite findet geschenkshop-ssbl", () => {
    expect(getSite("geschenkshop-ssbl")).toEqual(geschenkshop);
    expect(getSites().map((s) => s.slug)).toContain("geschenkshop-ssbl");
  });

  it("getSite wirft bei unbekanntem slug und nennt ihn", () => {
    expect(() => getSite("gibt-es-nicht")).toThrow(/gibt-es-nicht/);
  });
});
