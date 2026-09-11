// Formular-Empfänger (Aufgabe 010): jede Regel als eigener Fall, mit
// Fake-Versand und fester Uhr. Kein Mailserver, kein Netz.
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  MAX_BYTES,
  verarbeiteEinsendung,
  type Abhaengigkeiten,
  type Mail,
} from "../src/server/empfaenger";
import {
  SMTP_VARIABLEN,
  erstelleSmtpVersand,
  leseSmtpEinstellungen,
  type TransportFabrik,
} from "../src/server/smtp";

const SCHLUSS = new Date("2026-12-16T00:00:00+01:00");
const VOR_SCHLUSS = new Date(SCHLUSS.getTime() - 1);

const mailAnEmpfaenger: Mail = {
  an: "laedeli@example.ch",
  betreff: "Neue Bestellung",
  text: "…",
  antwortAn: "anna@example.ch",
};
const bestaetigung: Mail = {
  an: "anna@example.ch",
  betreff: "Bestellung eingegangen",
  text: "…",
};

function abhaengigkeiten(extra: Partial<Abhaengigkeiten> = {}) {
  const versand = vi.fn<(mail: Mail) => Promise<void>>(async () => {});
  const protokolliere = vi.fn<(text: string) => void>();
  const pruefe = vi.fn<Abhaengigkeiten["pruefe"]>(() => ({}));
  const baueMails = vi.fn<Abhaengigkeiten["baueMails"]>(
    () => [mailAnEmpfaenger, bestaetigung] as const,
  );
  const abh: Abhaengigkeiten = {
    pruefe,
    baueMails,
    schluss: SCHLUSS,
    jetzt: () => VOR_SCHLUSS,
    versand,
    meldungen: {
      schluss: "Bestellschluss vorbei.",
      versandFehler: "Versand gescheitert.",
    },
    protokolliere,
    ...extra,
  };
  return { abh, versand, protokolliere, pruefe, baueMails };
}

const post = (daten: unknown) => ({
  methode: "POST",
  body: typeof daten === "string" ? daten : JSON.stringify(daten),
});
const gueltig = { name: "Muster", email: "anna@example.ch", website: "" };

describe("Regel 1: nur POST", () => {
  it.each(["GET", "PUT", "DELETE", "HEAD"])(
    "%s → 405, keine Mail",
    async (methode) => {
      const { abh, versand } = abhaengigkeiten();
      const antwort = await verarbeiteEinsendung(
        { methode, body: JSON.stringify(gueltig) },
        abh,
      );
      expect(antwort.status).toBe(405);
      expect(versand).not.toHaveBeenCalled();
    },
  );

  it("«post» klein geschrieben gilt als POST", async () => {
    const { abh } = abhaengigkeiten();
    const antwort = await verarbeiteEinsendung(
      { methode: "post", body: JSON.stringify(gueltig) },
      abh,
    );
    expect(antwort.status).toBe(200);
  });
});

describe("Regel 2: gültiges JSON, höchstens 20 KB", () => {
  it.each([
    ["kein JSON", "name=Muster"],
    ["abgeschnittenes JSON", '{"name": "Mus'],
    ["leer", ""],
    ["JSON-Liste statt Objekt", "[1, 2]"],
    ["null", "null"],
    ["Zahl", "42"],
  ])("%s → 400, keine Mail", async (_fall, body) => {
    const { abh, versand, pruefe } = abhaengigkeiten();
    const antwort = await verarbeiteEinsendung({ methode: "POST", body }, abh);
    expect(antwort.status).toBe(400);
    expect(pruefe).not.toHaveBeenCalled();
    expect(versand).not.toHaveBeenCalled();
  });

  it("genau 20 KB → angenommen; 1 Byte mehr → 400", async () => {
    const huelle = JSON.stringify({ ...gueltig, bemerkung: "" });
    const fuellung = "x".repeat(MAX_BYTES - huelle.length);
    const genau = JSON.stringify({ ...gueltig, bemerkung: fuellung });
    expect(new TextEncoder().encode(genau).length).toBe(MAX_BYTES);

    const { abh } = abhaengigkeiten();
    expect((await verarbeiteEinsendung(post(genau), abh)).status).toBe(200);
    const zuGross = JSON.stringify({ ...gueltig, bemerkung: fuellung + "x" });
    expect((await verarbeiteEinsendung(post(zuGross), abh)).status).toBe(400);
  });

  it("zählt Bytes, nicht Zeichen (Umlaute zählen doppelt)", async () => {
    const huelle = JSON.stringify({ ...gueltig, bemerkung: "" });
    const umlaute = "ä".repeat(Math.ceil((MAX_BYTES - huelle.length) / 2) + 1);
    const body = JSON.stringify({ ...gueltig, bemerkung: umlaute });
    expect(body.length).toBeLessThan(MAX_BYTES); // Zeichen: darunter
    const { abh } = abhaengigkeiten();
    expect((await verarbeiteEinsendung(post(body), abh)).status).toBe(400);
  });
});

describe("Regel 3: Spam-Falle", () => {
  it("Feld «website» gefüllt → 200 {ok:true}, versand exakt 0-mal", async () => {
    const { abh, versand, pruefe } = abhaengigkeiten();
    const antwort = await verarbeiteEinsendung(
      post({ ...gueltig, website: "http://spam.example" }),
      abh,
    );
    expect(antwort).toEqual({ status: 200, json: { ok: true } });
    expect(versand).toHaveBeenCalledTimes(0);
    expect(pruefe).not.toHaveBeenCalled();
  });

  it("gilt auch nach Bestellschluss (Spam erfährt nichts)", async () => {
    const { abh, versand } = abhaengigkeiten({ jetzt: () => SCHLUSS });
    const antwort = await verarbeiteEinsendung(
      post({ ...gueltig, website: "x" }),
      abh,
    );
    expect(antwort.status).toBe(200);
    expect(versand).toHaveBeenCalledTimes(0);
  });

  it("leeres oder fehlendes Feld «website» → normale Verarbeitung", async () => {
    const { abh, versand } = abhaengigkeiten();
    const ohne: Record<string, unknown> = { ...gueltig };
    delete ohne.website;
    expect((await verarbeiteEinsendung(post(ohne), abh)).status).toBe(200);
    expect(
      (await verarbeiteEinsendung(post({ ...gueltig, website: "  " }), abh))
        .status,
    ).toBe(200);
    expect(versand).toHaveBeenCalledTimes(4);
  });
});

describe("Regel 4: Schluss", () => {
  it("jetzt = schluss − 1 ms → 200", async () => {
    const { abh } = abhaengigkeiten({ jetzt: () => VOR_SCHLUSS });
    expect((await verarbeiteEinsendung(post(gueltig), abh)).status).toBe(200);
  });

  it("jetzt = schluss → 410 mit Hinweis oben, keine Mail", async () => {
    const { abh, versand } = abhaengigkeiten({ jetzt: () => SCHLUSS });
    const antwort = await verarbeiteEinsendung(post(gueltig), abh);
    expect(antwort).toEqual({
      status: 410,
      json: { ok: false, fehler: { _formular: "Bestellschluss vorbei." } },
    });
    expect(versand).not.toHaveBeenCalled();
  });

  it("ohne schluss → immer offen", async () => {
    const { abh } = abhaengigkeiten({
      schluss: undefined,
      jetzt: () => new Date("2099-01-01T00:00:00Z"),
    });
    expect((await verarbeiteEinsendung(post(gueltig), abh)).status).toBe(200);
  });
});

describe("Regel 5: Prüfung", () => {
  it("pruefe meldet Fehler → 400 {fehler}, keine Mail", async () => {
    const fehler = { email: "Bitte prüfen Sie die E-Mail-Adresse." };
    const { abh, versand } = abhaengigkeiten({ pruefe: () => fehler });
    const antwort = await verarbeiteEinsendung(post(gueltig), abh);
    expect(antwort).toEqual({ status: 400, json: { ok: false, fehler } });
    expect(versand).not.toHaveBeenCalled();
  });

  it("pruefe und baueMails erhalten die gesendeten Daten", async () => {
    const { abh, pruefe, baueMails } = abhaengigkeiten();
    await verarbeiteEinsendung(post(gueltig), abh);
    expect(pruefe).toHaveBeenCalledWith(gueltig);
    expect(baueMails).toHaveBeenCalledWith(gueltig);
  });
});

describe("Regel 6: Versand", () => {
  it("Erfolg → 200 {ok:true}, versand exakt 2-mal, Empfänger zuerst", async () => {
    const { abh, versand } = abhaengigkeiten();
    const antwort = await verarbeiteEinsendung(post(gueltig), abh);
    expect(antwort).toEqual({ status: 200, json: { ok: true } });
    expect(versand).toHaveBeenCalledTimes(2);
    expect(versand.mock.calls[0][0]).toBe(mailAnEmpfaenger);
    expect(versand.mock.calls[1][0]).toBe(bestaetigung);
  });

  it("Mail 1 scheitert → 502 {fehler:{_formular}}, Mail 2 wird NICHT versucht", async () => {
    const { abh, versand, protokolliere } = abhaengigkeiten();
    versand.mockRejectedValueOnce(new Error("Mailserver antwortet nicht"));
    const antwort = await verarbeiteEinsendung(post(gueltig), abh);
    expect(antwort).toEqual({
      status: 502,
      json: { ok: false, fehler: { _formular: "Versand gescheitert." } },
    });
    expect(versand).toHaveBeenCalledTimes(1);
    expect(protokolliere).toHaveBeenCalledTimes(1);
    expect(protokolliere.mock.calls[0][0]).toContain(
      "Mailserver antwortet nicht",
    );
  });

  it("Mail 2 scheitert → trotzdem 200, Fehler protokolliert", async () => {
    const { abh, versand, protokolliere } = abhaengigkeiten();
    versand
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Postfach voll"));
    const antwort = await verarbeiteEinsendung(post(gueltig), abh);
    expect(antwort).toEqual({ status: 200, json: { ok: true } });
    expect(versand).toHaveBeenCalledTimes(2);
    expect(protokolliere).toHaveBeenCalledTimes(1);
    expect(protokolliere.mock.calls[0][0]).toContain("Postfach voll");
  });

  it("das Protokoll enthält keine Personendaten", async () => {
    const { abh, versand, protokolliere } = abhaengigkeiten();
    versand.mockRejectedValue(new Error("Verbindung abgelehnt"));
    await verarbeiteEinsendung(post(gueltig), abh);
    const protokoll = protokolliere.mock.calls.flat().join("\n");
    expect(protokoll).not.toContain("anna@example.ch");
    expect(protokoll).not.toContain("Muster");
  });
});

describe("smtp.ts", () => {
  const vollstaendig = {
    SMTP_HOST: "mail.example.ch",
    SMTP_PORT: "587",
    SMTP_USER: "laedeli",
    SMTP_PASS: "Geheim-123",
    MAIL_FROM: "laedeli@example.ch",
  };

  it("fehlende Variablen → Meldung nennt die NAMEN, keine Werte", () => {
    const umgebung = {
      SMTP_HOST: "geheimer-host.example",
      SMTP_PASS: "Geheim-123",
    };
    let meldung = "";
    try {
      leseSmtpEinstellungen(umgebung);
    } catch (fehler) {
      meldung = (fehler as Error).message;
    }
    for (const name of ["SMTP_PORT", "SMTP_USER", "MAIL_FROM"]) {
      expect(meldung).toContain(name);
    }
    expect(meldung).not.toContain("SMTP_HOST,"); // vorhanden → nicht gemeldet
    expect(meldung).not.toContain("geheimer-host");
    expect(meldung).not.toContain("Geheim-123");
  });

  it("gar nichts gesetzt → alle fünf Namen", () => {
    expect(() => leseSmtpEinstellungen({})).toThrow(
      new RegExp(SMTP_VARIABLEN.join(", ")),
    );
  });

  it("ungültiger Port → Meldung ohne den Wert", () => {
    expect(() =>
      leseSmtpEinstellungen({ ...vollstaendig, SMTP_PORT: "abc-geheim" }),
    ).toThrow(/^SMTP_PORT ist keine gültige Portnummer/);
    try {
      leseSmtpEinstellungen({ ...vollstaendig, SMTP_PORT: "abc-geheim" });
    } catch (fehler) {
      expect((fehler as Error).message).not.toContain("abc-geheim");
    }
  });

  it("verschickt über den Transport: Absender, Empfänger, Antwort-an, Betreff, Text", async () => {
    const sendMail = vi.fn(async () => ({}));
    const fabrik = vi.fn<TransportFabrik>(() => ({ sendMail }));
    const versand = erstelleSmtpVersand(vollstaendig, fabrik);
    await versand(mailAnEmpfaenger);
    await versand(bestaetigung);
    expect(fabrik).toHaveBeenCalledTimes(1); // eine Verbindung für alle Mails
    expect(fabrik).toHaveBeenCalledWith({
      host: "mail.example.ch",
      port: 587,
      secure: false,
      auth: { user: "laedeli", pass: "Geheim-123" },
    });
    expect(sendMail).toHaveBeenNthCalledWith(1, {
      from: "laedeli@example.ch",
      to: "laedeli@example.ch",
      replyTo: "anna@example.ch",
      subject: "Neue Bestellung",
      text: "…",
      html: undefined,
    });
  });

  it("Port 465 → verschlüsselt ab Start (secure)", async () => {
    const fabrik = vi.fn<TransportFabrik>(() => ({
      sendMail: async () => ({}),
    }));
    await erstelleSmtpVersand(
      { ...vollstaendig, SMTP_PORT: "465" },
      fabrik,
    )(bestaetigung);
    expect(fabrik.mock.calls[0][0].secure).toBe(true);
  });

  it("fehlende Variablen → der Versand scheitert (→ 502), der Server läuft weiter", async () => {
    const fabrik = vi.fn<TransportFabrik>();
    const versand = erstelleSmtpVersand({}, fabrik);
    await expect(versand(bestaetigung)).rejects.toThrow(/SMTP_HOST/);
    expect(fabrik).not.toHaveBeenCalled();

    const { abh, protokolliere } = abhaengigkeiten({ versand });
    const antwort = await verarbeiteEinsendung(post(gueltig), abh);
    expect(antwort.status).toBe(502);
    expect(protokolliere.mock.calls[0][0]).toContain("SMTP_HOST");
  });

  it.each(["src/server/smtp.ts", "src/server/empfaenger.ts"])(
    "%s liest .env nicht selbst, nur process.env",
    (datei) => {
      const code = readFileSync(datei, "utf8").replace(/\/\/.*$/gm, "");
      expect(code).not.toMatch(/dotenv|readFile|["'`][^"'`]*\.env["'`]/);
    },
  );
});
