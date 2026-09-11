// Selbsttest der Browser-Prüfungen (Aufgabe 004): Die Prüfungen müssen auf
// absichtlich fehlerhaften Fixture-Seiten scheitern. Sonst könnte eine
// kaputte Prüfung jede Seite durchwinken.
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  HANDY_BREITE,
  breiteProbleme,
  fokusProbleme,
  versteckteProbleme,
} from "./pruefungen";

test("Selbsttest: «hidden», von display: grid überstimmt, wird gemeldet", async ({
  page,
}) => {
  await page.setContent(fixture("hidden-ueberstimmt.html"));
  expect(await versteckteProbleme(page)).toEqual([
    "<form#bestellung> ist trotz «hidden» sichtbar.",
  ]);
});

const fixture = (name: string) =>
  readFileSync(new URL(`fixtures/${name}`, import.meta.url), "utf8");

test("Selbsttest F-01: ein 500 px breites Element lässt die 375-px-Prüfung scheitern", async ({
  page,
}) => {
  await page.setViewportSize({ width: HANDY_BREITE, height: 800 });
  await page.setContent(fixture("zu-breit.html"));
  expect(await breiteProbleme(page)).toHaveLength(1);
});

test("Selbsttest F-23: Elemente ohne Fokusrahmen lassen die Fokus-Prüfung scheitern", async ({
  page,
}) => {
  await page.setContent(fixture("ohne-fokusrahmen.html"));
  const probleme = await fokusProbleme(page);
  expect(probleme).toHaveLength(2);
  expect(probleme.join("\n")).toContain("keinen sichtbaren Fokusrahmen");
});

test("Selbsttest F-23: Gegenprobe — mit Fokusrahmen besteht die Seite", async ({
  page,
}) => {
  await page.setContent(fixture("mit-fokusrahmen.html"));
  expect(await fokusProbleme(page)).toEqual([]);
});

test("Selbsttest F-23: ein nicht per Tab erreichbares Element wird gemeldet", async ({
  page,
}) => {
  await page.setContent(fixture("fokusfalle.html"));
  const probleme = await fokusProbleme(page);
  expect(probleme).toEqual([
    "<button> «Bestellen» ist per Tab nicht erreichbar.",
  ]);
});
