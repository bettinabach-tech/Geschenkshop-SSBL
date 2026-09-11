import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import Footer from "../src/components/Footer.astro";
import Kopf from "../src/components/Kopf.astro";
import { defineSite, type SiteInput } from "../src/lib/site";

const alleFelder: SiteInput = {
  slug: "fixture",
  titel: "Fixture",
  beschreibung: "Fixture für Kopf und Footer.",
  logoAlt: "SSBL – Stiftung für selbstbestimmtes und begleitetes Leben",
  kontakt: { email: "kontakt@example.ch", telefon: "041 123 45 67" },
  rechtliches: {
    impressumUrl: "https://www.example.ch/impressum",
    datenschutzUrl: "https://www.example.ch/datenschutz",
  },
  formular: { empfaenger: "kontakt@example.ch" },
};

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (komponente: typeof Kopf, eingabe: SiteInput) =>
  container.renderToString(komponente, {
    props: { site: defineSite(eingabe) },
  });

const css = readFileSync("src/styles/kopf-footer.css", "utf8");

function block(selektor: string): string {
  const esc = selektor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    new RegExp(`(?:^|\\n)\\s*${esc}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? ""
  );
}

/** Alle <a>-Tags mit href und Text. */
function links(html: string) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    attribute: m[1],
    href: /href="([^"]*)"/.exec(m[1])?.[1],
    text: m[2].trim(),
  }));
}

describe("Kopf mit Logo", () => {
  it("F-07: <img> im Kopf mit src = Logo und nicht-leerem alt", async () => {
    const html = await render(Kopf, alleFelder);
    const img = /<header[^>]*>[\s\S]*?(<img\b[^>]*>)[\s\S]*?<\/header>/.exec(
      html,
    )?.[1];
    expect(img).toBeDefined();
    expect(img).toMatch(/src="[^"]*SSBL_Logo[^"]*\.svg(\?[^"]*)?"/);
    expect(img).toMatch(
      /alt="SSBL – Stiftung für selbstbestimmtes und begleitetes Leben"/,
    );
    // Masse im HTML stimmen mit dem Seitenverhältnis des Logos (unverzerrt)
    expect(img).toMatch(/height="40"/);
    const breite = Number(/width="(\d+)"/.exec(img ?? "")?.[1]);
    expect(breite).toBeGreaterThan(100);
  });

  it("F-07: CSS setzt height ≥ 32px und width: auto (keine feste Breite)", () => {
    const logo = block(".kopf__logo");
    expect(Number(/height:\s*(\d+)px/.exec(logo)?.[1])).toBeGreaterThanOrEqual(
      32,
    );
    expect(logo).toMatch(/(?:^|[\s;])width:\s*auto/);
    expect(logo).not.toMatch(/(?:^|[\s;])width:\s*\d/);
  });

  it("F-07: Innenabstand ≥ halbe Logohöhe ringsum", () => {
    const hoehe = Number(/height:\s*(\d+)px/.exec(block(".kopf__logo"))?.[1]);
    const padding = /(?:^|[\s;])padding:\s*([^;]+);/.exec(block(".kopf"))?.[1];
    const werte = (padding ?? "").trim().split(/\s+/);
    expect(werte.length).toBeGreaterThan(0);
    for (const wert of werte) {
      expect(wert).toMatch(/^\d+px$/);
      expect(parseInt(wert, 10)).toBeGreaterThanOrEqual(hoehe / 2);
    }
  });
});

describe("Footer", () => {
  it("F-19: Link «Impressum» → impressumUrl", async () => {
    const html = await render(Footer, alleFelder);
    expect(links(html)).toContainEqual(
      expect.objectContaining({
        text: "Impressum",
        href: "https://www.example.ch/impressum",
      }),
    );
  });

  it("F-19: Link «Datenschutz» → datenschutzUrl", async () => {
    const html = await render(Footer, alleFelder);
    expect(links(html)).toContainEqual(
      expect.objectContaining({
        text: "Datenschutz",
        href: "https://www.example.ch/datenschutz",
      }),
    );
  });

  it("F-19: Link «Kontakt» → mailto:<kontakt.email>", async () => {
    const html = await render(Footer, alleFelder);
    expect(links(html)).toContainEqual(
      expect.objectContaining({
        text: "Kontakt",
        href: "mailto:kontakt@example.ch",
      }),
    );
  });

  it("F-19: tel:-Link bei gesetzter Nummer", async () => {
    const html = await render(Footer, alleFelder);
    expect(links(html)).toContainEqual(
      expect.objectContaining({
        text: "Telefon 041 123 45 67",
        href: "tel:0411234567",
      }),
    );
  });

  it("F-19: ohne Telefonnummer kein tel:-Link", async () => {
    const html = await render(Footer, {
      ...alleFelder,
      kontakt: { email: "kontakt@example.ch" },
    });
    expect(html).not.toContain("tel:");
  });

  it("F-15: kein Footer-Link trägt eine Button-Klasse", async () => {
    const html = await render(Footer, alleFelder);
    const alle = links(html);
    expect(alle).toHaveLength(4);
    for (const link of alle) {
      expect(link.attribute).not.toMatch(/class="[^"]*button/i);
    }
  });

  it("F-19: ohne impressumUrl kein Impressum-Link und kein leeres href", async () => {
    const html = await render(Footer, {
      ...alleFelder,
      rechtliches: { datenschutzUrl: "https://www.example.ch/datenschutz" },
    });
    expect(html).not.toContain("Impressum");
    expect(html).not.toMatch(/href=""/);
    expect(links(html).map((l) => l.text)).toEqual([
      "Datenschutz",
      "Kontakt",
      "Telefon 041 123 45 67",
    ]);
  });

  it("F-19: Footer-Links sind Textlinks in Textfarbe (keine Zusatzfarbe)", () => {
    const basis = readFileSync("src/styles/basis.css", "utf8");
    expect(basis).toMatch(/(?:^|\n)a\s*\{[^}]*color:\s*var\(--farbe-text\)/);
    expect(basis).toMatch(/a:focus-visible\s*\{[^}]*outline:/);
  });
});
