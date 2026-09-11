// Hinweise im Kauf-Bereich (Aufgabe 017): auf der gerenderten Shop-Seite,
// innerhalb von id="bestellen".
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Geschenkshop from "../src/pages/geschenkshop-ssbl/index.astro";

let bestellen: string; // Text des Kauf-Bereichs
let hinweise: string; // HTML des Hinweisblocks
let hinweisText: string; // Text des Hinweisblocks
beforeAll(async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Geschenkshop);
  const bereich =
    /<section\b[^>]*\bid="bestellen"[^>]*>([\s\S]*?)<\/section>/.exec(
      html,
    )?.[1];
  if (!bereich) throw new Error('Abschnitt id="bestellen" fehlt.');
  bestellen = bereich
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  hinweise = /<ul class="hinweise">[\s\S]*?<\/ul>/.exec(bereich)?.[0] ?? "";
  hinweisText = hinweise
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
});

// Formular und Schluss-Hinweis enthalten teils dieselben Wörter («Abholung»,
// «Twint», «15.12.2026») — darum steht jede Angabe auch im Hinweisblock selbst.
const nennt = (text: string) => {
  expect(bestellen).toContain(text);
  expect(hinweisText).toContain(text);
};

describe("Hinweise im Bestellbereich", () => {
  it("GS-41: Bestellschluss 15.12.2026 und Lieferzeit ca. eine Woche", () => {
    nennt("15.12.2026");
    nennt("eine Woche");
  });

  it.each(["Abholung", "Rathausen", "Emmen", "Versand", "Schweiz"])(
    "GS-14: nennt «%s»",
    (wort) => nennt(wort),
  );

  it.each(["Twint", "Karte", "keine Rechnung", "Zahlungslink"])(
    "GS-15: nennt «%s»",
    (wort) => nennt(wort),
  );

  it("GS-15: bei Abholung im Lädeli, bei Versand per Zahlungslink nach der Rückmeldung", () => {
    nennt("Bei Abholung zahlen Sie im Lädeli");
    nennt(
      "bei Versand per Zahlungslink, den Ihnen das Lädeli nach seiner Rückmeldung schickt",
    );
  });

  it("GS-16: «verbindlich» und «2 Arbeitstagen»", () => {
    nennt(
      "Ihre Bestellung wird verbindlich, sobald sich das Lädeli bei Ihnen gemeldet hat — innert 2 Arbeitstagen.",
    );
  });

  it("nennt keine Versandkosten (Brief)", () => {
    expect(bestellen).not.toMatch(/Versandkosten/i);
  });

  it("steht oberhalb der Produkte", () => {
    expect(bestellen.indexOf("Bestellschluss:")).toBeLessThan(
      bestellen.indexOf("Keramik-Pflanzenstecker"),
    );
  });

  it("nur Text: keine Links oder Buttons im Hinweisblock", () => {
    expect(hinweise).not.toBe("");
    expect(hinweise).not.toMatch(/<a\b|<button\b|kauf-button/);
  });
});
