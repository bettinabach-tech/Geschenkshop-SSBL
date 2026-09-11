// F-22: Lighthouse (Handy) je Seite — Performance, Barrierefreiheit,
// Best Practices und SEO je mindestens 90 Punkte (Aufgabe 004).
// Die Schwelle 90 ist fest und wird NIE gesenkt. Gegen Messschwankungen zählt
// der Median aus 3 Läufen.
import { chromium, expect, test } from "@playwright/test";
import lighthouse from "lighthouse";
import { PORT } from "../../playwright.config";
import { seiten } from "./pruefungen";

const SCHWELLE = 90;
const LAEUFE = 3;
const KATEGORIEN = ["performance", "accessibility", "best-practices", "seo"];
const DEBUG_PORT = 9223;

function median(werte: number[]): number {
  const s = [...werte].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

for (const pfad of seiten()) {
  test(`F-22: ${pfad} erreicht in Lighthouse (Handy) je Kategorie ≥ ${SCHWELLE}`, async () => {
    test.setTimeout(180_000);
    // Edge mit offenem Debug-Anschluss starten; Lighthouse steuert ihn darüber.
    const browser = await chromium.launch({
      channel: "msedge",
      args: [`--remote-debugging-port=${DEBUG_PORT}`],
    });
    const punkte: Record<string, number[]> = {};
    try {
      for (let lauf = 0; lauf < LAEUFE; lauf++) {
        const ergebnis = await lighthouse(
          `http://localhost:${PORT}${pfad}`,
          { port: DEBUG_PORT, logLevel: "error", onlyCategories: KATEGORIEN },
          // Standard von Lighthouse: Handy-Ansicht mit gedrosseltem Netz/CPU.
        );
        if (!ergebnis) throw new Error("Lighthouse lieferte kein Ergebnis.");
        for (const k of KATEGORIEN) {
          (punkte[k] ??= []).push(
            Math.round((ergebnis.lhr.categories[k]?.score ?? 0) * 100),
          );
        }
      }
    } finally {
      await browser.close();
    }
    console.log(
      `Lighthouse ${pfad}: ` +
        KATEGORIEN.map((k) => `${k} ${punkte[k].join("/")}`).join(" · "),
    );
    const zuTief = KATEGORIEN.filter((k) => median(punkte[k]) < SCHWELLE).map(
      (k) =>
        `${k}: Median ${median(punkte[k])} (Läufe ${punkte[k].join(", ")})`,
    );
    expect(zuTief).toEqual([]);
  });
}
