// Browser-Umgebung (happy-dom) für Formular-Tests — erst NACH dem Rendern mit
// dem Astro-Container aufrufen: In einer vollständigen DOM-Umgebung
// (@vitest-environment happy-dom) erkennt der Container seine Bausteine nicht.
import { Window } from "happy-dom";

export function richteDomEin(): void {
  const fenster = new Window({ url: "http://localhost/" });
  const namen = [
    "document",
    "Event",
    "Node",
    "HTMLElement",
    "HTMLFormElement",
    "HTMLInputElement",
    "HTMLButtonElement",
    "HTMLAnchorElement",
    "HTMLParagraphElement",
  ] as const;
  for (const name of namen) {
    Object.defineProperty(globalThis, name, {
      value: fenster[name],
      configurable: true,
      writable: true,
    });
  }
}
