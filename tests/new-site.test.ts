// Befehl «npm run new» (Aufgabe 003): legt aus einem Brief das Gerüst einer
// neuen Seite an. Läuft in einem Temp-Ordner; das Projekt bleibt unberührt.
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import * as prettier from "prettier";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { neueSeite } from "../scripts/new-site.mjs";
import type { Site } from "../src/lib/site";

const SLUG = "adventsmarkt";
const ZIEL = "Besucher melden sich für einen Stand am Adventsmarkt an.";
const BRIEF = `# Brief — Adventsmarkt Rathausen

## Ziel der Seite (ein Satz)

${ZIEL}

## Primäre Handlung (Call-to-Action)

Formular

- Wohin gehen die Daten? E-Mail an markt@example.ch
`;

let root: string;
const pfad = (datei: string) => join(root, datei);
const brief = (text = BRIEF, slug = SLUG) =>
  writeFileSync(pfad(`docs/briefs/${slug}.md`), text);

beforeEach(() => {
  root = realpathSync.native(mkdtempSync(join(tmpdir(), "new-site-")));
  mkdirSync(pfad("docs/briefs"), { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("npm run new — Prüfungen vor dem Anlegen", () => {
  it("kein slug → Exit ≠ 0 mit Meldung", () => {
    const ergebnis = neueSeite(root, undefined);
    expect(ergebnis.code).not.toBe(0);
    expect(ergebnis.zeilen.join("\n")).toContain("npm run new -- <slug>");
  });

  it("slug «Mein Shop» → Exit ≠ 0, nichts angelegt", () => {
    const ergebnis = neueSeite(root, "Mein Shop");
    expect(ergebnis.code).not.toBe(0);
    expect(ergebnis.zeilen.join("\n")).toContain("Ungültiger slug «Mein Shop»");
    expect(existsSync(pfad("src"))).toBe(false);
  });

  it("Brief fehlt → Exit ≠ 0, die Meldung nennt den erwarteten Pfad", () => {
    const ergebnis = neueSeite(root, SLUG);
    expect(ergebnis.code).not.toBe(0);
    expect(ergebnis.zeilen.join("\n")).toContain(`docs/briefs/${SLUG}.md`);
    expect(existsSync(pfad("src"))).toBe(false);
  });

  it("Ordner existiert → Exit ≠ 0 und keine Datei verändert", () => {
    brief();
    mkdirSync(pfad(`src/sites/${SLUG}`), { recursive: true });
    writeFileSync(pfad(`src/sites/${SLUG}/site.ts`), "// bisher\n");
    const ergebnis = neueSeite(root, SLUG);
    expect(ergebnis.code).not.toBe(0);
    expect(ergebnis.zeilen.join("\n")).toContain("gibt es schon");
    expect(readFileSync(pfad(`src/sites/${SLUG}/site.ts`), "utf8")).toBe(
      "// bisher\n",
    );
    expect(existsSync(pfad(`src/pages/${SLUG}`))).toBe(false);
  });

  it("Seitenordner in src/pages existiert → ebenfalls Abbruch ohne Änderung", () => {
    brief();
    mkdirSync(pfad(`src/pages/${SLUG}`), { recursive: true });
    expect(neueSeite(root, SLUG).code).not.toBe(0);
    expect(existsSync(pfad(`src/sites/${SLUG}`))).toBe(false);
  });

  it("erste Zeile nicht «# Brief — <Name>» (Vorlage unverändert) → Exit ≠ 0", () => {
    brief(BRIEF.replace("Adventsmarkt Rathausen", "<Projektname>"));
    const ergebnis = neueSeite(root, SLUG);
    expect(ergebnis.code).not.toBe(0);
    expect(ergebnis.zeilen.join("\n")).toContain("# Brief — <Name der Seite>");
    expect(existsSync(pfad("src"))).toBe(false);
  });

  it("Brief ohne E-Mail-Adresse → Exit ≠ 0 mit Hinweis, wo sie hingehört", () => {
    brief(BRIEF.replace("markt@example.ch", "<E-Mail an … / CRM / Tabelle>"));
    const ergebnis = neueSeite(root, SLUG);
    expect(ergebnis.code).not.toBe(0);
    expect(ergebnis.zeilen.join("\n")).toContain("Wohin gehen die Daten?");
    expect(existsSync(pfad("src"))).toBe(false);
  });
});

describe("npm run new — Erfolg", () => {
  let ergebnis: ReturnType<typeof neueSeite>;
  beforeEach(() => {
    brief();
    ergebnis = neueSeite(root, SLUG);
  });

  it("Exit 0 und beide Dateien existieren", () => {
    expect(ergebnis.code).toBe(0);
    expect(existsSync(pfad(`src/sites/${SLUG}/site.ts`))).toBe(true);
    expect(existsSync(pfad(`src/pages/${SLUG}/index.astro`))).toBe(true);
  });

  it("titel aus dem Brief, die erzeugte site.ts besteht das Schema aus 001", async () => {
    // Den Import auf die echte src/lib/site.ts umbiegen und laden wie beim Bauen.
    const siteLib = resolve("src/lib/site.ts").replaceAll("\\", "/");
    const text = readFileSync(pfad(`src/sites/${SLUG}/site.ts`), "utf8");
    expect(text).toContain('"../../lib/site"');
    writeFileSync(
      pfad("pruefung.ts"),
      text.replace('"../../lib/site"', JSON.stringify(siteLib)),
    );
    const modul = (await import(
      /* @vite-ignore */ pfad("pruefung.ts").replaceAll("\\", "/")
    )) as { default: Site };
    expect(modul.default).toMatchObject({
      slug: SLUG,
      titel: "Adventsmarkt Rathausen",
      beschreibung: ZIEL,
      kontakt: { email: "markt@example.ch" },
      formular: { empfaenger: "markt@example.ch" },
    });
  });

  it("die Seite lädt ihre Einstellungen und ist für Suchmaschinen gesperrt", () => {
    const seite = readFileSync(pfad(`src/pages/${SLUG}/index.astro`), "utf8");
    expect(seite).toContain(`getSite("${SLUG}")`);
    expect(seite).toMatch(/<Seite site=\{site\} noindex>/);
    expect(seite).toContain("Diese Seite ist im Aufbau.");
  });

  it("erzeugte Dateien sind schon formatiert (sonst schlägt verify an)", async () => {
    for (const datei of [
      `src/sites/${SLUG}/site.ts`,
      `src/pages/${SLUG}/index.astro`,
    ]) {
      // Einstellungen des Projekts (auch das Astro-Plugin), nicht des Temp-Ordners
      const filepath = resolve(datei);
      const config = await prettier.resolveConfig(filepath);
      const text = readFileSync(pfad(datei), "utf8");
      expect(await prettier.check(text, { ...config, filepath }), datei).toBe(
        true,
      );
    }
  });

  it("gibt die nächsten Schritte in Alltagssprache aus", () => {
    const text = ergebnis.zeilen.join("\n");
    expect(text).toContain("Nächste Schritte");
    expect(text).toContain(`http://localhost:4321/${SLUG}/`);
    expect(text).toContain(
      `Es gibt einen neuen Brief in docs/briefs/${SLUG}.md`,
    );
    expect(text).toContain(`npm run check:golive -- ${SLUG}`);
  });

  it("ein zweiter Aufruf bricht ab und lässt die Dateien, wie sie sind", () => {
    const vorher = readFileSync(pfad(`src/sites/${SLUG}/site.ts`), "utf8");
    expect(neueSeite(root, SLUG).code).not.toBe(0);
    expect(readFileSync(pfad(`src/sites/${SLUG}/site.ts`), "utf8")).toBe(
      vorher,
    );
  });
});

describe("npm run new — Sonderfälle", () => {
  it("Ziel länger als 160 Zeichen → beschreibung = titel (Schema-Grenze)", () => {
    brief(BRIEF.replace(ZIEL, "Sehr lang. ".repeat(20)));
    expect(neueSeite(root, SLUG).code).toBe(0);
    expect(readFileSync(pfad(`src/sites/${SLUG}/site.ts`), "utf8")).toContain(
      'beschreibung: "Adventsmarkt Rathausen"',
    );
  });

  it("langes Ziel → Zeile umbrochen wie von Prettier (Titel passt immer)", async () => {
    const lang =
      "Besucherinnen und Besucher melden sich bis Ende Oktober für einen Stand am Adventsmarkt in Rathausen an.";
    brief(BRIEF.replace(ZIEL, lang));
    expect(neueSeite(root, SLUG).code).toBe(0);
    const filepath = resolve(`src/sites/${SLUG}/site.ts`);
    const config = await prettier.resolveConfig(filepath);
    const text = readFileSync(pfad(`src/sites/${SLUG}/site.ts`), "utf8");
    expect(text).toContain(`  beschreibung:\n    "${lang}",`);
    expect(await prettier.check(text, { ...config, filepath })).toBe(true);
  });
});

describe("npm run new — Kommandozeile", () => {
  const lauf = (...args: string[]) =>
    spawnSync(process.execPath, [resolve("scripts/new-site.mjs"), ...args], {
      cwd: root,
      encoding: "utf8",
    });

  it("falscher Aufruf → Exit 2 mit Meldung", () => {
    const ergebnis = lauf("Mein Shop");
    expect(ergebnis.status).toBe(2);
    expect(ergebnis.stderr).toContain("Ungültiger slug");
  });

  it("Erfolg im Projektordner → Exit 0 und nächste Schritte", () => {
    brief();
    const ergebnis = lauf(SLUG);
    expect(ergebnis.status).toBe(0);
    expect(ergebnis.stdout).toContain("Nächste Schritte");
    expect(existsSync(pfad(`src/sites/${SLUG}/site.ts`))).toBe(true);
  });

  it("der Platzhalter «noch nicht gebaut» ist entfernt", () => {
    expect(readFileSync("scripts/new-site.mjs", "utf8")).not.toContain(
      "noch nicht gebaut",
    );
  });
});
