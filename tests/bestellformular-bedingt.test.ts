// Bestellformular, bedingte Teile (Aufgabe 020): Lieferadresse nur bei
// «Lieferung», Häkchen «mindestens 16» nur mit Wein.
// Browser-Umgebung: tests/hilfen/dom.ts (erst NACH dem Rendern); fetch ersetzt.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { MELDUNG as FORM, verbinde } from "../src/lib/formular/client";
import { defineSite } from "../src/lib/site";
import { MELDUNG } from "../src/sites/geschenkshop-ssbl/bestellregeln";
import { richteBestellformularEin } from "../src/sites/geschenkshop-ssbl/bestellformular";
import { pruefeProdukte } from "../src/sites/geschenkshop-ssbl/produkte";
import BestellMuster from "./fixtures/BestellMuster.astro";
import { richteDomEin } from "./hilfen/dom";

const site = defineSite({
  slug: "fixture",
  titel: "Fixture",
  beschreibung: "Fixture für das Bestellformular.",
  logoAlt: "Logo",
  kontakt: { email: "laedeli@example.ch" },
  formular: { empfaenger: "laedeli@example.ch", endpunkt: "/api/bestellung" },
});

const foto = "assets/products/keramik-schalen-set.jpg";
const alt = "Drei Keramikschalen";
const produkte = pruefeProdukte([
  { id: "schalen", name: "Schalen", foto, alt, preis: 24.5, stueck: 3 },
  { id: "wein", name: "Wein", foto, alt, preis: 18, stueck: 10, wein: true },
]);

let html: string;
beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(BestellMuster, {
    props: { site, produkte },
  });
  richteDomEin();
});

let form: HTMLFormElement;
let fetch: ReturnType<typeof vi.fn<typeof globalThis.fetch>>;
beforeEach(() => {
  document.body.innerHTML = html;
  form = document.getElementById("bestellung") as HTMLFormElement;
  richteBestellformularEin(form); // wie das Skript der Seite
  verbinde(form);
  fetch = vi.fn<typeof globalThis.fetch>(
    async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetch);
});
afterEach(() => vi.unstubAllGlobals());

const feld = (name: string) =>
  document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
const hinweis = (name: string) => document.getElementById(`${name}-fehler`)!;
const adresse = () => document.getElementById("bestellung-adresse")!;
const alter = () => document.getElementById("bestellung-alter")!;
const sende = () =>
  form.querySelector<HTMLButtonElement>("button[type=submit]")!.click();
const gesendet = () => JSON.parse(String(fetch.mock.calls[0][1]?.body));

function tippe(name: string, wert: string) {
  feld(name).value = wert;
  feld(name).dispatchEvent(new Event("input"));
}
function waehle(name: string, wert: string) {
  const el = document.querySelector<HTMLInputElement>(
    `[name="${name}"][value="${wert}"]`,
  )!;
  el.checked = true;
  el.dispatchEvent(new Event("change"));
}
function fuelleGueltig(weg: "abholung" | "lieferung") {
  tippe("menge-schalen", "1");
  tippe("name", "Muster");
  tippe("vorname", "Anna");
  tippe("email", "anna@example.ch");
  tippe("telefon", "079 123 45 67");
  waehle("zahlung", "twint");
  waehle("weg", weg);
  if (weg === "lieferung") {
    tippe("strasse", "Rathausen 1");
    tippe("plz", "6032");
    tippe("ort", "Emmen");
  }
}

describe("GS-24: Adressbereich nur bei Lieferung", () => {
  it("GS-24: beim Start unsichtbar", () => {
    expect(adresse().hidden).toBe(true);
  });

  it("GS-24: bei «Abholung» unsichtbar und kein Hinweis beim Absenden", async () => {
    fuelleGueltig("abholung");
    sende();
    expect(adresse().hidden).toBe(true);
    for (const name of ["strasse", "plz", "ort"]) {
      expect(hinweis(name).hidden).toBe(true);
    }
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("GS-24: bei «Lieferung» sichtbar, Felder Pflicht", () => {
    waehle("weg", "lieferung");
    expect(adresse().hidden).toBe(false);
    for (const name of ["strasse", "plz", "ort"]) {
      expect(feld(name).getAttribute("aria-required")).toBe("true");
      expect(
        document.querySelector(`label[for="${name}"]`)?.textContent,
      ).toContain("*");
    }
  });

  it("GS-24: zurück auf «Abholung» → unsichtbar, Hinweise weg, Adresse nicht im JSON", async () => {
    waehle("weg", "lieferung");
    sende(); // erzeugt Hinweise im Adressbereich
    expect(hinweis("strasse").hidden).toBe(false);
    fuelleGueltig("lieferung");
    waehle("weg", "abholung");
    expect(adresse().hidden).toBe(true);
    expect(hinweis("strasse").hidden).toBe(true);
    expect(feld("strasse").hasAttribute("aria-invalid")).toBe(false);
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const daten = gesendet();
    expect(daten.weg).toBe("abholung");
    expect(daten).not.toHaveProperty("strasse");
    expect(daten).not.toHaveProperty("plz");
    expect(daten).not.toHaveProperty("ort");
  });

  it("gültige Lieferung → Adresse im JSON", async () => {
    fuelleGueltig("lieferung");
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(gesendet()).toMatchObject({
      weg: "lieferung",
      strasse: "Rathausen 1",
      plz: "6032",
      ort: "Emmen",
    });
  });
});

describe("GS-25 bis GS-28: Felder der Lieferadresse", () => {
  it("GS-25: Lieferung ohne Strasse → Hinweis, kein fetch", () => {
    fuelleGueltig("lieferung");
    tippe("strasse", "");
    sende();
    expect(hinweis("strasse").textContent).toBe(FORM.pflicht);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ["", FORM.pflicht],
    ["600", MELDUNG.plz],
    ["60000", MELDUNG.plz],
  ])("GS-26: PLZ «%s» → Hinweis", (plz, meldung) => {
    fuelleGueltig("lieferung");
    tippe("plz", plz);
    sende();
    expect(hinweis("plz").hidden).toBe(false);
    expect(hinweis("plz").textContent).toBe(meldung);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("GS-26: PLZ «600» → Hinweis schon beim Verlassen des Feldes", () => {
    waehle("weg", "lieferung");
    tippe("plz", "600");
    feld("plz").dispatchEvent(new Event("blur"));
    expect(hinweis("plz").textContent).toBe(MELDUNG.plz);
  });

  it("GS-26: PLZ «6020» → kein Hinweis", async () => {
    fuelleGueltig("lieferung");
    tippe("plz", "6020");
    sende();
    expect(hinweis("plz").hidden).toBe(true);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("GS-27: Ort leer → Hinweis", () => {
    fuelleGueltig("lieferung");
    tippe("ort", "");
    sende();
    expect(hinweis("ort").textContent).toBe(FORM.pflicht);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("GS-28: im Adressbereich steht «Lieferung nur innerhalb der Schweiz»", () => {
    expect(adresse().textContent).toContain(
      "Lieferung nur innerhalb der Schweiz",
    );
  });
});

describe("GS-30: Häkchen «mindestens 16» nur mit Wein", () => {
  it("GS-30: Wein-Menge 1 → Häkchen sichtbar; ohne Haken Hinweis und kein fetch", () => {
    fuelleGueltig("abholung");
    tippe("menge-wein", "1");
    expect(alter().hidden).toBe(false);
    expect(feld("alter16").getAttribute("aria-required")).toBe("true");
    sende();
    expect(hinweis("alter16").hidden).toBe(false);
    expect(hinweis("alter16").textContent).toBe(FORM.haekchen);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("GS-30: Wein mit Haken → gesendet mit alter16: true", async () => {
    fuelleGueltig("abholung");
    tippe("menge-wein", "1");
    feld("alter16").checked = true;
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(gesendet()).toMatchObject({ alter16: true, mengen: { wein: 1 } });
  });

  it("GS-30: Wein-Menge zurück auf 0 → Häkchen unsichtbar, Hinweis weg", () => {
    fuelleGueltig("abholung");
    tippe("menge-wein", "1");
    sende();
    tippe("menge-wein", "0");
    expect(alter().hidden).toBe(true);
    expect(hinweis("alter16").hidden).toBe(true);
  });

  it("GS-30: nur Nicht-Wein bestellt → Häkchen nie sichtbar, nicht im JSON", async () => {
    expect(alter().hidden).toBe(true);
    fuelleGueltig("lieferung");
    tippe("menge-schalen", "3");
    expect(alter().hidden).toBe(true);
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(gesendet()).not.toHaveProperty("alter16");
  });
});
