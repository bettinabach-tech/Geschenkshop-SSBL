// Bestell-Mails (Aufgabe 021): Mail an das Lädeli (GS-32) und Bestätigung
// (GS-33), dazu der ganze Weg über den Bestell-Empfänger mit Fake-Versand.
import { describe, expect, it, vi } from "vitest";
import type { Mail } from "../src/server/empfaenger";
import { getSite } from "../src/lib/sites";
import {
  erstelleBestellEmpfaenger,
  schlussMeldung,
} from "../src/sites/geschenkshop-ssbl/empfaenger";
import { baueMails } from "../src/sites/geschenkshop-ssbl/mails";
import { pruefeProdukte } from "../src/sites/geschenkshop-ssbl/produkte";

const site = getSite("geschenkshop-ssbl");
const foto = "assets/products/keramik-schalen-set.jpg";
const alt = "Foto";
// Erfundene Preise (die echte Liste hat noch keine).
const produkte = pruefeProdukte([
  {
    id: "schalen",
    name: "Keramik-Schalen-Set",
    foto,
    alt,
    preis: 24.5,
    stueck: 5,
  },
  { id: "holz", name: "Anzündholz-Bündel", foto, alt, preis: 0.1, stueck: 9 },
  {
    id: "divico",
    name: "Klosterwein Rathausen Divico",
    foto,
    alt,
    preis: 18,
    stueck: 6,
    wein: true,
  },
]);

// 12.12.2026, 14:03 Uhr Zürcher Zeit (Winterzeit, UTC+1)
const EINGANG = new Date("2026-12-12T13:03:00Z");

const abholung = {
  mengen: { schalen: 2, holz: 0, divico: 0 },
  name: "Muster",
  vorname: "Anna",
  email: "anna@example.ch",
  telefon: "079 123 45 67",
  weg: "abholung",
  zahlung: "twint",
  website: "",
};
const lieferungMitWein = {
  ...abholung,
  mengen: { schalen: 2, holz: 0, divico: 1 },
  weg: "lieferung",
  strasse: "Rathausen 1",
  plz: "6032",
  ort: "Emmen",
  zahlung: "karte",
  alter16: true,
};

const mails = (daten: Record<string, unknown>) =>
  baueMails(daten, produkte, site, EINGANG);

describe("GS-32: Mail an das Lädeli", () => {
  const [laedeli] = mails(lieferungMitWein);
  const [laedeliAbholung] = mails(abholung);

  it("GS-32: geht an laedeli@ssbl.ch, Antworten an die bestellende Person", () => {
    expect(laedeli.an).toBe("laedeli@ssbl.ch");
    expect(laedeli.antwortAn).toBe("anna@example.ch");
    expect(laedeli.betreff).toBe("Neue Bestellung: Anna Muster");
  });

  it("GS-32: jedes bestellte Produkt mit Menge und Einzelpreis", () => {
    expect(laedeli.text).toContain(
      "- 2 × Keramik-Schalen-Set à CHF 24.50 = CHF 49.00",
    );
    expect(laedeli.text).toContain(
      "- 1 × Klosterwein Rathausen Divico à CHF 18.00 = CHF 18.00",
    );
  });

  it("GS-32: Produkte mit Menge 0 erscheinen nicht", () => {
    expect(laedeli.text).not.toContain("Anzündholz");
  });

  it("GS-32: Summe der Produkte (ohne Versand)", () => {
    expect(laedeli.text).toContain("Summe Produkte: CHF 67.00 (ohne Versand)");
  });

  it.each([
    ["Name", "Name: Muster"],
    ["Vorname", "Vorname: Anna"],
    ["E-Mail", "E-Mail: anna@example.ch"],
    ["Telefon", "Telefon: 079 123 45 67"],
    ["Zahlungsart", "Zahlungsart: Karte"],
  ])("GS-32: enthält %s", (_teil, zeile) => {
    expect(laedeli.text).toContain(zeile);
  });

  it("GS-32: «Lieferung» mit Strasse, PLZ und Ort", () => {
    expect(laedeli.text).toContain(
      "Lieferung per Post an:\nRathausen 1\n6032 Emmen",
    );
  });

  it("GS-32: «Abholung» ohne Strasse, PLZ und Ort", () => {
    expect(laedeliAbholung.text).toContain("Abholung im Lädeli in Rathausen");
    expect(laedeliAbholung.text).not.toContain("Lieferung per Post");
    expect(laedeliAbholung.text).not.toMatch(/Rathausen 1|6032|Emmen/);
    expect(laedeliAbholung.text).toContain("Zahlungsart: Twint");
  });

  it("GS-32: Altersbestätigung bei Wein, nicht ohne Wein", () => {
    expect(laedeli.text).toContain("Altersbestätigung: mindestens 16 Jahre");
    expect(laedeliAbholung.text).not.toContain("Altersbestätigung");
  });

  it("GS-32: Eingangszeit in Zürcher Zeit (Winter- und Sommerzeit)", () => {
    expect(laedeli.text).toContain("Eingang: 12.12.2026, 14:03 Uhr");
    const [sommer] = baueMails(
      abholung,
      produkte,
      site,
      new Date("2026-07-01T12:00:00Z"),
    );
    expect(sommer.text).toContain("Eingang: 01.07.2026, 14:00 Uhr");
  });

  it("rechnet in Rappen: 3 × CHF 0.10 = CHF 0.30", () => {
    const [m] = mails({ ...abholung, mengen: { holz: 3 } });
    expect(m.text).toContain("- 3 × Anzündholz-Bündel à CHF 0.10 = CHF 0.30");
    expect(m.text).toContain("Summe Produkte: CHF 0.30");
  });
});

describe("GS-33: Bestätigung an die bestellende Person", () => {
  const [, bestaetigung] = mails(lieferungMitWein);
  const [, bestaetigungAbholung] = mails(abholung);

  it("GS-33: geht an die E-Mail der bestellenden Person", () => {
    expect(bestaetigung.an).toBe("anna@example.ch");
  });

  it("GS-33: bestätigt den Eingang («eingegangen» in Betreff und Text)", () => {
    expect(bestaetigung.betreff).toBe(
      "Ihre Bestellung im Geschenkshop der SSBL ist eingegangen",
    );
    expect(bestaetigung.betreff).toContain("Bestellung");
    expect(bestaetigung.text).toContain(
      "Sie ist am 12.12.2026 um 14:03 Uhr bei uns eingegangen.",
    );
  });

  it("GS-33: jedes bestellte Produkt mit Menge", () => {
    expect(bestaetigung.text).toContain("2 × Keramik-Schalen-Set");
    expect(bestaetigung.text).toContain("1 × Klosterwein Rathausen Divico");
  });

  it("GS-33: «2 Arbeitstagen» und «verbindlich»", () => {
    expect(bestaetigung.text).toContain(
      "Das Lädeli meldet sich innert 2 Arbeitstagen mit den Zahlungs- bzw. Abholinformationen.",
    );
    expect(bestaetigung.text).toContain(
      "Ihre Bestellung wird erst mit dieser Rückmeldung verbindlich.",
    );
  });

  it("GS-33: Übersicht der Angaben, Anrede in Sie-Form, Kontakt", () => {
    expect(bestaetigung.text).toMatch(/^Guten Tag Anna Muster\n/);
    expect(bestaetigung.text).toContain("Telefon: 079 123 45 67");
    expect(bestaetigung.text).toContain(
      "Lieferung per Post an: Rathausen 1, 6032 Emmen",
    );
    expect(bestaetigung.text).toContain("Zahlungsart: Karte");
    expect(bestaetigung.text).toContain(
      "Fragen? Schreiben Sie an laedeli@ssbl.ch.",
    );
  });

  it("GS-33: «ohne Versandkosten» nur bei Lieferung", () => {
    expect(bestaetigung.text).toContain(
      "Summe Produkte: CHF 67.00 (ohne Versandkosten)",
    );
    expect(bestaetigungAbholung.text).toContain("Summe Produkte: CHF 49.00\n");
    expect(bestaetigungAbholung.text).toContain(
      "Abholung im Lädeli in Rathausen",
    );
  });
});

describe("eingeschleuste Zeilen", () => {
  it("Name «Muster\\nBcc: x@y.ch» ergibt einen einzeiligen Betreff", () => {
    const [laedeli, bestaetigung] = mails({
      ...abholung,
      name: "Muster\nBcc: x@y.ch",
      vorname: "Anna\r\n",
    });
    for (const betreff of [laedeli.betreff, bestaetigung.betreff]) {
      expect(betreff).not.toMatch(/[\r\n]/);
    }
    expect(laedeli.betreff).toBe("Neue Bestellung: Anna Muster Bcc: x@y.ch");
    // Auch im Text keine eigene Zeile «Bcc: …»
    expect(laedeli.text).not.toMatch(/^Bcc:/m);
  });
});

describe("Bestell-Empfänger: ganzer Weg mit Fake-Versand", () => {
  function empfaenger(jetzt: Date) {
    const versand = vi.fn<(mail: Mail) => Promise<void>>(async () => {});
    const annehmen = erstelleBestellEmpfaenger({
      produkte,
      site,
      versand,
      jetzt: () => jetzt,
      protokolliere: vi.fn(),
    });
    return { annehmen, versand };
  }
  const post = (daten: unknown) => ({
    methode: "POST",
    body: JSON.stringify(daten),
  });

  it("gültige Bestellung → 200, zwei Mails, Lädeli zuerst", async () => {
    const { annehmen, versand } = empfaenger(EINGANG);
    const antwort = await annehmen(post(lieferungMitWein));
    expect(antwort.status).toBe(200);
    expect(versand).toHaveBeenCalledTimes(2);
    expect(versand.mock.calls[0][0].an).toBe("laedeli@ssbl.ch");
    expect(versand.mock.calls[1][0].an).toBe("anna@example.ch");
  });

  it("Leerzeichen werden entfernt, Adresse bei Abholung weggelassen", async () => {
    const { annehmen, versand } = empfaenger(EINGANG);
    await annehmen(
      post({ ...abholung, name: "  Muster ", strasse: "Geheimweg 9" }),
    );
    const [laedeli] = versand.mock.calls.map((c) => c[0]);
    expect(laedeli.text).toContain("Name: Muster\n");
    expect(laedeli.text).not.toContain("Geheimweg");
  });

  it("Regeln verletzt → 400 mit Hinweisen, keine Mail", async () => {
    const { annehmen, versand } = empfaenger(EINGANG);
    const antwort = await annehmen(
      post({ ...lieferungMitWein, alter16: false }),
    );
    expect(antwort.status).toBe(400);
    expect(antwort.json).toMatchObject({
      fehler: { alter16: expect.any(String) },
    });
    expect(versand).not.toHaveBeenCalled();
  });

  it("15.12.2026 23:59:59.999 Zürcher Zeit → 200", async () => {
    const { annehmen } = empfaenger(new Date("2026-12-15T23:59:59.999+01:00"));
    expect((await annehmen(post(abholung))).status).toBe(200);
  });

  it("16.12.2026 00:00:00 Zürcher Zeit → 410 «Bestellschluss vorbei», keine Mail", async () => {
    const { annehmen, versand } = empfaenger(
      new Date("2026-12-16T00:00:00+01:00"),
    );
    const antwort = await annehmen(post(abholung));
    expect(antwort.status).toBe(410);
    expect(antwort.json).toEqual({
      ok: false,
      fehler: {
        _formular:
          "Bestellschluss vorbei: Seit dem 16.12.2026 nehmen wir keine Bestellungen mehr an. Herzlichen Dank für Ihr Interesse!",
      },
    });
    expect(versand).not.toHaveBeenCalled();
  });

  it("schlussMeldung nennt das Datum in Zürcher Zeit", () => {
    expect(schlussMeldung(new Date("2026-12-15T23:00:00Z"))).toContain(
      "16.12.2026",
    );
  });
});
