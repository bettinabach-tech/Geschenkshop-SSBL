// Live-Gang-Check (Aufgabe 013): vollständige Fixture → bereit; je ein Fall
// pro Pflichtangabe; dazu der echte Aufruf über npm run check:golive.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pruefeGolive } from "../src/lib/golive";
import { defineSite, type SiteInput } from "../src/lib/site";
import { geschenkshopMaengel } from "../src/sites/geschenkshop-ssbl/golive";

const vollstaendig: SiteInput = {
  slug: "fixture",
  titel: "Fixture",
  beschreibung: "Vollständige Fixture für den Live-Gang-Check.",
  adresse: "https://geschenke.example.ch",
  logoAlt: "Logo",
  kontakt: { email: "laedeli@example.ch", telefon: "041 123 45 67" },
  rechtliches: {
    impressumUrl: "https://www.example.ch/impressum",
    datenschutzUrl: "https://www.example.ch/datenschutz",
  },
  formular: { empfaenger: "laedeli@example.ch", endpunkt: "/api/bestellung" },
};

const produkt = (name: string, extra = {}) => ({
  name,
  beschreibung: "Kurz beschrieben.",
  preis: 24.5,
  stueck: 3,
  ...extra,
});
const vollstaendigeProdukte = [
  produkt("Keramik-Schalen-Set"),
  produkt("Anzündholz-Bündel"),
];

/** Prüft eine Fixture wie der Check: allgemeine Angaben + Geschenkshop-Haken. */
function pruefe(
  site: SiteInput = vollstaendig,
  produkte = vollstaendigeProdukte,
  geschichte = true,
) {
  return pruefeGolive(defineSite(site), () =>
    geschenkshopMaengel(produkte, geschichte),
  );
}

describe("Live-Gang-Check", () => {
  it("vollständige Fixture → Exit 0", () => {
    const ergebnis = pruefe();
    expect(ergebnis.code).toBe(0);
    expect(ergebnis.zeilen).toEqual([
      "Bereit für den Live-Gang: «fixture» ist vollständig.",
    ]);
  });

  it.each<[string, SiteInput, string]>([
    [
      "kontakt.telefon",
      { ...vollstaendig, kontakt: { email: "laedeli@example.ch" } },
      "- Telefonnummer fehlt (kontakt.telefon)",
    ],
    [
      "rechtliches.impressumUrl",
      {
        ...vollstaendig,
        rechtliches: { datenschutzUrl: "https://www.example.ch/datenschutz" },
      },
      "- Link zum Impressum fehlt (rechtliches.impressumUrl)",
    ],
    [
      "rechtliches.datenschutzUrl",
      {
        ...vollstaendig,
        rechtliches: { impressumUrl: "https://www.example.ch/impressum" },
      },
      "- Link zur Datenschutzerklärung fehlt (rechtliches.datenschutzUrl)",
    ],
    [
      "formular.endpunkt",
      { ...vollstaendig, formular: { empfaenger: "laedeli@example.ch" } },
      "- Adresse des Formular-Empfängers fehlt (formular.endpunkt, kommt mit dem Anbieter)",
    ],
    [
      "adresse",
      { ...vollstaendig, adresse: undefined },
      "- Internetadresse der Seite fehlt (adresse, z.B. https://…)",
    ],
  ])("%s fehlt → Exit 1 und passende Zeile", (_feld, site, zeile) => {
    const ergebnis = pruefe(site);
    expect(ergebnis.code).toBe(1);
    expect(ergebnis.zeilen).toContain(zeile);
    expect(ergebnis.zeilen).toHaveLength(2); // Kopfzeile + genau dieser Mangel
  });

  it.each([
    [
      "beschreibung",
      { beschreibung: undefined },
      "- Beschreibung fehlt: Keramik-Schalen-Set",
    ],
    ["preis", { preis: undefined }, "- Preis fehlt: Keramik-Schalen-Set"],
    ["stueck", { stueck: undefined }, "- Stückzahl fehlt: Keramik-Schalen-Set"],
  ])(
    "Produkt ohne %s → Exit 1 und Zeile mit Produktname",
    (_feld, luecke, zeile) => {
      const ergebnis = pruefe(vollstaendig, [
        produkt("Keramik-Schalen-Set", luecke),
        produkt("Anzündholz-Bündel"),
      ]);
      expect(ergebnis.code).toBe(1);
      expect(ergebnis.zeilen).toEqual([
        "Noch nicht bereit für den Live-Gang: «fixture» — 1 Angabe fehlt:",
        zeile,
      ]);
    },
  );

  it("stueck 0 (ausverkauft) gilt als vorhanden", () => {
    expect(
      pruefe(vollstaendig, [produkt("Keramik-Schalen-Set", { stueck: 0 })])
        .code,
    ).toBe(0);
  });

  it("Geschichte nicht eingebaut → Exit 1 und passende Zeile", () => {
    const ergebnis = pruefe(vollstaendig, vollstaendigeProdukte, false);
    expect(ergebnis.code).toBe(1);
    expect(ergebnis.zeilen).toContain(
      "- Werkstatt-Geschichte mit Foto ist noch nicht eingebaut (Aufgabe 025)",
    );
  });

  it("zwei fehlende Preise → zwei Zeilen, je mit Produktname", () => {
    const ergebnis = pruefe(vollstaendig, [
      produkt("Keramik-Schalen-Set", { preis: undefined }),
      produkt("Anzündholz-Bündel", { preis: undefined }),
    ]);
    expect(ergebnis.zeilen).toEqual([
      "Noch nicht bereit für den Live-Gang: «fixture» — 2 Angaben fehlen:",
      "- Preis fehlt: Keramik-Schalen-Set",
      "- Preis fehlt: Anzündholz-Bündel",
    ]);
  });
});

describe("Aufruf über die Kommandozeile", () => {
  const lauf = (...args: string[]) =>
    spawnSync(process.execPath, ["scripts/check-golive.mjs", ...args], {
      encoding: "utf8",
      timeout: 60_000,
    });

  it("echte Geschenkshop-Seite: heute fehlen Inhalte → Exit 1 mit Liste", () => {
    const ergebnis = lauf("geschenkshop-ssbl");
    expect(ergebnis.status).toBe(1);
    expect(ergebnis.stdout).toContain("Noch nicht bereit für den Live-Gang");
    expect(ergebnis.stdout).toContain("- Preis fehlt: Keramik-Schalen-Set");
    expect(ergebnis.stdout).toContain(
      "- Telefonnummer fehlt (kontakt.telefon)",
    );
  }, 60_000);

  it.each([[[]], [["gibtsnicht"]], [["../etc"]]])(
    "falscher Aufruf %j → Exit 2",
    (args) => {
      expect(lauf(...args).status).toBe(2);
    },
  );

  it("läuft nicht in verify.sh (blockiert sonst jeden Commit)", () => {
    expect(readFileSync("scripts/verify.sh", "utf8")).not.toContain("golive");
  });

  it("ist als npm-Befehl eingetragen", () => {
    const paket = JSON.parse(readFileSync("package.json", "utf8"));
    expect(paket.scripts["check:golive"]).toBe("node scripts/check-golive.mjs");
  });
});
