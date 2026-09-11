// check-links.mjs — Link-Check für die gebauten Seiten (verify-Stufe "links").
// Prüft in jeder HTML-Datei unter <dist>:
//   - interne Links und Dateien (href, src, srcset) zeigen auf etwas, das existiert
//   - Sprungmarken (#abschnitt) gibt es auf der Zielseite als id
// Externe Adressen (http/https, mailto, tel) prüft dieser Check NICHT — das
// braucht Netz und gehört nach verify.sh --deep.
// Aufruf: node scripts/check-links.mjs dist   Exit 1 bei kaputten Links.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
if (!existsSync(root)) {
  console.error(`check-links: ${root} fehlt — zuerst bauen (npm run build)`);
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) htmlFiles.push(p);
  }
})(root);

const idsCache = new Map();
function idsOf(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idsCache.set(
      file,
      new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
    );
  }
  return idsCache.get(file);
}

// Ziel-URL -> HTML-Datei oder Datei auf der Platte (oder null)
function resolveTarget(fromFile, path) {
  const base = path.startsWith("/")
    ? join(root, path)
    : join(dirname(fromFile), path);
  for (const c of [base, join(base, "index.html"), `${base}.html`]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

const problems = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const urls = [];
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) urls.push(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const part of m[1].split(",")) urls.push(part.trim().split(/\s+/)[0]);
  }
  for (const raw of urls) {
    const url = raw.replaceAll("&amp;", "&");
    if (
      !url ||
      /^(https?:|mailto:|tel:|data:|javascript:)/i.test(url) ||
      url.startsWith("//")
    )
      continue;
    const [pathAndQuery, fragment] = url.split("#");
    const path = decodeURIComponent(pathAndQuery.split("?")[0]);
    const target = path === "" ? file : resolveTarget(file, path);
    const where = relative(root, file);
    if (!target) {
      problems.push(`${where}: Ziel fehlt: ${url}`);
    } else if (
      fragment &&
      target.endsWith(".html") &&
      !idsOf(target).has(fragment)
    ) {
      problems.push(`${where}: Sprungmarke fehlt: ${url}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`check-links: ${problems.length} kaputte(r) Link(s)`);
  process.exit(1);
}
console.log(
  `check-links: ${htmlFiles.length} Seite(n) geprüft, alle internen Links ok`,
);
