// Astro-Konfiguration der landingpage-fabrik.
// Statische Ausgabe: `npm run build` erzeugt fertige HTML-Dateien in dist/.
import { defineConfig } from "astro/config";
import ungenutzteBilder from "./src/integrations/ungenutzte-bilder.ts";

export default defineConfig({
  output: "static",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  // Entfernt Foto-Originale aus dist/, die keine Seite zeigt (Aufgabe 008).
  integrations: [ungenutzteBilder()],
});
