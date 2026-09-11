// ungenutzte-bilder.ts — räumt nach dem Bauen Bilder aus dist/_astro weg,
// auf die keine gebaute Datei verweist.
// Grund: Sucht ein Baustein Fotos per import.meta.glob, legt Astro JEDES
// gefundene Original (3–8 MB) in dist/, auch wenn keine Seite es zeigt. Astro
// selbst löscht nur Originale, die es verkleinert hat (CLAUDE.md «Bekannte Fallen»).
import type { AstroIntegration } from "astro";
import { readdirSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const BILD = /\.(jpe?g|png|webp|avif|gif)$/i;
const TEXT = /\.(html|css|js|mjs|json|xml|txt|webmanifest)$/i;

function alleDateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name);
    return statSync(pfad).isDirectory() ? alleDateien(pfad) : [pfad];
  });
}

/** Löscht Bilder in <dist>/_astro, deren Dateiname in keiner Textdatei vorkommt. */
export function entferneUngenutzteBilder(dist: string): string[] {
  const dateien = alleDateien(dist);
  const texte = dateien
    .filter((d) => TEXT.test(d))
    .map((d) => readFileSync(d, "utf8"))
    .join("\n");
  const astroOrdner = join(dist, "_astro");
  const geloescht: string[] = [];
  for (const datei of dateien) {
    if (!datei.startsWith(astroOrdner) || !BILD.test(datei)) continue;
    if (!texte.includes(basename(datei))) {
      unlinkSync(datei);
      geloescht.push(basename(datei));
    }
  }
  return geloescht;
}

export default function ungenutzteBilder(): AstroIntegration {
  return {
    name: "ungenutzte-bilder",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const geloescht = entferneUngenutzteBilder(fileURLToPath(dir));
        if (geloescht.length > 0) {
          logger.info(
            `${geloescht.length} ungenutzte Bilder aus dist/ entfernt.`,
          );
        }
      },
    },
  };
}
