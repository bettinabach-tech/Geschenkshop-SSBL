import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import Abschnitt from "../src/components/Abschnitt.astro";
import Hero from "../src/components/Hero.astro";
import KaufButton from "../src/components/KaufButton.astro";
import Nutzen from "../src/components/Nutzen.astro";
import { zaehleSaetze, zaehleWoerter } from "../src/lib/text";

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

const BILD = '<img src="/test.jpg" alt="Testbild">';

const heroProps = {
  ueberschrift: "Eins zwei drei vier fünf sechs sieben acht",
  unterzeile: "Ein einziger Satz als Unterzeile.",
  ctaText: "Jetzt bestellen",
  ctaHref: "#bestellen",
};

const renderHero = (props: Record<string, unknown>, mitBild = true) =>
  container.renderToString(Hero, {
    props: { ...heroProps, ...props },
    slots: mitBild ? { bild: BILD } : {},
  });

const punkt = (n: number, text = "Ein Satz. Noch ein Satz.") => ({
  titel: `Punkt ${n}`,
  text,
});

const renderNutzen = (punkte: unknown[]) =>
  container.renderToString(Nutzen, { props: { punkte } });

const css = readFileSync("src/styles/abschnitte.css", "utf8");

/** Inhalt des ersten Blocks mit genau diesem Selektor (optional innerhalb eines @media). */
function block(quelle: string, selektor: string): string {
  const esc = selektor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    new RegExp(`(?:^|\\n)\\s*${esc}\\s*\\{([^}]*)\\}`).exec(quelle)?.[1] ?? ""
  );
}

function mediaBlock(quelle: string, bedingung: RegExp): string {
  const start = quelle.search(bedingung);
  if (start < 0) return "";
  // bis zur schliessenden Klammer des @media-Blocks
  let tiefe = 0;
  for (let i = quelle.indexOf("{", start); i < quelle.length; i++) {
    if (quelle[i] === "{") tiefe++;
    if (quelle[i] === "}" && --tiefe === 0) return quelle.slice(start, i + 1);
  }
  return "";
}

describe("Wörter und Sätze zählen (exakt)", () => {
  it.each([
    ["Eins zwei drei", 3],
    ["Sinnvolle Geschenke aus den Werkstätten der SSBL", 7],
    ["Weihnachts-Geschenke – mit Herz", 3],
    ["  viel   Leerraum \n hier ", 3],
    ["Geschenke · SSBL & Lädeli", 3],
    ["", 0],
  ])("«%s» hat %i Wörter", (text, anzahl) => {
    expect(zaehleWoerter(text)).toBe(anzahl);
  });

  it.each([
    ["Ein Satz.", 1],
    ["Ein Satz ohne Punkt", 1],
    ["Erster Satz. Zweiter Satz.", 2],
    ["Wirklich? Ja! Gut.", 3],
    ["Lieferzeit ca. eine Woche.", 1],
    ["Zum Beispiel z.B. Kerzen oder z. B. Holz.", 1],
    ["Bestellschluss 15.12.2026, Lieferung ab 3. Dezember.", 1],
    ["Bestellen bis 15.12. Danach ist Schluss.", 1],
    ["Preis CHF 24.50 pro Stück.", 1],
    ["Es gibt Kerzen, Holz usw. Bestellen Sie jetzt.", 2],
    ["Die SSBL wirkt seit 2020. Wir danken Ihnen.", 2],
    ["«Ein Zitat.» Und dann weiter.", 2],
    ["Hauptsitz Rathausen (Emmen). Neun weitere Standorte.", 2],
    ["Mehr unter Nr. 5 im Katalog.", 1],
    ["", 0],
  ])("«%s» hat %i Sätze", (text, anzahl) => {
    expect(zaehleSaetze(text)).toBe(anzahl);
  });
});

describe("Hero", () => {
  it("F-11: Überschrift mit 8 Wörtern rendert", async () => {
    const html = await renderHero({});
    expect(html).toContain("Eins zwei drei vier fünf sechs sieben acht");
  });

  it("F-11: Überschrift mit 9 Wörtern wirft", async () => {
    await expect(
      renderHero({
        ueberschrift: "Eins zwei drei vier fünf sechs sieben acht neun",
      }),
    ).rejects.toThrow(/9 Wörter/);
  });

  it("F-11: Unterzeile mit 2 Sätzen wirft", async () => {
    await expect(
      renderHero({ unterzeile: "Erster Satz. Zweiter Satz." }),
    ).rejects.toThrow(/2 Sätze/);
  });

  it("F-11: gerendert: h1, Unterzeile, kauf-button mit ctaHref, Bild-Slot", async () => {
    const html = await renderHero({});
    expect(html).toMatch(
      /<h1[^>]*>Eins zwei drei vier fünf sechs sieben acht<\/h1>/,
    );
    expect(html).toContain("Ein einziger Satz als Unterzeile.");
    expect(html).toMatch(
      /<a[^>]*class="kauf-button"[^>]*href="#bestellen"[^>]*>\s*Jetzt bestellen\s*<\/a>/,
    );
    expect(html).toContain(BILD);
    expect(html).toMatch(/<section[^>]*data-abschnitt="hero"/);
  });

  it("F-11: ohne Produktbild wirft der Hero", async () => {
    await expect(renderHero({}, false)).rejects.toThrow(/Produktbild/);
  });

  it("F-11: Unterzeile mit Abkürzung und Datum bleibt ein Satz", async () => {
    await expect(
      renderHero({
        unterzeile: "Bis 15.12.2026 bestellen, Lieferung in ca. einer Woche.",
      }),
    ).resolves.toContain("ca. einer Woche");
  });
});

describe("Nutzen", () => {
  it("F-12: 3 Punkte rendern", async () => {
    const html = await renderNutzen([punkt(1), punkt(2), punkt(3)]);
    expect(html.match(/<li/g)).toHaveLength(3);
    expect(html).toMatch(/<h3>Punkt 1<\/h3>/);
    expect(html).toMatch(/<section[^>]*data-abschnitt="nutzen"/);
  });

  it("F-12: 4 Punkte werfen", async () => {
    await expect(
      renderNutzen([punkt(1), punkt(2), punkt(3), punkt(4)]),
    ).rejects.toThrow(/4 Punkte/);
  });

  it("F-12: Text mit 3 Sätzen wirft", async () => {
    await expect(renderNutzen([punkt(1, "Eins. Zwei. Drei.")])).rejects.toThrow(
      /3 Sätze/,
    );
  });
});

describe("Kauf-Button und Abschnitt", () => {
  it("F-16: KaufButton rendert einen Link mit Klasse kauf-button", async () => {
    const html = await container.renderToString(KaufButton, {
      props: { href: "#bestellen", text: "Jetzt bestellen" },
    });
    expect(html).toMatch(/<a class="kauf-button" href="#bestellen">/);
  });

  it("F-16: .kauf-button mit min-height ≥ 44px, border-radius > 0, text-transform: none", () => {
    const b = block(css, ".kauf-button");
    const hoehe = /min-height:\s*(\d+)px/.exec(b);
    expect(Number(hoehe?.[1])).toBeGreaterThanOrEqual(44);
    const radius = /border-radius:\s*([\d.]+)(px|rem|em)/.exec(b);
    expect(Number(radius?.[1])).toBeGreaterThan(0);
    expect(b).toMatch(/text-transform:\s*none/);
    expect(b).toMatch(/background:\s*var\(--farbe-primaer\)/);
    expect(block(css, ".kauf-button:focus-visible")).toMatch(
      /outline:\s*\d+px solid/,
    );
  });

  it("F-17: max-width: 65ch für den Inhalt", async () => {
    expect(block(css, ".abschnitt__inhalt")).toMatch(/max-width:\s*65ch/);
    const html = await container.renderToString(Abschnitt, {
      props: { name: "test" },
      slots: { default: "<p>Inhalt</p>" },
    });
    expect(html).toMatch(
      /<section[^>]*data-abschnitt="test"[^>]*>\s*<div class="abschnitt__inhalt">\s*<p>Inhalt<\/p>/,
    );
  });

  it("F-18: padding-block 64px, ab min-width 768px 96px", () => {
    expect(block(css, ".abschnitt")).toMatch(/padding-block:\s*64px/);
    const media = mediaBlock(css, /@media\s*\(min-width:\s*768px\)/);
    expect(block(media.replace(/^[^{]*\{/, "\n"), ".abschnitt")).toMatch(
      /padding-block:\s*96px/,
    );
  });
});
