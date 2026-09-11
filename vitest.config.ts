/// <reference types="vitest/config" />
// getViteConfig: Tests laufen mit Astros Einstellungen, damit .astro-Bausteine
// über die Container-API (astro/container) direkt als HTML geprüft werden
// können — ohne vorherigen Build.
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
