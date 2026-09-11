// Gemeinsame Prüfungen für die Browser-Tests (Aufgabe 004). Jede Prüfung
// liefert eine Liste von Problemen in Alltagssprache — leer heisst bestanden.
// Die Selbsttests (selbsttest.spec.ts) nutzen dieselben Funktionen, damit
// bewiesen ist, dass sie Fehler auch wirklich finden.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { Page } from "@playwright/test";

export const HANDY_BREITE = 375;

/** Alle gebauten Seiten als Pfade ("/geschenkshop-ssbl/"), ohne die interne
 *  Übersicht dist/index.html. */
export function seiten(dist = "dist"): string[] {
  if (!existsSync(dist)) {
    throw new Error(`${dist}/ fehlt — zuerst bauen (npm run build).`);
  }
  const pfade: string[] = [];
  (function durchsuche(ordner: string) {
    for (const name of readdirSync(ordner)) {
      const p = join(ordner, name);
      if (statSync(p).isDirectory()) durchsuche(p);
      else if (name.endsWith(".html")) {
        const rel = relative(dist, p).split(sep).join("/");
        if (rel === "index.html") continue;
        pfade.push("/" + rel.replace(/(^|\/)index\.html$/, "$1"));
      }
    }
  })(dist);
  return pfade.sort();
}

/** F-01: Bei 375 px Breite darf nichts seitlich überstehen. */
export async function breiteProbleme(page: Page): Promise<string[]> {
  const breite = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  return breite > HANDY_BREITE
    ? [
        `Seite ist ${breite} px breit statt höchstens ${HANDY_BREITE} px (seitliches Scrollen).`,
      ]
    : [];
}

/** F-23: Mit der Tab-Taste jedes fokussierbare Element erreichen; jedes zeigt
 *  einen sichtbaren Fokusrahmen (outline oder box-shadow). Eine Gruppe von
 *  Radio-Knöpfen ist EIN Tab-Halt (innerhalb wechseln die Pfeiltasten). */
export async function fokusProbleme(page: Page): Promise<string[]> {
  const anzahl = await page.evaluate(() => {
    const kandidaten = document.querySelectorAll<HTMLElement>(
      "a[href], button, input, select, textarea, summary, [tabindex], [contenteditable='true']",
    );
    const fokussierbar = [...kandidaten].filter(
      (el) =>
        el.tabIndex >= 0 &&
        !el.matches(":disabled") &&
        el.checkVisibility({ checkVisibilityCSS: true }),
    );
    const nummern = new Map<unknown, number>();
    for (const el of fokussierbar) {
      const radio = el instanceof HTMLInputElement && el.type === "radio";
      const schluessel =
        radio && el.name ? `radio:${el.form?.id ?? ""}:${el.name}` : el;
      if (!nummern.has(schluessel)) nummern.set(schluessel, nummern.size);
      el.dataset.fokusNr = String(nummern.get(schluessel));
    }
    return nummern.size;
  });

  const erreicht = new Map<number, string | null>(); // Nr -> Problem oder null
  for (let tab = 0; tab < anzahl + 3; tab++) {
    await page.keyboard.press("Tab");
    const aktiv = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el.dataset.fokusNr === undefined) {
        return null;
      }
      const stil = getComputedStyle(el);
      const outline =
        stil.outlineStyle !== "none" && parseFloat(stil.outlineWidth) > 0;
      const schatten = stil.boxShadow !== "none";
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
      return {
        nr: Number(el.dataset.fokusNr),
        name: `<${el.tagName.toLowerCase()}> «${text.slice(0, 40) || el.getAttribute("href") || el.getAttribute("name") || "?"}»`,
        sichtbar: outline || schatten,
      };
    });
    if (!aktiv) {
      if (erreicht.size > 0) break; // Ende der Seite: Fokus ging zurück an den Browser
      continue;
    }
    if (erreicht.has(aktiv.nr)) break; // Runde komplett
    erreicht.set(
      aktiv.nr,
      aktiv.sichtbar
        ? null
        : `${aktiv.name} hat keinen sichtbaren Fokusrahmen.`,
    );
  }

  const probleme = [...erreicht.values()].filter((p): p is string => !!p);
  if (erreicht.size < anzahl) {
    const fehlend = await page.evaluate(
      (nrn) =>
        [...document.querySelectorAll<HTMLElement>("[data-fokus-nr]")]
          .filter((el) => !nrn.includes(Number(el.dataset.fokusNr)))
          .map(
            (el) =>
              `<${el.tagName.toLowerCase()}> «${el.textContent?.trim().slice(0, 40)}»`,
          ),
      [...erreicht.keys()],
    );
    for (const f of fehlend)
      probleme.push(`${f} ist per Tab nicht erreichbar.`);
  }
  return probleme;
}
