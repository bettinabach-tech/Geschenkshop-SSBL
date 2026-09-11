// sites.ts — findet alle Seiten unter src/sites/*/site.ts.
// Der Ordnername ist der slug; er muss mit dem slug in site.ts übereinstimmen.
import type { Site } from "./site";

const modules = import.meta.glob<{ default: Site }>("../sites/*/site.ts", {
  eager: true,
});

function loadSites(): Site[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const ordner = path.split("/").at(-2);
      const site = mod.default;
      if (site.slug !== ordner) {
        throw new Error(
          `src/sites/${ordner}/site.ts: slug «${site.slug}» passt nicht zum Ordnernamen «${ordner}».`,
        );
      }
      return site;
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const sites = loadSites();

/** Alle Seiten, sortiert nach slug. */
export function getSites(): Site[] {
  return sites;
}

/** Die Seite mit diesem slug; wirft einen verständlichen Fehler, wenn es sie nicht gibt. */
export function getSite(slug: string): Site {
  const site = sites.find((s) => s.slug === slug);
  if (!site) {
    const bekannt = sites.map((s) => s.slug).join(", ") || "(keine)";
    throw new Error(
      `Unbekannte Seite «${slug}». Vorhanden: ${bekannt}. Erwartet wird src/sites/${slug}/site.ts.`,
    );
  }
  return site;
}
