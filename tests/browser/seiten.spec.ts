// Browser-Prüfungen für jede gebaute Seite (Aufgabe 004, verify --deep):
// Handy-Breite, Tastatur-Fokus, Barrierefreiheit (axe) und externe Links.
// Lighthouse steht in lighthouse.spec.ts.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  HANDY_BREITE,
  breiteProbleme,
  fokusProbleme,
  versteckteProbleme,
  seiten,
} from "./pruefungen";

for (const pfad of seiten()) {
  test.describe(pfad, () => {
    test("F-01: bei 375 px Breite kein seitliches Scrollen", async ({
      page,
    }) => {
      await page.setViewportSize({ width: HANDY_BREITE, height: 800 });
      await page.goto(pfad);
      expect(await breiteProbleme(page)).toEqual([]);
    });

    test("F-23: alles per Tab erreichbar, mit sichtbarem Fokusrahmen", async ({
      page,
    }) => {
      await page.goto(pfad);
      expect(await fokusProbleme(page)).toEqual([]);
    });

    test("Ausgeblendetes («hidden») ist wirklich unsichtbar", async ({
      page,
    }) => {
      await page.goto(pfad);
      expect(await versteckteProbleme(page)).toEqual([]);
    });

    test("axe: keine schweren Barrierefreiheits-Fehler", async ({ page }) => {
      await page.goto(pfad);
      const ergebnis = await new AxeBuilder({ page }).analyze();
      const schwer = ergebnis.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length}×`);
      expect(schwer).toEqual([]);
    });

    test("externe Links antworten mit Status < 400", async ({
      page,
      request,
    }) => {
      await page.goto(pfad);
      const links = await page.$$eval("a[href^='http']", (as) => [
        ...new Set(as.map((a) => (a as HTMLAnchorElement).href)),
      ]);
      const extern = links.filter(
        (url) => new URL(url).origin !== new URL(page.url()).origin,
      );
      const kaputt: string[] = [];
      for (const url of extern) {
        let status = 0;
        try {
          status = (await request.head(url, { timeout: 15_000 })).status();
          // Manche Server kennen HEAD nicht — dann mit GET nachfragen.
          if (status >= 400) {
            status = (await request.get(url, { timeout: 15_000 })).status();
          }
        } catch (fehler) {
          kaputt.push(`${url}: nicht erreichbar (${String(fehler)})`);
          continue;
        }
        if (status >= 400) kaputt.push(`${url}: Status ${status}`);
      }
      expect(kaputt).toEqual([]);
    });
  });
}
