// Playwright: Browser-Prüfungen für verify --deep (Aufgabe 004).
// Nutzt den installierten Microsoft Edge (kein Browser-Download) und liefert
// die fertig gebauten Seiten aus dist/ über scripts/serve-dist.mjs aus.
import { defineConfig } from "@playwright/test";

export const PORT = 4322;

export default defineConfig({
  testDir: "tests/browser",
  testMatch: "*.spec.ts",
  // Ein Browser nach dem anderen: Lighthouse misst sonst die Last der
  // parallel laufenden Tests mit und die Punktzahl schwankt.
  workers: 1,
  reporter: "line",
  timeout: 60_000,
  use: {
    channel: "msedge",
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    // Eigener kleiner Server statt `astro preview` — Begründung in der Datei.
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
