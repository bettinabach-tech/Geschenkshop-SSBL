// serve-dist.mjs — liefert dist/ lokal aus, für die Browser-Prüfungen (Aufgabe 004).
// Warum nicht `astro preview`? Astro 7 startet die Vorschau selbständig im
// Hintergrund, sobald es einen KI-Agenten erkennt, und beendet sich sofort —
// Playwright verliert dann den Server, und der Prozess bleibt liegen.
// Aufruf: node scripts/serve-dist.mjs <port> [ordner]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.argv[2] ?? 4322);
const root = resolve(process.argv[3] ?? "dist");

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

function datei(pfad) {
  const ziel = join(root, normalize(decodeURIComponent(pfad)));
  if (!ziel.startsWith(root)) return null; // kein Ausbruch aus dist/
  for (const k of [ziel, join(ziel, "index.html"), `${ziel}.html`]) {
    if (existsSync(k) && statSync(k).isFile()) return k;
  }
  return null;
}

function senden(res, status, pfad) {
  res.writeHead(status, {
    "Content-Type": TYPEN[extname(pfad)] ?? "application/octet-stream",
  });
  createReadStream(pfad).pipe(res);
}

createServer((req, res) => {
  const pfad = new URL(req.url ?? "/", "http://localhost").pathname;
  const gefunden = datei(pfad);
  if (gefunden) return senden(res, 200, gefunden);
  const fehlerseite = join(root, "404.html");
  if (existsSync(fehlerseite)) return senden(res, 404, fehlerseite);
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Nicht gefunden");
}).listen(port, "localhost", () => {
  console.log(`dist/ unter http://localhost:${port}/`);
});
