import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import KaufBereich from "../src/components/KaufBereich.astro";
import Landingpage from "../src/components/Landingpage.astro";
import Vertrauen from "../src/components/Vertrauen.astro";
import { defineSite } from "../src/lib/site";
import GanzeSeite from "./fixtures/GanzeSeite.astro";

const site = defineSite({
  slug: "fixture",
  titel: "Fixture",
  beschreibung: "Ganze Fixture-Seite.",
  logoAlt: "SSBL – Stiftung für selbstbestimmtes und begleitetes Leben",
  kontakt: { email: "kontakt@example.ch", telefon: "041 123 45 67" },
  rechtliches: {
    impressumUrl: "https://www.example.ch/impressum",
    datenschutzUrl: "https://www.example.ch/datenschutz",
  },
  formular: { empfaenger: "kontakt@example.ch" },
});

let container: AstroContainer;
let ganzeSeite: string;
beforeAll(async () => {
  container = await AstroContainer.create();
  ganzeSeite = await container.renderToString(GanzeSeite, { props: { site } });
});

/** Alle <a>-Tags mit Attributen und href. */
function links(html: string) {
  return [...html.matchAll(/<a\b([^>]*)>/g)].map((m) => ({
    attribute: m[1],
    href: /href="([^"]*)"/.exec(m[1])?.[1],
    istButton: /class="[^"]*kauf-button/.test(m[1]),
  }));
}

describe("Feste Reihenfolge (Landingpage)", () => {
  it("F-10: Hero < Nutzen < Vertrauen < Kauf-Bereich < Footer, obwohl die Slots verkehrt übergeben werden", () => {
    const positionen = [
      'data-abschnitt="hero"',
      'data-abschnitt="nutzen"',
      'data-abschnitt="vertrauen"',
      'data-abschnitt="kauf"',
      "<footer",
    ].map((marke) => ganzeSeite.indexOf(marke));
    expect(positionen.every((p) => p >= 0)).toBe(true);
    expect([...positionen].sort((a, b) => a - b)).toEqual(positionen);
  });

  it("F-10: Kopf mit Logo steht vor dem Hero", () => {
    const kopf = ganzeSeite.indexOf("<header");
    expect(kopf).toBeGreaterThanOrEqual(0);
    expect(kopf).toBeLessThan(ganzeSeite.indexOf('data-abschnitt="hero"'));
  });

  it("F-10: fehlt ein Abschnitt, bricht die Landingpage ab", async () => {
    await expect(
      container.renderToString(Landingpage, {
        props: { site },
        slots: {
          hero: "<section>Hero</section>",
          nutzen: "<section>Nutzen</section>",
          kauf: "<section>Kauf</section>",
        },
      }),
    ).rejects.toThrow(/vertrauen/);
  });
});

describe("Vertrauen", () => {
  it("F-13: ohne Bild wirft der Baustein", async () => {
    await expect(
      container.renderToString(Vertrauen, {
        props: { titel: "Über uns" },
        slots: { default: "<p>Text</p>" },
      }),
    ).rejects.toThrow(/Foto/);
  });

  it("F-13: mit Bild enthält es <img> und Text", async () => {
    const html = await container.renderToString(Vertrauen, {
      props: { titel: "Über uns" },
      slots: {
        default: "<p>Unsere Geschichte.</p>",
        bild: '<img src="/foto.jpg" alt="Foto aus der Werkstatt">',
      },
    });
    expect(html).toMatch(/<section[^>]*data-abschnitt="vertrauen"/);
    expect(html).toContain("<h2>Über uns</h2>");
    expect(html).toContain("<p>Unsere Geschichte.</p>");
    expect(html).toMatch(/<img[^>]*alt="Foto aus der Werkstatt"/);
  });
});

describe("Kauf-Bereich", () => {
  it("F-14: ohne «aktion» enthält er einen kauf-button", async () => {
    const html = await container.renderToString(KaufBereich, {
      props: { ueberschrift: "Bestellen" },
    });
    expect(html).toMatch(
      /<section[^>]*data-abschnitt="kauf"[^>]*id="bestellen"|<section[^>]*id="bestellen"[^>]*data-abschnitt="kauf"/,
    );
    expect(html).toMatch(/<a class="kauf-button" href="#bestellen">/);
  });

  it("F-14: mit «aktion» ersetzt der Slot den Button", async () => {
    const html = await container.renderToString(KaufBereich, {
      props: { ueberschrift: "Bestellen" },
      slots: { aktion: '<form id="formular"></form>' },
    });
    expect(html).toContain('<form id="formular"></form>');
    expect(html).not.toContain("kauf-button");
  });

  it("F-14: in der ganzen Seite erscheint der Kauf-Button zweimal (Hero + Kauf-Bereich)", () => {
    expect(links(ganzeSeite).filter((l) => l.istButton)).toHaveLength(2);
    const kauf = ganzeSeite.slice(ganzeSeite.indexOf('data-abschnitt="kauf"'));
    expect(kauf).toContain("kauf-button");
  });
});

describe("Nur die Kaufhandlung ist ein Button", () => {
  it("F-15: alle kauf-button zeigen auf #bestellen, und #bestellen existiert", () => {
    const buttons = links(ganzeSeite).filter((l) => l.istButton);
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) expect(b.href).toBe("#bestellen");
    expect(ganzeSeite).toMatch(/\sid="bestellen"/);
  });

  it("F-15: kein anderer Link (Kopf, Footer, Text) hat eine Button-Klasse", () => {
    const andere = links(ganzeSeite).filter((l) => !l.istButton);
    // Text-Link «Mehr erfahren», Impressum, Datenschutz, Kontakt, Telefon
    expect(andere.length).toBeGreaterThanOrEqual(5);
    for (const link of andere) {
      expect(link.attribute).not.toMatch(/class="[^"]*(button|btn)/i);
    }
  });
});
