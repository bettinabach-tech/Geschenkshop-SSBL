// Bestellformular des Geschenkshops (Aufgabe 019): Mengen in den Produktkarten,
// Kontakt, Lieferweg, Zahlungsart; Prüfung mit den Bestellregeln (018).
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
  kontakt: { email: "laedeli@example.ch", telefon: "041 123 45 67" },
  formular: { empfaenger: "laedeli@example.ch", endpunkt: "/api/bestellung" },
});

// Erfundene Werte für jeden Zustand (die echte Liste hat noch keine Preise).
const foto = "assets/products/keramik-schalen-set.jpg";
const alt = "Drei Keramikschalen";
const produkte = pruefeProdukte([
  { id: "schalen", name: "Schalen", foto, alt, preis: 24.5, stueck: 3 },
  { id: "holz", name: "Holz", foto, alt, preis: 12, stueck: 0 },
  { id: "neu", name: "Neu", foto, alt },
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
beforeEach(() => {
  document.body.innerHTML = html;
  form = document.getElementById("bestellung") as HTMLFormElement;
  richteBestellformularEin(form); // wie das Skript der Seite
  verbinde(form);
});
afterEach(() => vi.unstubAllGlobals());

const feld = (name: string) =>
  document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
const option = (name: string, wert: string) =>
  document.querySelector<HTMLInputElement>(
    `[name="${name}"][value="${wert}"]`,
  )!;
const hinweis = (name: string) => document.getElementById(`${name}-fehler`)!;
const zeigt = (name: string, text: string) => {
  expect(hinweis(name).hidden).toBe(false);
  expect(hinweis(name).textContent).toBe(text);
};
const sende = () =>
  form.querySelector<HTMLButtonElement>("button[type=submit]")!.click();

function tippe(name: string, wert: string) {
  feld(name).value = wert;
  feld(name).dispatchEvent(new Event("input"));
}
function fuelleGueltig() {
  tippe("menge-schalen", "2");
  tippe("name", "Muster");
  tippe("vorname", "Anna");
  tippe("email", "anna@example.ch");
  tippe("telefon", "079 123 45 67");
  option("weg", "abholung").checked = true;
  option("zahlung", "twint").checked = true;
}
function stubFetch() {
  const fetch = vi.fn<typeof globalThis.fetch>(
    async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

describe("GS-17: Mengenfelder in den Produktkarten", () => {
  it("GS-17: bestellbare Produkte haben ein Mengenfeld von 0 bis zur Stückzahl, Start 0", () => {
    for (const [id, max] of [
      ["schalen", "3"],
      ["wein", "10"],
    ]) {
      const menge = feld(`menge-${id}`);
      expect(menge.type).toBe("number");
      expect(menge.getAttribute("min")).toBe("0");
      expect(menge.getAttribute("max")).toBe(max);
      expect(menge.value).toBe("0");
      expect(menge.closest(`#produkt-${id}`)).not.toBeNull();
      expect(menge.getAttribute("form")).toBe("bestellung");
    }
  });

  it("GS-17: ausverkaufte und «Preis folgt»-Produkte haben kein Mengenfeld", () => {
    expect(document.querySelector('[name="menge-holz"]')).toBeNull();
    expect(document.querySelector('[name="menge-neu"]')).toBeNull();
  });

  it("GS-17: der Screenreader hört, zu welchem Produkt die Menge gehört", () => {
    const label = document.querySelector('label[for="menge-schalen"]')!;
    expect(label.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Menge Schalen",
    );
  });
});

describe("GS-18: mindestens ein Geschenk", () => {
  it("GS-18: alle Mengen 0 → Hinweis bei den Mengenfeldern, kein fetch", () => {
    const fetch = stubFetch();
    fuelleGueltig();
    tippe("menge-schalen", "0");
    sende();
    zeigt("mengen", MELDUNG.keineMenge);
    expect(feld("menge-schalen").getAttribute("aria-invalid")).toBe("true");
    expect(feld("menge-schalen").getAttribute("aria-describedby")).toContain(
      "mengen-fehler",
    );
    expect(document.activeElement).toBe(feld("menge-schalen"));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("GS-18: der Hinweis verschwindet, sobald eine Menge ≥ 1 gewählt ist", () => {
    stubFetch();
    fuelleGueltig();
    tippe("menge-schalen", "0");
    sende();
    tippe("menge-schalen", "1");
    expect(hinweis("mengen").hidden).toBe(true);
    expect(feld("menge-schalen").hasAttribute("aria-invalid")).toBe(false);
  });

  it("GS-18: der Hinweis erscheint nicht schon beim Durchtabben", () => {
    feld("menge-schalen").dispatchEvent(new Event("blur"));
    expect(hinweis("mengen").hidden).toBe(true);
  });

  it("mehr als verfügbar → Hinweis am Mengenfeld", () => {
    stubFetch();
    fuelleGueltig();
    tippe("menge-schalen", "4");
    sende();
    zeigt("menge-schalen", FORM.zahl("0", "3"));
  });
});

describe("GS-19 bis GS-22: Angaben zur Person", () => {
  it.each([
    ["GS-19", "name"],
    ["GS-20", "vorname"],
    ["GS-21", "email"],
    ["GS-22", "telefon"],
  ])("%s: «%s» leer → Hinweis, kein fetch", (_id, name) => {
    const fetch = stubFetch();
    fuelleGueltig();
    tippe(name, "");
    sende();
    zeigt(name, FORM.pflicht);
    expect(feld(name).getAttribute("aria-required")).toBe("true");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("GS-21: E-Mail «abc» → Hinweis", () => {
    tippe("email", "abc");
    feld("email").dispatchEvent(new Event("blur"));
    zeigt("email", FORM.email);
  });

  it("GS-22: Telefon «12» → Hinweis", () => {
    tippe("telefon", "12");
    feld("telefon").dispatchEvent(new Event("blur"));
    zeigt("telefon", FORM.telefon);
  });
});

describe("GS-23 und GS-29: Lieferweg und Zahlungsart", () => {
  it("GS-23: kein Weg gewählt → Hinweis", () => {
    stubFetch();
    fuelleGueltig();
    option("weg", "abholung").checked = false;
    sende();
    zeigt("weg", FORM.auswahl);
  });

  it("GS-29: keine Zahlungsart → Hinweis", () => {
    stubFetch();
    fuelleGueltig();
    option("zahlung", "twint").checked = false;
    sende();
    zeigt("zahlung", FORM.auswahl);
  });

  it("Reihenfolge: Name · Vorname · E-Mail · Telefon · Weg · (Adresse) · Zahlungsart · (Alter)", () => {
    const namen = Array.from(form.querySelectorAll("input"))
      .map((el) => el.name)
      .filter((n, i, alle) => n !== "website" && alle.indexOf(n) === i);
    // Adresse und Alter (Aufgabe 020) sind nur bei Bedarf sichtbar.
    expect(namen).toEqual([
      "name",
      "vorname",
      "email",
      "telefon",
      "weg",
      "strasse",
      "plz",
      "ort",
      "zahlung",
      "alter16",
    ]);
  });
});

describe("Absenden", () => {
  it("alles gültig → genau ein fetch mit mengen, name, vorname, email, telefon, weg, zahlung", async () => {
    const fetch = stubFetch();
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const daten = JSON.parse(String(fetch.mock.calls[0][1]?.body));
    expect(daten).toEqual({
      mengen: { schalen: 2, wein: 0 },
      name: "Muster",
      vorname: "Anna",
      email: "anna@example.ch",
      telefon: "079 123 45 67",
      weg: "abholung",
      zahlung: "twint",
      website: "",
    });
  });

  it("der Button heisst «Bestellung absenden» und ist der Kauf-Button", () => {
    const knopf = form.querySelector("button[type=submit]")!;
    expect(knopf.textContent?.trim()).toBe("Bestellung absenden");
    expect(knopf.classList.contains("kauf-button")).toBe(true);
  });

  it("GS-34: nach Antwort 200 nennt die Danke-Meldung «E-Mail» und «2 Arbeitstagen»", async () => {
    stubFetch();
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(form.hidden).toBe(true));
    const danke = document.getElementById("bestellung-danke")!;
    expect(danke.hidden).toBe(false);
    expect(danke.textContent).toContain("E-Mail");
    expect(danke.textContent).toContain("2 Arbeitstagen");
    expect(danke.textContent).toContain("Vielen Dank für Ihre Bestellung!");
  });
});
