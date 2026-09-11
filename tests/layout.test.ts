import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Seite from "../src/layouts/Seite.astro";
import { kontrast } from "../src/lib/kontrast";
import { defineSite, type SiteInput } from "../src/lib/site";
import { getSite } from "../src/lib/sites";

// Für F-31 braucht es ein zweites Logo. Statt eine Testdatei in assets/ zu
// legen (sie würde mit jeder Seite ausgeliefert), liefert der Test für
// «assets/fixture-logo.png» erfundene Metadaten; alle anderen Pfade laufen
// über die echte Suche.
vi.mock("../src/lib/logo", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/logo")>();
  return {
    ladeLogo: async (pfad: string) =>
      pfad === "assets/fixture-logo.png"
        ? {
            src: "/_astro/fixture-logo.png",
            width: 64,
            height: 64,
            format: "png",
          }
        : echt.ladeLogo(pfad),
  };
});

const basis: SiteInput = {
  slug: "fixture",
  titel: "Fixture-Titel",
  beschreibung: "Fixture-Beschreibung für Tests.",
  logoAlt: "Logo",
  kontakt: { email: "test@example.ch" },
  formular: { empfaenger: "test@example.ch" },
};

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

async function render(eingabe: SiteInput, ogBild?: string): Promise<string> {
  return container.renderToString(Seite, {
    props: { site: defineSite(eingabe), ogBild },
    slots: { default: "<main><h1>Inhalt</h1></main>" },
  });
}

function meta(html: string, property: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]*property="${property}"[^>]*content="([^"]*)"`,
  );
  return re.exec(html)?.[1];
}

const css = (datei: string) => readFileSync(`src/styles/${datei}`, "utf8");

/** Den Inhalt eines CSS-Blocks mit genau diesem Selektor. */
function block(quelle: string, selektor: RegExp): string {
  const m = new RegExp(`${selektor.source}\\s*\\{([^}]*)\\}`).exec(quelle);
  return m?.[1] ?? "";
}

describe("Grundlayout (Seite.astro)", () => {
  it('F-24: <html lang="de">', async () => {
    const html = await render(basis);
    expect(html).toMatch(/<html[^>]*\slang="de"/);
  });

  it("F-08: <title> = titel", async () => {
    const html = await render(basis);
    expect(html).toContain("<title>Fixture-Titel</title>");
  });

  it('F-08: rel="icon" zeigt aufs Logo', async () => {
    const html = await render(basis);
    expect(html).toMatch(
      /<link[^>]*rel="icon"[^>]*href="[^"]*SSBL_Logo[^"]*\.svg/,
    );
  });

  it("F-09: og:title, og:description und absolutes og:image bei adresse + Bild", async () => {
    const html = await render(
      { ...basis, adresse: "https://geschenke.example.ch" },
      "/_astro/vorschau.jpg",
    );
    expect(meta(html, "og:title")).toBe("Fixture-Titel");
    expect(meta(html, "og:description")).toBe(
      "Fixture-Beschreibung für Tests.",
    );
    expect(meta(html, "og:image")).toBe(
      "https://geschenke.example.ch/_astro/vorschau.jpg",
    );
  });

  it("F-09: ohne adresse kein og:image (nie eine halbe Adresse)", async () => {
    const html = await render(basis, "/_astro/vorschau.jpg");
    expect(meta(html, "og:image")).toBeUndefined();
    expect(meta(html, "og:title")).toBe("Fixture-Titel");
  });

  it("F-03: kein script/link/img/iframe lädt von einer fremden Domain", async () => {
    const html = await render({
      ...basis,
      adresse: "https://geschenke.example.ch",
    });
    const tags = html.match(/<(script|link|img|iframe)\b[^>]*>/gi) ?? [];
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      for (const [, url] of tag.matchAll(/\s(?:src|href)="([^"]*)"/g)) {
        expect(url, tag).not.toMatch(/^(https?:)?\/\//);
      }
    }
    expect(html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });

  it("F-03: Schrift-Dateien sind lokal (keine fremde Adresse im CSS)", () => {
    const quellen = [
      css("tokens.css"),
      css("basis.css"),
      readFileSync("node_modules/@fontsource/poppins/latin-400.css", "utf8"),
      readFileSync("node_modules/@fontsource/poppins/latin-600.css", "utf8"),
    ];
    for (const q of quellen) {
      expect(q).not.toMatch(/url\(\s*["']?(https?:)?\/\//);
      expect(q).not.toMatch(/@import/);
    }
    const layout = readFileSync("src/layouts/Seite.astro", "utf8");
    expect(layout).toContain("@fontsource/poppins/latin-400.css");
    expect(layout).toContain("@fontsource/poppins/latin-600.css");
  });

  it("F-04: kein document.cookie, kein Analytics-Skript", async () => {
    const html = await render({
      ...basis,
      adresse: "https://geschenke.example.ch",
    });
    expect(html).not.toContain("document.cookie");
    expect(html).not.toMatch(
      /google-analytics|googletagmanager|gtag\(|plausible|matomo|fbq\(|connect\.facebook|hotjar/i,
    );
  });
});

describe("Schrift und Farben (CSS)", () => {
  it("F-02: basis.css setzt Poppins 400 für Text und 600 für h1–h3", () => {
    const tokens = css("tokens.css");
    const basisCss = css("basis.css");
    expect(tokens).toMatch(/--schrift:\s*"Poppins"/);
    const body = block(basisCss, /(?:^|\n)body/);
    expect(body).toMatch(/font-family:\s*var\(--schrift\)/);
    expect(body).toMatch(/font-weight:\s*400/);
    const h = block(basisCss, /h1,\s*h2,\s*h3/);
    expect(h).toMatch(/font-weight:\s*600/);
  });

  it("F-05: tokens.css enthält exakt #1a1a1a, #ffffff, #005CA9", () => {
    // Prettier schreibt Hex-Farben klein; für den Browser ist das dieselbe Farbe.
    const tokens = css("tokens.css").toLowerCase();
    expect(tokens).toMatch(/--farbe-text:\s*#1a1a1a;/);
    expect(tokens).toMatch(/--farbe-hintergrund:\s*#ffffff;/);
    expect(tokens).toMatch(/--farbe-primaer:\s*#005ca9;/);
    expect(block(css("basis.css"), /(?:^|\n)body/)).toMatch(
      /color:\s*var\(--farbe-text\)/,
    );
  });

  it("F-05: Überschriften h1–h3 in der Primärfarbe, Fliesstext dunkel", () => {
    const basisCss = css("basis.css");
    expect(block(basisCss, /h1,\s*h2,\s*h3/)).toMatch(
      /(?:^|[\s;])color:\s*var\(--farbe-primaer\)/,
    );
    expect(block(basisCss, /(?:^|\n)body/)).not.toMatch(/--farbe-primaer/);
    expect(block(basisCss, /(?:^|\n)p/)).not.toMatch(/--farbe-primaer/);
  });

  it("F-06: blaue Überschrift auf Weiss ist lesbar (#005CA9 = 6.77:1)", () => {
    expect(kontrast("#005CA9", "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("Kontrast (WCAG)", () => {
  it("F-06: #1a1a1a auf #ffffff = 17.40:1", () => {
    expect(kontrast("#1a1a1a", "#ffffff")).toBeCloseTo(17.4, 1);
    expect(Math.abs(kontrast("#1a1a1a", "#ffffff") - 17.4)).toBeLessThanOrEqual(
      0.05,
    );
  });

  it("F-06: #ffffff auf #005CA9 = 6.77:1", () => {
    expect(Math.abs(kontrast("#ffffff", "#005CA9") - 6.77)).toBeLessThanOrEqual(
      0.05,
    );
  });

  it("F-06: Primärfarbe #7fb2e5 wird mit klarer Meldung abgelehnt", () => {
    expect(() =>
      defineSite({ ...basis, farben: { primaer: "#7fb2e5" } }),
    ).toThrow(/#7fb2e5.*zu hell.*4\.5/);
  });
});

describe("Eigene Farbe und eigenes Logo je Seite", () => {
  it("F-31: zwei Seiten zeigen je ihre Primärfarbe und ihr Logo", async () => {
    const a = await render({
      ...basis,
      slug: "seite-a",
      farben: { primaer: "#00613a" },
      logo: "assets/SSBL_Logo.svg",
    });
    const b = await render({
      ...basis,
      slug: "seite-b",
      farben: { primaer: "#7a1f3d" },
      logo: "assets/fixture-logo.png",
    });
    expect(a).toMatch(/<html[^>]*style="--farbe-primaer: #00613a"/);
    expect(b).toMatch(/<html[^>]*style="--farbe-primaer: #7a1f3d"/);
    expect(a).toMatch(
      /rel="icon"[^>]*href="[^"]*SSBL_Logo[^"]*"[^>]*type="image\/svg\+xml"/,
    );
    expect(b).toMatch(
      /rel="icon"[^>]*href="\/_astro\/fixture-logo\.png"[^>]*type="image\/png"/,
    );
    expect(a).not.toContain("#7a1f3d");
    expect(b).not.toContain("SSBL_Logo");
  });

  it("F-31: die Geschenkshop-Seite bleibt bei #005CA9", async () => {
    const site = getSite("geschenkshop-ssbl");
    expect(site.farben.primaer).toBe("#005CA9");
    const html = await container.renderToString(Seite, { props: { site } });
    expect(html).toMatch(/<html[^>]*style="--farbe-primaer: #005CA9"/);
  });

  it("unbekanntes Logo bricht mit verständlicher Meldung ab", async () => {
    await expect(
      render({ ...basis, logo: "assets/gibt-es-nicht.svg" }),
    ).rejects.toThrow(/assets\/gibt-es-nicht\.svg/);
  });

  it("Produktfotos gelten nicht als Logo (würden sonst in dist/ landen)", async () => {
    await expect(
      render({ ...basis, logo: "assets/products/keramik-schalen-set.jpg" }),
    ).rejects.toThrow(/nicht gefunden/);
  });
});
