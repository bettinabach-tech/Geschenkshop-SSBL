import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import { zaehleSaetze, zaehleWoerter } from "../src/lib/text";
import GeschenkshopSeite from "../src/pages/geschenkshop-ssbl/index.astro";

let html: string;
let hero: string;
let nutzen: string;
let vertrauen: string;

/** HTML eines Abschnitts (von seinem <section> bis zum nächsten </section>). */
function abschnitt(name: string): string {
  const start = html.indexOf(`data-abschnitt="${name}"`);
  if (start < 0) return "";
  return html.slice(start, html.indexOf("</section>", start));
}

const ohneTags = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(GeschenkshopSeite);
  hero = abschnitt("hero");
  nutzen = abschnitt("nutzen");
  vertrauen = abschnitt("vertrauen");
});

describe("Geschenkshop-Seite oben", () => {
  it("GS-01: Überschrift ≤ 8 Wörter, Unterzeile ein Satz und enthält «SSBL»", () => {
    const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(hero)?.[1] ?? "";
    expect(h1).toBe("Weihnachtsgeschenke, die doppelt Freude machen");
    expect(zaehleWoerter(h1)).toBeLessThanOrEqual(8);
    const unterzeile =
      /<p class="hero__unterzeile"[^>]*>([\s\S]*?)<\/p>/.exec(hero)?.[1] ?? "";
    expect(unterzeile).toContain("SSBL");
    expect(zaehleSaetze(unterzeile)).toBe(1);
  });

  it("GS-02: Hero enthält ein <img> aus assets/products/ mit alt", () => {
    const img = /<img\b[^>]*>/.exec(hero)?.[0] ?? "";
    expect(img).toMatch(/src="[^"]*keramik-pflanzenstecker-kraeuter[^"]*"/);
    expect(img).toMatch(/alt="[^"]+"/);
    expect(img).toMatch(/loading="eager"/);
  });

  it("GS-03: Kauf-Button im Hero zeigt auf #bestellen, die Seite hat id=«bestellen»", () => {
    expect(hero).toMatch(/<a class="kauf-button" href="#bestellen">/);
    expect(html.match(/\sid="bestellen"/g)).toHaveLength(1);
  });

  it("GS-04: genau 3 Nutzen-Punkte zu Gutes tun, Suchen, Geschichte", () => {
    const punkte = [...nutzen.matchAll(/<h3>([^<]*)<\/h3>/g)].map((m) => m[1]);
    expect(punkte).toEqual([
      "Gutes tun",
      "Sinnvoll schenken, ohne lange zu suchen",
      "Ein Geschenk mit Geschichte",
    ]);
    const text = ohneTags(nutzen);
    expect(text).toContain("unterstützen Sie die SSBL");
    expect(text).toContain("stundenlang zu suchen");
    expect(text).toContain("echter Geschichte");
  });

  it("GS-05: Vertrauen nennt Rathausen, neun weitere Standorte, 305 und 80", () => {
    const text = ohneTags(vertrauen);
    expect(text).toContain("Rathausen (Emmen)");
    expect(text).toContain("neun weitere Standorte");
    expect(text).toContain("305 Wohnplätze");
    expect(text).toContain("80 Arbeitsplätze für Tagesbeschäftigte");
    expect(vertrauen).toMatch(/<img\b[^>]*alt="[^"]+"/);
  });

  it("GS-13: Hero nennt Bestellschluss 15.12.2026 und Lieferzeit ca. eine Woche", () => {
    const text = ohneTags(hero);
    expect(text).toContain("15.12.2026");
    expect(text).toContain("eine Woche");
  });

  it("Tab-Titel und Beschreibung sind die freigegebenen Texte", () => {
    expect(html).toContain(
      "<title>Weihnachtsgeschenke aus der SSBL – Geschenkshop</title>",
    );
    expect(html).toContain(
      'content="Keramik, Anzündholz und Klosterwein aus der SSBL: bis 15.12.2026 bestellen, im Lädeli in Rathausen abholen oder liefern lassen."',
    );
  });

  it("keine Platzhalter- oder Mustertexte auf der echten Seite", () => {
    // «Muster» allein nicht: die Schalen haben «eingeritzte Muster».
    expect(html).not.toMatch(
      /Mustertext|Musterseite|\(Muster|Platzhalter|Lorem|folgt mit Aufgabe/i,
    );
  });
});
