// Bestellschluss (Aufgabe 022): ab 16.12.2026, 00:00 Zürcher Zeit verschwinden
// Formular und Mengenfelder (GS-36); eine vorher geöffnete Seite erhält beim
// Absenden «Bestellschluss vorbei» (GS-37). Feste Uhr — die Grenzen sind exakt.
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
import { pruefeSchluss, verbinde } from "../src/lib/formular/client";
import { getSite } from "../src/lib/sites";
import Geschenkshop from "../src/pages/geschenkshop-ssbl/index.astro";
import { richteBestellformularEin } from "../src/sites/geschenkshop-ssbl/bestellformular";
import { erstelleBestellEmpfaenger } from "../src/sites/geschenkshop-ssbl/empfaenger";
import { produkte as echteProdukte } from "../src/sites/geschenkshop-ssbl/produkte";
import BestellMuster from "./fixtures/BestellMuster.astro";
import { richteDomEin } from "./hilfen/dom";

const echteSite = getSite("geschenkshop-ssbl");
// Echter Bestellschluss; Test-Adresse für den Empfänger (die echte kommt mit 027).
const site = {
  ...echteSite,
  formular: { ...echteSite.formular, endpunkt: "/api/bestellung" },
};
const VOR_SCHLUSS = new Date("2026-12-15T23:59:59+01:00");
const SCHLUSS = new Date("2026-12-16T00:00:00+01:00");
const JANUAR = new Date("2027-01-20T12:00:00+01:00");
const HINWEIS =
  "Der Bestellschluss war am 15.12.2026. Herzlichen Dank für Ihr Interesse!";

// Die 5 echten Produkte, mit erfundenen Preisen bestellbar gemacht.
const produkte = echteProdukte.map((p) => ({ ...p, preis: 20, stueck: 5 }));

let offenHtml: string; // gebaut vor dem Schluss
let geschlossenHtml: string; // gebaut nach dem Schluss
let shopGeschlossen: string;
beforeAll(async () => {
  const container = await AstroContainer.create();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-01T10:00:00+01:00"));
  offenHtml = await container.renderToString(BestellMuster, {
    props: { site, produkte },
  });
  vi.setSystemTime(SCHLUSS);
  geschlossenHtml = await container.renderToString(BestellMuster, {
    props: { site, produkte },
  });
  shopGeschlossen = await container.renderToString(Geschenkshop);
  vi.useRealTimers();
  richteDomEin();
});

let form: HTMLFormElement;
beforeEach(() => {
  document.body.innerHTML = offenHtml;
  form = document.getElementById("bestellung") as HTMLFormElement;
});
afterEach(() => vi.unstubAllGlobals());

const hinweis = () => document.getElementById("bestellung-schluss")!;
const mengenFelder = () =>
  Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name^="menge-"]'),
  );
const sichtbar = (el: Element) => !el.closest("[hidden]");

describe("GS-36: Formular verschwindet beim Laden ab Bestellschluss", () => {
  it("die Testseite hat 5 Produktkarten mit Mengenfeldern", () => {
    expect(document.querySelectorAll(".produkt")).toHaveLength(5);
    expect(mengenFelder()).toHaveLength(5);
  });

  it("GS-36: 15.12.2026 23:59:59 Zürcher Zeit → Formular sichtbar", () => {
    expect(pruefeSchluss(form, VOR_SCHLUSS)).toBe(false);
    expect(sichtbar(form)).toBe(true);
    expect(mengenFelder().every(sichtbar)).toBe(true);
    expect(hinweis().hidden).toBe(true);
  });

  it.each([
    ["16.12.2026 00:00:00", SCHLUSS],
    ["20.01.2027", JANUAR],
  ])(
    "GS-36: %s → Formular und Mengenfelder unsichtbar, Hinweis sichtbar, alle 5 Produktkarten sichtbar",
    (_wann, jetzt) => {
      expect(pruefeSchluss(form, jetzt)).toBe(true);
      expect(sichtbar(form)).toBe(false);
      expect(mengenFelder().some(sichtbar)).toBe(false);
      expect(hinweis().hidden).toBe(false);
      expect(hinweis().textContent?.trim()).toBe(HINWEIS);
      const karten = Array.from(document.querySelectorAll(".produkt"));
      expect(karten).toHaveLength(5);
      expect(karten.every(sichtbar)).toBe(true);
    },
  );
});

describe("GS-36: nach dem Schluss gebaut → gar kein Formular", () => {
  it("GS-36: kein <form>, der Hinweis ist ohne JavaScript sichtbar", () => {
    document.body.innerHTML = geschlossenHtml;
    expect(document.querySelector("form")).toBeNull();
    expect(hinweis().hidden).toBe(false);
    expect(hinweis().textContent?.trim()).toBe(HINWEIS);
  });

  it("GS-36: die Shop-Seite zeigt nach dem Schluss den Hinweis, keine Mengenfelder, alle Produkte", () => {
    document.body.innerHTML = shopGeschlossen;
    expect(document.querySelector("form#bestellung")).toBeNull();
    expect(mengenFelder()).toHaveLength(0);
    expect(hinweis().hidden).toBe(false);
    expect(document.querySelectorAll(".produkt")).toHaveLength(5);
  });

  it("vor dem Schluss gebaut → Formular da, Hinweis versteckt", () => {
    expect(document.querySelector("form#bestellung")).not.toBeNull();
    expect(hinweis().hidden).toBe(true);
  });
});

describe("GS-37: Seite vor dem Schluss geöffnet, nach dem Schluss abgeschickt", () => {
  it("GS-37: Antwort 410 → «Bestellschluss vorbei» oben am Formular, keine Danke-Meldung", async () => {
    // Der echte Bestell-Empfänger (021) antwortet — mit der Uhr nach Schluss.
    const annehmen = erstelleBestellEmpfaenger({
      produkte,
      site,
      versand: vi.fn(async () => {}),
      jetzt: () => SCHLUSS,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const antwort = await annehmen({
          methode: String(init?.method),
          body: String(init?.body),
        });
        return new Response(JSON.stringify(antwort.json), {
          status: antwort.status,
          headers: { "Content-Type": "application/json" },
        });
      }),
    );
    richteBestellformularEin(form);
    verbinde(form);
    const tippe = (name: string, wert: string) => {
      const el = document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
      el.value = wert;
      el.dispatchEvent(new Event("input"));
    };
    tippe("menge-keramik-schalen-set", "1");
    tippe("name", "Muster");
    tippe("vorname", "Anna");
    tippe("email", "anna@example.ch");
    tippe("telefon", "079 123 45 67");
    document.querySelector<HTMLInputElement>(
      '[name="weg"][value="abholung"]',
    )!.checked = true;
    document.querySelector<HTMLInputElement>(
      '[name="zahlung"][value="twint"]',
    )!.checked = true;
    form.querySelector<HTMLButtonElement>("button[type=submit]")!.click();

    const oben = document.getElementById("bestellung-meldung")!;
    await vi.waitFor(() => expect(oben.hidden).toBe(false));
    expect(oben.textContent).toContain("Bestellschluss vorbei");
    expect(document.getElementById("bestellung-danke")!.hidden).toBe(true);
    expect(sichtbar(form)).toBe(true);
  });

  it("GS-37: der Server-Weg liefert bei 16.12.2026 00:00:00 Zürcher Zeit Status 410", async () => {
    const versand = vi.fn(async () => {});
    const annehmen = erstelleBestellEmpfaenger({
      produkte,
      site,
      versand,
      jetzt: () => SCHLUSS,
    });
    const antwort = await annehmen({
      methode: "POST",
      body: JSON.stringify({ mengen: { "keramik-schalen-set": 1 } }),
    });
    expect(antwort.status).toBe(410);
    expect(versand).not.toHaveBeenCalled();
  });
});
