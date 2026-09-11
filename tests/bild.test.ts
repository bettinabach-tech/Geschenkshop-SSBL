import { experimental_AstroContainer as AstroContainer } from "astro/container";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { KB, pruefeBilder } from "../scripts/check-bilder.mjs";
import Bild from "../src/components/Bild.astro";
import { entferneUngenutzteBilder } from "../src/integrations/ungenutzte-bilder";

const FOTO = "assets/products/keramik-schalen-set.jpg";

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props: Record<string, unknown>) =>
  container.renderToString(Bild, { props });

describe("Bild-Baustein (Bild.astro)", () => {
  it("F-20: fehlendes alt wirft", async () => {
    await expect(render({ src: FOTO })).rejects.toThrow(/Alt-Text/);
  });

  it("F-20: alt nur aus Leerzeichen wirft", async () => {
    await expect(render({ src: FOTO, alt: "   " })).rejects.toThrow(/Alt-Text/);
  });

  it("F-20: das gerenderte <img> trägt den alt-Text", async () => {
    const html = await render({ src: FOTO, alt: "Drei Keramikschalen" });
    expect(html).toMatch(/<img[^>]*\salt="Drei Keramikschalen"/);
  });

  it("F-21: Ausgabe enthält avif und webp in den Breiten 400/800/1200", async () => {
    const html = await render({ src: FOTO, alt: "Drei Keramikschalen" });
    expect(html).toContain('type="image/avif"');
    expect(html).toContain('type="image/webp"');
    for (const format of ["avif", "webp"]) {
      const quelle =
        new RegExp(
          `<source[^>]*srcset="([^"]*)"[^>]*type="image/${format}"`,
        ).exec(html)?.[1] ?? "";
      for (const breite of [400, 800, 1200]) {
        expect(quelle, `${format} ${breite}w`).toMatch(
          new RegExp(`\\s${breite}w`),
        );
      }
    }
  });

  it("F-21: sizes kommt aus dem Prop, Fallback-Bild höchstens 1200 px breit", async () => {
    const html = await render({
      src: FOTO,
      alt: "Drei Keramikschalen",
      sizes: "(min-width: 48rem) 50vw, 100vw",
    });
    expect(html).toContain('sizes="(min-width: 48rem) 50vw, 100vw"');
    expect(html).toMatch(/<img[^>]*\swidth="1200"/);
  });

  it("unbekanntes Foto bricht mit verständlicher Meldung ab", async () => {
    await expect(
      render({ src: "assets/products/gibt-es-nicht.jpg", alt: "x" }),
    ).rejects.toThrow(/gibt-es-nicht\.jpg/);
  });
});

describe("check-bilder.mjs", () => {
  let dist: string;
  afterEach(() => rmSync(dist, { recursive: true, force: true }));

  function fixture(dateien: Record<string, number>, html: string) {
    dist = mkdtempSync(join(tmpdir(), "check-bilder-"));
    mkdirSync(join(dist, "_astro"));
    for (const [name, groesse] of Object.entries(dateien)) {
      writeFileSync(join(dist, "_astro", name), Buffer.alloc(groesse));
    }
    writeFileSync(join(dist, "index.html"), html);
  }

  const seite = (datei: string) =>
    `<img src="/_astro/gross.jpg" srcset="/_astro/${datei} 800w, /_astro/gross.jpg 1200w" alt="x">`;

  it("F-21: 301-KB-Datei in einem 800w-srcset ist ein Fehler", () => {
    fixture({ "b.webp": 301 * KB, "gross.jpg": 500 * KB }, seite("b.webp"));
    const fehler = pruefeBilder(dist);
    expect(fehler).toHaveLength(1);
    expect(fehler[0]).toMatch(/b\.webp.*800w.*301 KB/);
  });

  it("F-21: 299-KB-Datei in einem 800w-srcset ist in Ordnung", () => {
    fixture({ "b.webp": 299 * KB, "gross.jpg": 500 * KB }, seite("b.webp"));
    expect(pruefeBilder(dist)).toEqual([]);
  });

  it("F-21: 1.1-MB-Datei in dist ist ein Fehler", () => {
    fixture(
      { "original.jpg": Math.round(1.1 * 1024 * KB) },
      "<p>ohne Bild</p>",
    );
    const fehler = pruefeBilder(dist);
    expect(fehler).toHaveLength(1);
    expect(fehler[0]).toMatch(/original\.jpg.*1\.1 MB/);
  });
});

describe("ungenutzte Bilder nach dem Bauen entfernen", () => {
  it("löscht Bilder, auf die nichts verweist, und behält die benutzten", () => {
    const dist = mkdtempSync(join(tmpdir(), "ungenutzt-"));
    try {
      mkdirSync(join(dist, "_astro"));
      for (const name of ["benutzt.webp", "original.jpg", "logo.svg"]) {
        writeFileSync(join(dist, "_astro", name), "x");
      }
      writeFileSync(
        join(dist, "index.html"),
        '<img src="/_astro/benutzt.webp" alt="x">',
      );
      expect(entferneUngenutzteBilder(dist)).toEqual(["original.jpg"]);
      expect(existsSync(join(dist, "_astro", "benutzt.webp"))).toBe(true);
      expect(existsSync(join(dist, "_astro", "logo.svg"))).toBe(true);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
});
