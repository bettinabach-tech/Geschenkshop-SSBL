import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ladeProdukte,
  produktListeSchema,
  produkte,
  pruefeProdukte,
} from "../src/sites/geschenkshop-ssbl/produkte";

const IDS = [
  "keramik-pflanzenstecker-kraeuter",
  "anzuendholz-buendel",
  "keramik-schalen-set",
  "klosterwein-divico",
  "klosterwein-souvignier-gris",
];

const gueltig = {
  id: "test-produkt",
  name: "Testprodukt",
  foto: "assets/products/anzuendholz-buendel.jpg",
  alt: "Ein Bündel Holz",
};

type Eingabe = Record<string, unknown>;

function mit(aendern: Partial<Eingabe>): Eingabe[] {
  return [{ ...gueltig, ...aendern }];
}

function ohne(feld: string): Eingabe[] {
  const kopie: Eingabe = { ...gueltig };
  delete kopie[feld];
  return [kopie];
}

describe("Produktliste des Geschenkshops (produkte.yaml)", () => {
  it("die echte Datei lädt", () => {
    const text = readFileSync(
      "src/sites/geschenkshop-ssbl/produkte.yaml",
      "utf8",
    );
    expect(() => ladeProdukte(text)).not.toThrow();
  });

  it("genau 5 Produkte mit exakt den 5 ids", () => {
    expect(produkte).toHaveLength(5);
    expect(produkte.map((p) => p.id).sort()).toEqual([...IDS].sort());
  });

  it("wein ist genau bei den zwei Klosterweinen true", () => {
    const weine = produkte.filter((p) => p.wein).map((p) => p.id);
    expect(weine.sort()).toEqual([
      "klosterwein-divico",
      "klosterwein-souvignier-gris",
    ]);
  });

  it("jedes foto existiert und liegt unter assets/products/", () => {
    for (const p of produkte) {
      expect(p.foto, p.id).toMatch(/^assets\/products\//);
      expect(existsSync(p.foto), p.foto).toBe(true);
    }
  });

  it("jedes Produkt hat Namen und Alt-Text", () => {
    for (const p of produkte) {
      expect(p.name.length, p.id).toBeGreaterThan(0);
      expect(p.alt.length, p.id).toBeGreaterThan(0);
    }
  });

  it("Preise, Stückzahlen, Beschreibungen sind noch leer (nie raten)", () => {
    for (const p of produkte) {
      expect(p.preis, p.id).toBeUndefined();
      expect(p.stueck, p.id).toBeUndefined();
      expect(p.beschreibung, p.id).toBeUndefined();
    }
  });
});

describe("Schema lehnt ab", () => {
  const faelle: [string, unknown][] = [
    ["preis 0", mit({ preis: 0 })],
    ["preis -5", mit({ preis: -5 })],
    ["preis «zwölf»", mit({ preis: "zwölf" })],
    ["preis 24.555", mit({ preis: 24.555 })],
    ["stueck 2.5", mit({ stueck: 2.5 })],
    ["stueck -1", mit({ stueck: -1 })],
    [
      "foto zeigt auf eine fehlende Datei",
      mit({ foto: "assets/products/gibt-es-nicht.jpg" }),
    ],
    ["doppelte id", [gueltig, { ...gueltig }]],
    ["fehlender alt", ohne("alt")],
    ["fehlender name", ohne("name")],
  ];

  it.each(faelle)("%s", (_name, daten) => {
    expect(produktListeSchema.safeParse(daten).success).toBe(false);
    expect(() => pruefeProdukte(daten)).toThrow();
  });

  it("die Meldung nennt Produkt und Feld", () => {
    expect(() => pruefeProdukte(mit({ preis: "zwölf" }))).toThrow(
      /Produkt «test-produkt», Feld «preis»/,
    );
    expect(() =>
      pruefeProdukte(mit({ foto: "assets/products/gibt-es-nicht.jpg" })),
    ).toThrow(/Feld «foto».*gibt-es-nicht\.jpg/);
  });

  it("Preis mit Komma aus YAML (24,50) wird mit Hinweis auf den Punkt abgelehnt", () => {
    const yaml = `- id: test-produkt
  name: Testprodukt
  foto: assets/products/anzuendholz-buendel.jpg
  alt: Ein Bündel Holz
  preis: 24,50
`;
    expect(() => ladeProdukte(yaml)).toThrow(/Feld «preis».*Punkt/);
  });
});

describe("Schema akzeptiert", () => {
  const faelle: [string, unknown][] = [
    ["preis 24.5", mit({ preis: 24.5 })],
    ["preis 24.55", mit({ preis: 24.55 })],
    ["stueck 0 (ausverkauft)", mit({ stueck: 0 })],
    ["fehlender preis", ohne("preis")],
    ["fehlende stueck", ohne("stueck")],
    ["leere Felder aus YAML (null)", mit({ preis: null, stueck: null })],
  ];

  it.each(faelle)("%s", (_name, daten) => {
    expect(produktListeSchema.safeParse(daten).success).toBe(true);
  });

  it("stueck 0 bleibt 0 (nicht leer)", () => {
    expect(pruefeProdukte(mit({ stueck: 0 }))[0].stueck).toBe(0);
  });
});
