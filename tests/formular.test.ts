// Formular-Bausteine mit Prüfung am Feld (Aufgabe 009, F-26 bis F-30).
// Das HTML kommt aus den echten Bausteinen (tests/fixtures/FormularMuster.astro);
// fetch wird im Test ersetzt.
// Browser-Umgebung: tests/hilfen/dom.ts (erst NACH dem Rendern).
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { readFileSync } from "node:fs";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { MELDUNG, verbinde, type Zusatz } from "../src/lib/formular/client";
import { defineSite } from "../src/lib/site";
import FormularMuster from "./fixtures/FormularMuster.astro";
import { richteDomEin } from "./hilfen/dom";

const TELEFON = "041 123 45 67";
const EMAIL = "laedeli@example.ch";
const site = defineSite({
  slug: "fixture",
  titel: "Fixture",
  beschreibung: "Fixture für Formulare.",
  logoAlt: "Logo",
  kontakt: { email: EMAIL, telefon: TELEFON },
  formular: { empfaenger: EMAIL, endpunkt: "/api/bestellung" },
});

let html: string;
beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(FormularMuster, { props: { site } });
  richteDomEin();
});

let form: HTMLFormElement;
function aufbauen(pruefeZusatz?: Zusatz) {
  document.body.innerHTML = html;
  form = document.getElementById("test") as HTMLFormElement;
  verbinde(form, { pruefeZusatz });
}
beforeEach(() => aufbauen());
afterEach(() => vi.unstubAllGlobals());

const feld = (name: string) =>
  document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
const hinweis = (name: string) => document.getElementById(`${name}-fehler`)!;
const knopf = () =>
  form.querySelector<HTMLButtonElement>("button[type=submit]")!;
const oben = () => document.getElementById("test-meldung")!;
const danke = () => document.getElementById("test-danke")!;

function tippe(name: string, wert: string) {
  const el = feld(name);
  el.value = wert;
  el.dispatchEvent(new Event("input"));
}
function verlasse(name: string) {
  feld(name).dispatchEvent(new Event("blur"));
}
function fuelleGueltig() {
  tippe("name", "Muster");
  tippe("email", "anna@example.ch");
  tippe("telefon", "079 123 45 67");
  feld("weg").checked = true; // erste Option: Lieferung
  tippe("menge-keramik", "2");
  feld("alter16").checked = true;
}
function sende() {
  knopf().click();
}
const antwort = (status: number, json: unknown) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const zeigt = (el: HTMLElement, text: string) => {
  expect(el.hidden).toBe(false);
  expect(el.textContent).toContain(text);
};

describe("F-26: Pflichtfelder sichtbar markiert", () => {
  it("F-26: über dem Formular steht «* Pflichtfeld»", () => {
    expect(form.querySelector(".formular__pflicht")?.textContent).toBe(
      "* Pflichtfeld",
    );
  });

  it.each(["name", "email", "telefon", "alter16"])(
    "F-26: Pflichtfeld «%s» zeigt «*» und hat aria-required=true",
    (name) => {
      const label = document.querySelector(`label[for="${name}"]`)!;
      expect(label.textContent).toContain("*");
      expect(feld(name).getAttribute("aria-required")).toBe("true");
    },
  );

  it("F-26: Pflicht-Auswahl zeigt «*» in der Legende und aria-required an der Gruppe", () => {
    const gruppe = feld("weg").closest("fieldset")!;
    expect(gruppe.querySelector("legend")?.textContent).toContain("*");
    expect(gruppe.getAttribute("aria-required")).toBe("true");
  });

  it("F-26: freiwillige Felder zeigen keinen Stern", () => {
    expect(
      document.querySelector('label[for="bemerkung"]')?.textContent,
    ).not.toContain("*");
    expect(feld("bemerkung").hasAttribute("aria-required")).toBe(false);
  });
});

describe("F-27: Hinweis direkt am Feld", () => {
  it("F-27: leere Pflichtfelder → Hinweis am Feld beim Absenden, fetch NICHT aufgerufen", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    sende();
    zeigt(hinweis("name"), MELDUNG.pflicht);
    zeigt(hinweis("email"), MELDUNG.pflicht);
    zeigt(hinweis("weg"), MELDUNG.auswahl);
    zeigt(hinweis("alter16"), MELDUNG.haekchen);
    expect(feld("name").getAttribute("aria-invalid")).toBe("true");
    expect(feld("name").getAttribute("aria-describedby")).toBe("name-fehler");
    expect(document.activeElement).toBe(feld("name"));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("F-27: E-Mail «abc» → Hinweis beim Verlassen des Feldes", () => {
    tippe("email", "abc");
    verlasse("email");
    zeigt(hinweis("email"), MELDUNG.email);
    expect(feld("email").getAttribute("aria-invalid")).toBe("true");
  });

  it("F-27: gültige E-Mail → kein Hinweis", () => {
    tippe("email", "anna@example.ch");
    verlasse("email");
    expect(hinweis("email").hidden).toBe(true);
    expect(feld("email").hasAttribute("aria-invalid")).toBe(false);
  });

  it("F-27: Hinweis verschwindet, sobald die Eingabe passt", () => {
    tippe("email", "abc");
    verlasse("email");
    tippe("email", "anna@example.ch");
    expect(hinweis("email").hidden).toBe(true);
  });

  it("F-27: Telefon «123» → Hinweis", () => {
    tippe("telefon", "123");
    verlasse("telefon");
    zeigt(hinweis("telefon"), MELDUNG.telefon);
  });

  it("F-27: Telefon mit + und Leerzeichen und 9+ Ziffern → kein Hinweis", () => {
    tippe("telefon", "+41 79 123 45 67");
    verlasse("telefon");
    expect(hinweis("telefon").hidden).toBe(true);
  });

  it("F-27: Menge über max → Hinweis mit erlaubtem Bereich", () => {
    tippe("menge-keramik", "6");
    verlasse("menge-keramik");
    zeigt(hinweis("menge-keramik"), MELDUNG.zahl("0", "5"));
  });

  it("F-27: Zusatzprüfung meldet einen Fehler → Hinweis am genannten Feld", () => {
    aufbauen(() => ({ "menge-keramik": "Nur noch 1 Stück verfügbar." }));
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    fuelleGueltig();
    sende();
    zeigt(hinweis("menge-keramik"), "Nur noch 1 Stück verfügbar.");
    expect(document.activeElement).toBe(feld("menge-keramik"));
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("F-28: Button gesperrt während des Sendens", () => {
  it("F-28: nach dem Klick gesperrt mit «Wird gesendet …»; zweiter Klick → genau 1 fetch", () => {
    const fetch = vi.fn(() => new Promise<Response>(() => {})); // hängt
    vi.stubGlobal("fetch", fetch);
    fuelleGueltig();
    sende();
    expect(knopf().disabled).toBe(true);
    expect(knopf().textContent).toBe("Wird gesendet …");
    sende();
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("F-29: Danke statt Formular", () => {
  it("F-29: Antwort 200 → Formular unsichtbar, Danke-Text sichtbar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => antwort(200, { ok: true })),
    );
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(form.hidden).toBe(true));
    zeigt(danke(), "Danke für Ihre Bestellung.");
  });
});

describe("F-30: technischer Fehler", () => {
  function pruefeFehlerbild() {
    zeigt(oben(), `Telefon ${TELEFON}`);
    zeigt(oben(), `E-Mail ${EMAIL}`);
    expect(oben().querySelector('a[href="tel:0411234567"]')).not.toBeNull();
    expect(oben().querySelector(`a[href="mailto:${EMAIL}"]`)).not.toBeNull();
    expect(feld("name").value).toBe("Muster");
    expect(feld("email").value).toBe("anna@example.ch");
    expect(feld("telefon").value).toBe("079 123 45 67");
    expect(feld("weg").checked).toBe(true);
    expect(feld("menge-keramik").value).toBe("2");
    expect(feld("alter16").checked).toBe(true);
    expect(form.hidden).toBe(false);
    expect(knopf().disabled).toBe(false);
    expect(knopf().textContent?.trim()).toBe("Absenden");
  }

  it("F-30: Netzfehler → Hinweis mit Telefon und E-Mail, Eingaben bleiben, Button frei", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(oben().hidden).toBe(false));
    pruefeFehlerbild();
  });

  it("F-30: Antwort 500 → dasselbe", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => antwort(500, {})),
    );
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(oben().hidden).toBe(false));
    pruefeFehlerbild();
  });

  it("F-30: nach dem Fehler kann erneut gesendet werden", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(antwort(200, { ok: true }));
    vi.stubGlobal("fetch", fetch);
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(knopf().disabled).toBe(false));
    sende();
    await vi.waitFor(() => expect(form.hidden).toBe(true));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("Antwort 4xx mit Hinweisen vom Server", () => {
  it("Hinweise erscheinen am Feld bzw. oben (_formular), Button wieder frei", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        antwort(400, {
          fehler: {
            email: "Diese Adresse kennt der Server nicht.",
            _formular: "Bitte prüfen Sie Ihre Angaben.",
          },
        }),
      ),
    );
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(knopf().disabled).toBe(false));
    zeigt(hinweis("email"), "Diese Adresse kennt der Server nicht.");
    zeigt(oben(), "Bitte prüfen Sie Ihre Angaben.");
    expect(form.hidden).toBe(false);
  });
});

describe("Gesendete Daten und Spam-Falle", () => {
  it("sendet JSON an den Endpunkt; Mengen verschachtelt, Häkchen als true/false", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async () =>
      antwort(200, { ok: true }),
    );
    vi.stubGlobal("fetch", fetch);
    fuelleGueltig();
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("/api/bestellung");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      name: "Muster",
      email: "anna@example.ch",
      telefon: "079 123 45 67",
      bemerkung: "",
      weg: "lieferung",
      mengen: { keramik: 2 },
      alter16: true,
      website: "",
    });
  });

  it("Spam-Feld «website» wird mitgesendet, ist aber nicht sichtbar und nicht per Tab erreichbar", () => {
    const falle = feld("website");
    expect(falle.getAttribute("tabindex")).toBe("-1");
    expect(falle.getAttribute("autocomplete")).toBe("off");
    const huelle = falle.closest(".formular__falle")!;
    expect(huelle.getAttribute("aria-hidden")).toBe("true");
    const css = readFileSync("src/styles/formular.css", "utf8");
    expect(css).toMatch(/\.formular__falle\s*\{[^}]*left:\s*-10000px/);
  });

  it("ausgeblendete Felder werden weder geprüft noch gesendet", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async () =>
      antwort(200, { ok: true }),
    );
    vi.stubGlobal("fetch", fetch);
    fuelleGueltig();
    feld("alter16").checked = false;
    feld("alter16").closest(".feld")!.setAttribute("hidden", "");
    sende();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(JSON.parse(String(fetch.mock.calls[0][1]?.body))).not.toHaveProperty(
      "alter16",
    );
  });
});
