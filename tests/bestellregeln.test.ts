// Bestellregeln des Geschenkshops (Aufgabe 018): mindestens ein Fall je Regel.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  MELDUNG,
  bereinige,
  pruefeBestellung,
} from "../src/sites/geschenkshop-ssbl/bestellregeln";

// Erfundene Produkte für jeden Zustand — nicht die echte Liste (dort steht
// überall noch «Preis folgt»).
const produkte = [
  { id: "keramik", preis: 24.5, stueck: 3, wein: false },
  { id: "holz", preis: 12, stueck: 0, wein: false },
  { id: "ohne-preis", preis: undefined, stueck: 5, wein: false },
  { id: "ohne-stueck", preis: 10, stueck: undefined, wein: false },
  { id: "wein", preis: 18, stueck: 10, wein: true },
];

const abholung = {
  mengen: { keramik: 1 },
  name: "Muster",
  vorname: "Anna",
  email: "anna@example.ch",
  telefon: "079 123 45 67",
  weg: "abholung",
  zahlung: "twint",
  website: "",
};
const lieferung = {
  ...abholung,
  weg: "lieferung",
  strasse: "Rathausen 1",
  plz: "6032",
  ort: "Emmen",
  zahlung: "karte",
};

const fehler = (daten: Record<string, unknown>) =>
  pruefeBestellung(daten, produkte).fehler;

describe("gültige Bestellungen", () => {
  it("gültige Abholung ohne Adresse → keine Fehler", () => {
    expect(fehler(abholung)).toEqual({});
  });

  it("gültige Lieferung → keine Fehler", () => {
    expect(fehler(lieferung)).toEqual({});
  });
});

describe("Regel 1: Mengen sind ganze Zahlen ≥ 0, nur bekannte Produkte", () => {
  it.each([[-1], [1.5], ["2"], [null]])(
    "Menge %j → Fehler am Produkt",
    (menge) => {
      const f = fehler({ ...abholung, mengen: { keramik: 1, wein: menge } });
      expect(f["menge-wein"]).toBe(MELDUNG.keineGanzeZahl);
    },
  );

  it("unbekannte Produkt-id → Fehler an mengen", () => {
    const f = fehler({ ...abholung, mengen: { keramik: 1, gibtsnicht: 1 } });
    expect(f.mengen).toBe(MELDUNG.unbekannt);
  });
});

describe("Regel 2: mindestens ein Geschenk", () => {
  it.each([
    ["alle Mengen 0", { keramik: 0, wein: 0 }],
    ["leere Mengen", {}],
    ["Mengen fehlen", undefined],
    ["Mengen kein Objekt", "3"],
  ])("%s → Fehler an mengen", (_fall, mengen) => {
    expect(fehler({ ...abholung, mengen }).mengen).toBe(MELDUNG.keineMenge);
  });
});

describe("Regel 3: nicht mehr als verfügbar", () => {
  it("Menge 4 bei 3 Stück → Fehler an menge-keramik", () => {
    const f = fehler({ ...abholung, mengen: { keramik: 4 } });
    expect(f["menge-keramik"]).toBe(MELDUNG.zuViele(3));
    expect(f["menge-keramik"]).toBe("Es sind nur noch 3 Stück verfügbar.");
  });

  it("Menge genau 3 bei 3 Stück → kein Fehler", () => {
    expect(fehler({ ...abholung, mengen: { keramik: 3 } })).toEqual({});
  });
});

describe("Regel 4: nur bestellbare Produkte", () => {
  it("ausverkauft (stueck 0) → Fehler", () => {
    const f = fehler({ ...abholung, mengen: { holz: 1 } });
    expect(f["menge-holz"]).toBe(MELDUNG.ausverkauft);
  });

  it("Preis fehlt → Fehler", () => {
    const f = fehler({ ...abholung, mengen: { "ohne-preis": 1 } });
    expect(f["menge-ohne-preis"]).toBe(MELDUNG.preisFolgt);
  });

  it("Stückzahl fehlt → Fehler", () => {
    const f = fehler({ ...abholung, mengen: { "ohne-stueck": 1 } });
    expect(f["menge-ohne-stueck"]).toBe(MELDUNG.preisFolgt);
  });

  it("Menge 0 bei nicht bestellbarem Produkt → kein Fehler", () => {
    expect(fehler({ ...abholung, mengen: { keramik: 1, holz: 0 } })).toEqual(
      {},
    );
  });
});

describe("Regeln 5–6: Name und Vorname", () => {
  it.each([
    ["name", MELDUNG.name],
    ["vorname", MELDUNG.vorname],
  ])("%s fehlt oder nur Leerzeichen → Fehler", (feld, meldung) => {
    expect(fehler({ ...abholung, [feld]: "   " })[feld]).toBe(meldung);
    expect(fehler({ ...abholung, [feld]: undefined })[feld]).toBe(meldung);
  });

  it.each(["name", "vorname"])("%s: 100 Zeichen ok, 101 → Fehler", (feld) => {
    expect(
      fehler({ ...abholung, [feld]: "a".repeat(100) })[feld],
    ).toBeUndefined();
    expect(fehler({ ...abholung, [feld]: "a".repeat(101) })[feld]).toBe(
      MELDUNG.zuLang,
    );
  });

  it("zählt nach dem Trimmen: 100 Zeichen mit Leerzeichen am Rand ok", () => {
    expect(fehler({ ...abholung, name: `  ${"a".repeat(100)}  ` })).toEqual({});
  });
});

describe("Regel 7: E-Mail", () => {
  it("fehlt → Fehler", () => {
    expect(fehler({ ...abholung, email: "" }).email).toBe(MELDUNG.emailFehlt);
  });

  it.each(["abc", "anna@", "anna@example", "an na@example.ch"])(
    "«%s» → Formatfehler",
    (email) => {
      expect(fehler({ ...abholung, email }).email).toBe(MELDUNG.email);
    },
  );
});

describe("Regel 8: Telefon", () => {
  it("fehlt → Fehler", () => {
    expect(fehler({ ...abholung, telefon: "" }).telefon).toBe(
      MELDUNG.telefonFehlt,
    );
  });

  it.each(["123", "12345678", "079 123 45 6x", "079.123.45.67"])(
    "«%s» → Fehler",
    (telefon) => {
      expect(fehler({ ...abholung, telefon }).telefon).toBe(MELDUNG.telefon);
    },
  );

  it.each([
    "0791234567",
    "+41 79 123 45 67",
    "041/123-45-67",
    "(041) 123 45 67",
  ])("«%s» → gültig", (telefon) => {
    expect(fehler({ ...abholung, telefon }).telefon).toBeUndefined();
  });
});

describe("Regel 9: Lieferung oder Abholung", () => {
  it.each(["", "post", undefined])("weg %j → Fehler", (weg) => {
    expect(fehler({ ...abholung, weg }).weg).toBe(MELDUNG.weg);
  });
});

describe("Regel 10: Adresse bei Lieferung", () => {
  it("Strasse fehlt → Fehler", () => {
    expect(fehler({ ...lieferung, strasse: " " }).strasse).toBe(
      MELDUNG.strasse,
    );
  });

  it("Ort fehlt → Fehler", () => {
    expect(fehler({ ...lieferung, ort: "" }).ort).toBe(MELDUNG.ort);
  });

  it.each(["600", "60000", "6O20", "", " 6 03"])("plz «%s» → Fehler", (plz) => {
    expect(fehler({ ...lieferung, plz }).plz).toBe(MELDUNG.plz);
  });

  it("plz mit Leerzeichen am Rand wird getrimmt", () => {
    expect(fehler({ ...lieferung, plz: " 6032 " })).toEqual({});
  });
});

describe("Regel 11: keine Adresse nötig bei Abholung", () => {
  it("Abholung mit leerer Strasse/PLZ/Ort → keine Fehler", () => {
    expect(fehler({ ...abholung, strasse: "", plz: "x", ort: "" })).toEqual({});
  });
});

describe("Regel 12: Zahlungsart", () => {
  it.each(["", "bar", "Twint ", undefined])(
    "zahlung %j → Fehler",
    (zahlung) => {
      const f = fehler({ ...abholung, zahlung });
      // «Twint » (grosses T) ist falsch geschrieben, nicht nur ein Leerzeichen
      expect(f.zahlung).toBe(MELDUNG.zahlung);
    },
  );

  it("«twint» mit Leerzeichen am Rand ist gültig", () => {
    expect(fehler({ ...abholung, zahlung: " twint " }).zahlung).toBeUndefined();
  });
});

describe("Regel 13: Wein nur ab 16", () => {
  it("Wein mit Menge 1 ohne alter16 → Fehler an alter16", () => {
    const f = fehler({ ...abholung, mengen: { wein: 1 } });
    expect(f).toEqual({ alter16: MELDUNG.alter16 });
  });

  it("Wein mit Menge 1 und alter16 «ja» statt true → Fehler", () => {
    const f = fehler({ ...abholung, mengen: { wein: 1 }, alter16: "ja" });
    expect(f.alter16).toBe(MELDUNG.alter16);
  });

  it("Wein mit Menge 1 und alter16 true → kein Fehler", () => {
    expect(fehler({ ...abholung, mengen: { wein: 1 }, alter16: true })).toEqual(
      {},
    );
  });

  it("Wein mit Menge 0 ohne alter16 → kein Fehler", () => {
    expect(fehler({ ...abholung, mengen: { keramik: 1, wein: 0 } })).toEqual(
      {},
    );
  });
});

describe("bereinige", () => {
  it("entfernt Leerzeichen am Rand", () => {
    const sauber = bereinige({
      ...lieferung,
      name: "  Muster ",
      ort: " Emmen",
    });
    expect(sauber.name).toBe("Muster");
    expect(sauber.ort).toBe("Emmen");
    expect(sauber.mengen).toEqual({ keramik: 1 });
  });

  it("entfernt die Adresse bei Abholung", () => {
    const sauber = bereinige({
      ...abholung,
      strasse: "Rathausen 1",
      plz: "6032",
      ort: "Emmen",
    });
    expect(sauber).not.toHaveProperty("strasse");
    expect(sauber).not.toHaveProperty("plz");
    expect(sauber).not.toHaveProperty("ort");
    expect(sauber.name).toBe("Muster");
  });

  it("behält die Adresse bei Lieferung und verändert die Eingabe nicht", () => {
    const eingabe = { ...lieferung, name: " Muster " };
    const sauber = bereinige(eingabe);
    expect(sauber.strasse).toBe("Rathausen 1");
    expect(eingabe.name).toBe(" Muster ");
  });
});

describe("läuft in Browser und Server", () => {
  it.each([
    ["src/sites/geschenkshop-ssbl/bestellregeln.ts", 3],
    ["src/sites/geschenkshop-ssbl/status.ts", 1],
    ["src/lib/formular/regeln.ts", 0],
  ])("%s greift nicht auf DOM, Netz, Uhr oder Dateien zu", (datei, anzahl) => {
    const code = readFileSync(datei, "utf8").replace(/\/\/.*$/gm, "");
    expect(code).not.toMatch(
      /\b(document|window|fetch|XMLHttpRequest|Date|performance|setTimeout)\b/,
    );
    // Nur reine Module; von produkte.ts (liest Dateien) nur Typen.
    const importe = [
      ...code.matchAll(/^import\s+(type\s+)?[^;]*?from\s+["']([^"']+)["'];/gm),
    ];
    expect(importe).toHaveLength(anzahl); // Suchmuster findet alle Importe
    for (const [, nurTyp, ziel] of importe) {
      if (ziel.endsWith("/produkte")) expect(nurTyp).toBeTruthy();
      else expect(ziel).toMatch(/\/(regeln|status)$/);
    }
  });
});
