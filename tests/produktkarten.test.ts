import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Produktkarten from "../src/sites/geschenkshop-ssbl/Produktkarten.astro";
import {
  produktStatus,
  produkte,
  pruefeProdukte,
} from "../src/sites/geschenkshop-ssbl/produkte";

const NAMEN = [
  "Keramik-Pflanzenstecker Kräuter",
  "Anzündholz-Bündel",
  "Keramik-Schalen-Set",
  "Klosterwein Rathausen Divico",
  "Klosterwein Rathausen Souvignier Gris",
];

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

/** Rendert eine einzelne Karte aus einem Fixture-Produkt; liefert ihr HTML. */
async function karte(felder: Record<string, unknown>): Promise<string> {
  const [produkt] = pruefeProdukte([
    {
      id: "test",
      name: "Testprodukt",
      foto: "assets/products/anzuendholz-buendel.jpg",
      alt: "Ein Bündel Holz",
      ...felder,
    },
  ]);
  return container.renderToString(Produktkarten, {
    props: { produkte: [produkt] },
  });
}

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

describe("Produktkarten mit der echten produkte.yaml", () => {
  let html: string;
  beforeAll(async () => {
    html = await container.renderToString(Produktkarten, {
      props: { produkte },
    });
  });

  it("GS-07: alle 5 Namen erscheinen exakt wie in features.md", () => {
    const namen = [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/g)].map((m) =>
      m[1].trim(),
    );
    expect(namen).toEqual(NAMEN);
  });

  it("jede Karte hat ein <img> mit nicht-leerem alt", () => {
    const karten = html.split('<li class="produkt"').slice(1);
    expect(karten).toHaveLength(5);
    for (const k of karten) {
      expect(k).toMatch(/<img\b[^>]*\salt="[^"\s][^"]*"/);
    }
  });

  it("ohne Preise und Stückzahlen zeigen alle Karten «Preis folgt» (nichts erfunden)", () => {
    expect(html.match(/Preis folgt/g)).toHaveLength(5);
    expect(html).not.toMatch(/CHF|Stück verfügbar|ausverkauft/);
  });

  it("GS-12: genau die zwei Weine tragen «Abgabe ab 16 Jahren»", () => {
    const karten = html.split('<li class="produkt"').slice(1);
    const mitHinweis = karten
      .filter((k) => k.includes("Abgabe ab 16 Jahren"))
      .map((k) => /data-produkt="([^"]+)"/.exec(k)?.[1]);
    expect(mitHinweis).toEqual([
      "klosterwein-divico",
      "klosterwein-souvignier-gris",
    ]);
  });
});

describe("Preis und Stückzahl", () => {
  it("Preis 24.5 → «CHF 24.50»", async () => {
    expect(text(await karte({ preis: 24.5, stueck: 3 }))).toContain(
      "CHF 24.50",
    );
  });

  it("Preis 7 → «CHF 7.00»", async () => {
    expect(text(await karte({ preis: 7, stueck: 3 }))).toContain("CHF 7.00");
  });

  it("ohne Preis → «Preis folgt»", async () => {
    const t = text(await karte({ stueck: 3 }));
    expect(t).toContain("Preis folgt");
    expect(t).not.toContain("CHF");
    expect(t).not.toContain("Stück verfügbar");
  });

  it("ohne Stückzahl → «Preis folgt», nicht bestellbar", async () => {
    const html = await karte({ preis: 24.5 });
    expect(text(html)).toContain("Preis folgt");
    expect(html).toContain('data-status="preis-folgt"');
  });

  it("stueck 12 → «Noch 12 Stück verfügbar»", async () => {
    expect(text(await karte({ preis: 24.5, stueck: 12 }))).toContain(
      "Noch 12 Stück verfügbar",
    );
  });

  it("stueck 1 → «Noch 1 Stück verfügbar»", async () => {
    expect(text(await karte({ preis: 24.5, stueck: 1 }))).toContain(
      "Noch 1 Stück verfügbar",
    );
  });
});

describe("Ausverkauft und Wein", () => {
  it("GS-11: stueck 0 → «ausverkauft», Karte weiterhin gerendert", async () => {
    const html = await karte({ preis: 24.5, stueck: 0 });
    expect(html).toMatch(/<li class="produkt"[^>]*data-status="ausverkauft"/);
    expect(text(html)).toContain("Testprodukt");
    expect(text(html)).toContain("ausverkauft");
    expect(text(html)).not.toContain("Stück verfügbar");
    expect(html).toMatch(/<img\b/);
  });

  it("GS-11: ausverkauft nutzt nicht die Primärfarbe", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/styles/produkte.css", "utf8");
    expect(css).not.toContain("--farbe-primaer:");
    expect(css).not.toMatch(/var\(--farbe-primaer\)/);
  });

  it("GS-12: wein: true → «Abgabe ab 16 Jahren»", async () => {
    expect(text(await karte({ wein: true }))).toContain("Abgabe ab 16 Jahren");
  });

  it("GS-12: wein: false → Text fehlt", async () => {
    expect(text(await karte({ wein: false }))).not.toContain("16 Jahren");
  });

  it("Status-Regeln: bestellbar nur mit Preis und Stückzahl ≥ 1", () => {
    const [p] = pruefeProdukte([
      {
        id: "x",
        name: "X",
        foto: "assets/products/anzuendholz-buendel.jpg",
        alt: "x",
      },
    ]);
    expect(produktStatus(p)).toBe("preis-folgt");
    expect(produktStatus({ ...p, preis: 5 })).toBe("preis-folgt");
    expect(produktStatus({ ...p, preis: 5, stueck: 0 })).toBe("ausverkauft");
    expect(produktStatus({ ...p, preis: 5, stueck: 2 })).toBe("bestellbar");
  });
});
