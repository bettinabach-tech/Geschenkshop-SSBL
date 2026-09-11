// check-bilder.mjs — Bildgrössen-Check für die gebauten Seiten (verify-Stufe "bilder").
// Prüft unter <dist>:
//   - jede Bilddatei, die in einem srcset mit Breite ≤ 800w vorkommt (die
//     Fassungen fürs Handy), ist höchstens 300 KB gross
//   - keine Datei in dist/ ist grösser als 1 MB (z.B. ein vergessenes Original)
// Aufruf: node scripts/check-bilder.mjs dist   Exit 1 bei Verstössen.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const KB = 1024;
export const MAX_HANDY = 300 * KB;
export const MAX_DATEI = 1024 * KB;
const MAX_HANDY_BREITE = 800;

function alleDateien(ordner) {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name);
    return statSync(pfad).isDirectory() ? alleDateien(pfad) : [pfad];
  });
}

/** Liefert die Liste der Verstösse (leer = alles in Ordnung). */
export function pruefeBilder(dist) {
  const root = resolve(dist);
  const fehler = [];
  const dateien = alleDateien(root);

  for (const datei of dateien) {
    const groesse = statSync(datei).size;
    if (groesse > MAX_DATEI) {
      fehler.push(
        `${relative(root, datei)} ist ${(groesse / KB / 1024).toFixed(1)} MB gross (erlaubt: 1 MB)`,
      );
    }
  }

  const geprueft = new Set();
  for (const html of dateien.filter((d) => d.endsWith(".html"))) {
    const text = readFileSync(html, "utf8");
    for (const [, srcset] of text.matchAll(/\ssrcset="([^"]*)"/g)) {
      for (const eintrag of srcset.split(",")) {
        const [url, breite] = eintrag.trim().split(/\s+/);
        const w = /^(\d+)w$/.exec(breite ?? "");
        if (!url || !w || Number(w[1]) > MAX_HANDY_BREITE) continue;
        if (/^(https?:)?\/\//.test(url) || geprueft.has(url)) continue;
        geprueft.add(url);
        const pfad = join(root, decodeURI(url.split(/[?#]/)[0]));
        if (!existsSync(pfad)) continue; // fehlende Dateien meldet check-links
        const groesse = statSync(pfad).size;
        if (groesse > MAX_HANDY) {
          fehler.push(
            `${url} (${w[1]}w, in ${relative(root, html)}) ist ${Math.round(groesse / KB)} KB gross (erlaubt fürs Handy: 300 KB)`,
          );
        }
      }
    }
  }
  return fehler;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dist = resolve(process.argv[2] ?? "dist");
  if (!existsSync(dist)) {
    console.error(`check-bilder: ${dist} fehlt — zuerst bauen (npm run build)`);
    process.exit(1);
  }
  const fehler = pruefeBilder(dist);
  for (const f of fehler) console.error(`check-bilder: ${f}`);
  process.exit(fehler.length > 0 ? 1 : 0);
}
