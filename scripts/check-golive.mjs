// check-golive.mjs — Live-Gang-Check (Aufgabe 013). Meldet in Alltagssprache,
// was einer Seite vor der Veröffentlichung noch fehlt.
// Aufruf: npm run check:golive -- <slug>   (z.B. geschenkshop-ssbl)
// Exit 0 = bereit · 1 = es fehlt noch etwas · 2 = falscher Aufruf.
// Läuft bewusst NICHT in verify.sh: Bis alle Inhalte geliefert sind, soll er
// Commits nicht blockieren.
// Die Einstellungen sind TypeScript (src/sites/<slug>/site.ts); Vite lädt sie
// so, wie es auch das Bauen der Seite tut.
import { existsSync } from "node:fs";
import { createServer } from "vite";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    "Aufruf: npm run check:golive -- <slug>  (z.B. geschenkshop-ssbl)",
  );
  process.exit(2);
}
if (!existsSync(`src/sites/${slug}/site.ts`)) {
  console.error(`Unbekannte Seite «${slug}»: src/sites/${slug}/site.ts fehlt.`);
  process.exit(2);
}

const vite = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
  optimizeDeps: { noDiscovery: true, include: [] },
});
let code = 1;
try {
  const { pruefeGolive } = await vite.ssrLoadModule("/src/lib/golive.ts");
  const { default: site } = await vite.ssrLoadModule(
    `/src/sites/${slug}/site.ts`,
  );
  const hakenPfad = `/src/sites/${slug}/golive.ts`;
  const haken = existsSync(hakenPfad.slice(1))
    ? (await vite.ssrLoadModule(hakenPfad)).default
    : undefined;
  const ergebnis = pruefeGolive(site, haken);
  for (const zeile of ergebnis.zeilen) console.log(zeile);
  code = ergebnis.code;
} catch (fehler) {
  console.error(
    `Live-Gang-Check gescheitert: ${fehler instanceof Error ? fehler.message : fehler}`,
  );
  code = 2;
} finally {
  await vite.close();
}
process.exit(code);
