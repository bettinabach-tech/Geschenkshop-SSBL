// Fehlerseite für falsche Adressen (Aufgabe 011, F-25).
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Fehlerseite from "../src/pages/404.astro";
import Geschenkshop from "../src/pages/geschenkshop-ssbl/index.astro";

let html: string;
beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(Fehlerseite);
});

/** Text ohne Tags und mit einfachen Leerzeichen. */
const text = (s: string) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Alle <a>-Tags mit ihren Attributen und ihrem Text. */
function links() {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    attribute: m[1],
    href: /href="([^"]*)"/.exec(m[1])?.[1],
    text: text(m[2]),
  }));
}

const startseitenLinks = () =>
  links().filter((l) => l.text === "Zur Startseite");

describe("Fehlerseite (404)", () => {
  it("F-25: hat genau eine Hauptüberschrift <h1>", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
  });

  it("F-25: hat einen Link «Zur Startseite» auf /", () => {
    const gefunden = startseitenLinks();
    expect(gefunden).toHaveLength(1);
    expect(gefunden[0].href).toBe("/");
  });

  it("F-25: der Startseiten-Link ist ein Textlink, kein Button", () => {
    const [link] = startseitenLinks();
    expect(link.attribute).not.toMatch(/class="[^"]*button/i);
    expect(link.attribute).not.toMatch(/role=/);
    expect(html).not.toContain("kauf-button");
  });

  it("F-25: ist für Suchmaschinen gesperrt (noindex)", () => {
    expect(html).toMatch(/<meta name="robots" content="noindex"\s*\/?>/);
  });

  it("Gegenprobe: normale Seiten bleiben für Suchmaschinen offen", async () => {
    const container = await AstroContainer.create();
    const shop = await container.renderToString(Geschenkshop);
    expect(shop).not.toMatch(/name="robots"/);
  });

  it("F-25: ist als deutsche Seite ausgezeichnet (lang=de)", () => {
    expect(html).toMatch(/<html\b[^>]*\blang="de"/);
  });

  it("F-25: zeigt den freigegebenen Wortlaut", () => {
    expect(text(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "")).toBe(
      "Seite nicht gefunden – Geschenkshop SSBL",
    );
    expect(text(/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "")).toBe(
      "Diese Seite gibt es leider nicht",
    );
    expect(text(html)).toContain(
      "Vielleicht hat sich in der Adresse ein Tippfehler eingeschlichen, oder der Link ist nicht mehr aktuell.",
    );
  });
});
