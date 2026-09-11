// Social-Media-Vorschau (Aufgabe 024, GS-39): Foto, Titel und Text beim Teilen.
// Die echte Adresse kommt mit Aufgabe 028; bis dahin prüft der Test das
// og:image mit einer Fixture-Adresse. Das Bild selbst kommt vom echten
// Endpunkt (src/pages/[seite]/vorschau.jpg.ts), so wie beim Bauen.
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";
import Seite from "../src/layouts/Seite.astro";
import { defineSite } from "../src/lib/site";
import { getSite } from "../src/lib/sites";
import GeschenkshopSeite from "../src/pages/geschenkshop-ssbl/index.astro";
import { GET, getStaticPaths } from "../src/pages/[seite]/vorschau.jpg";

const shop = getSite("geschenkshop-ssbl");
const mitAdresse = defineSite({
  ...shop,
  adresse: "https://geschenke.example.ch",
});

function meta(html: string, name: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]*(?:property|name)="${name}"[^>]*content="([^"]*)"`,
  );
  return re.exec(html)?.[1];
}

let html: string; // Grundlayout mit den Shop-Einstellungen + Fixture-Adresse
let shopHtml: string; // die echte Shop-Seite (heute noch ohne Adresse)
let bild: Buffer;

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(Seite, {
    props: { site: mitAdresse },
    slots: { default: "<main><h1>Inhalt</h1></main>" },
  });
  shopHtml = await container.renderToString(GeschenkshopSeite);
  const pfad = getStaticPaths().find((p) => p.params.seite === shop.slug);
  if (!pfad) throw new Error("kein Vorschaubild für den Geschenkshop");
  const antwort = await GET({ ...pfad } as unknown as APIContext);
  bild = Buffer.from(await antwort.arrayBuffer());
}, 60_000);

describe("Social-Media-Vorschau", () => {
  it("GS-39: og:image ist eine absolute https-Adresse (Fixture-Adresse)", () => {
    expect(meta(html, "og:image")).toBe(
      "https://geschenke.example.ch/geschenkshop-ssbl/vorschau.jpg",
    );
  });

  it("GS-39: Vorschaubild ist ein JPG mit 1200 × 630 px", async () => {
    const { width, height, format } = await sharp(bild).metadata();
    expect({ width, height, format }).toEqual({
      width: 1200,
      height: 630,
      format: "jpeg",
    });
    expect(meta(html, "og:image:width")).toBe("1200");
    expect(meta(html, "og:image:height")).toBe("630");
  });

  it("GS-39: Vorschaubild ist höchstens 300 KB gross", () => {
    expect(bild.length).toBeLessThanOrEqual(300 * 1024);
  });

  it("GS-39: og:image:alt ist nicht leer", () => {
    expect(meta(html, "og:image:alt")?.trim()).toBeTruthy();
  });

  it("GS-39: og:title enthält «Geschenk» (echte Shop-Seite)", () => {
    // gross oder klein: «Weihnachtsgeschenke» zählt
    expect(meta(shopHtml, "og:title")).toMatch(/geschenk/i);
    expect(meta(shopHtml, "og:title")).toBe(shop.vorschau.titel);
    expect(meta(shopHtml, "og:description")).toBe(shop.vorschau.beschreibung);
  });

  it("GS-39: heute (ohne Adresse) kein halbes og:image", () => {
    expect(meta(shopHtml, "og:image")).toBeUndefined();
  });

  it("GS-39: kein Meta-Tag eines Tracking-Dienstes", () => {
    const tracking =
      /fb:app_id|fb:admins|fb:pages|facebook-domain-verification|p:domain_verify|google-site-verification|connect\.facebook\.net|googletagmanager|google-analytics|analytics\.tiktok|snap\.licdn/i;
    expect(html).not.toMatch(tracking);
    expect(shopHtml).not.toMatch(tracking);
  });
});
