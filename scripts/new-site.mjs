// new-site.mjs — `npm run new -- <slug>`: legt eine neue Seite aus einem Brief
// an (Aufgabe 003). Aus docs/briefs/<slug>.md entstehen
// src/sites/<slug>/site.ts (Einstellungen) und src/pages/<slug>/index.astro
// (vorerst «im Aufbau», für Suchmaschinen gesperrt). Abschnitte, Texte und
// Aufgaben der Seite folgen danach mit Claude (KURSANLEITUNG «Weitere Seiten»).
// Überschreibt nie etwas. Exit 0 = angelegt · 1 = Brief fehlt/unvollständig
// oder die Seite gibt es schon · 2 = falscher Aufruf.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Regeln aus src/lib/site.ts (Aufgabe 001)
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_TITEL = 60;
const MAX_BESCHREIBUNG = 160;
const EMAIL =
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;
// Das Standard-Logo der Fabrik ist das SSBL-Logo (site.ts: logo).
const LOGO_ALT = "SSBL – Stiftung für selbstbestimmtes und begleitetes Leben";

/** Zeilen eines Abschnitts «## <anfang>…» bis zum nächsten «## ». */
function abschnitt(zeilen, anfang) {
  const start = zeilen.findIndex((z) => z.startsWith(`## ${anfang}`));
  if (start < 0) return [];
  const ende = zeilen.findIndex((z, i) => i > start && z.startsWith("## "));
  return zeilen.slice(start + 1, ende < 0 ? undefined : ende);
}

/**
 * Titel, Ziel und E-Mail-Adresse aus dem Brief; wirft bei Lücken.
 * @param {string} text
 * @returns {{ titel: string, ziel: string | undefined, email: string }}
 */
export function leseBrief(text) {
  const zeilen = text.split(/\r?\n/);
  const titel = /^#\s*Brief\s*[—–-]\s*(.+?)\s*$/.exec(zeilen[0] ?? "")?.[1];
  if (!titel || titel.includes("<")) {
    throw new Error(
      "Die erste Zeile des Briefs muss «# Brief — <Name der Seite>» lauten.",
    );
  }
  if (titel.length > MAX_TITEL) {
    throw new Error(
      `Der Name im Brief hat ${titel.length} Zeichen; er wird zum Seitentitel und darf höchstens ${MAX_TITEL} haben.`,
    );
  }
  const ziel = abschnitt(zeilen, "Ziel der Seite")
    .map((z) => z.trim())
    .find((z) => z && !z.startsWith("<"));
  const daten = zeilen.find((z) => z.includes("Wohin gehen die Daten"));
  const email = EMAIL.exec(daten ?? "")?.[0] ?? EMAIL.exec(text)?.[0];
  if (!email) {
    throw new Error(
      "Im Brief fehlt eine E-Mail-Adresse. Bitte unter «Primäre Handlung» bei «Wohin gehen die Daten?» eintragen, z.B. «E-Mail an name@ssbl.ch».",
    );
  }
  return { titel, ziel, email };
}

/** Eine Eigenschaft so, wie Prettier sie schreibt (Zeilen bis 80 Zeichen). */
function eigenschaft(tiefe, name, wert) {
  const einzug = "  ".repeat(tiefe);
  const zeile = `${einzug}${name}: ${JSON.stringify(wert)},`;
  return zeile.length <= 80
    ? zeile
    : `${einzug}${name}:\n${einzug}  ${JSON.stringify(wert)},`;
}

function siteTs(slug, { titel, ziel, email }) {
  const beschreibung = ziel && ziel.length <= MAX_BESCHREIBUNG ? ziel : titel;
  return [
    `// Einstellungen der Seite «${titel}» (Brief: docs/briefs/${slug}.md).`,
    "// Angelegt mit «npm run new». VORLÄUFIG: beschreibung stammt aus dem Ziel im",
    "// Brief, die E-Mail-Adresse aus «Wohin gehen die Daten?» — vor dem Live-Gang",
    "// mit dem Auftraggeber abstimmen. Noch unbekannt und darum weggelassen (nie",
    "// raten): adresse, kontakt.telefon, rechtliches.impressumUrl/datenschutzUrl,",
    `// formular.endpunkt — npm run check:golive -- ${slug} meldet sie.`,
    'import { defineSite } from "../../lib/site";',
    "",
    "export default defineSite({",
    eigenschaft(1, "slug", slug),
    eigenschaft(1, "titel", titel),
    eigenschaft(1, "beschreibung", beschreibung),
    eigenschaft(1, "logoAlt", LOGO_ALT),
    "  kontakt: {",
    eigenschaft(2, "email", email),
    "  },",
    "  formular: {",
    eigenschaft(2, "empfaenger", email),
    "  },",
    "});",
    "",
  ].join("\n");
}

function indexAstro(slug, titel) {
  return [
    "---",
    `// Seite «${titel}» (Brief: docs/briefs/${slug}.md), angelegt mit «npm run new».`,
    "// VORLÄUFIG «im Aufbau» und für Suchmaschinen gesperrt. Die Abschnitte (Hero,",
    "// Nutzen, Vertrauen, Kauf-Bereich) folgen mit <Landingpage> und den Aufgaben",
    "// dieser Seite — Vorbild: src/pages/geschenkshop-ssbl/index.astro.",
    'import Seite from "../../layouts/Seite.astro";',
    'import { getSite } from "../../lib/sites";',
    "",
    `const site = getSite(${JSON.stringify(slug)});`,
    "---",
    "",
    "<Seite site={site} noindex>",
    "  <main>",
    "    <h1>{site.titel}</h1>",
    "    <p>Diese Seite ist im Aufbau.</p>",
    "  </main>",
    "</Seite>",
    "",
  ].join("\n");
}

function naechsteSchritte(slug, titel) {
  return [
    `Neue Seite «${titel}» angelegt:`,
    `- src/sites/${slug}/site.ts — Einstellungen (Titel, E-Mail-Adresse)`,
    `- src/pages/${slug}/index.astro — zeigt vorerst «Diese Seite ist im Aufbau.»`,
    "",
    "Nächste Schritte:",
    `1. Ansehen: npm run dev, dann http://localhost:4321/${slug}/`,
    `2. Claude sagen: «Es gibt einen neuen Brief in docs/briefs/${slug}.md. Ergänze features.md um eine Gruppe für diese Seite und lege die zugehörigen Aufgaben in docs/tasks/ an — nach demselben Vorgehen wie in docs/templates/initializer-prompt.md, aber nur für diese Seite. Stelle mir vorher die Fragen, deren Antwort die Zerlegung ändern würde.»`,
    "3. Danach Aufgabe für Aufgabe weiter wie gewohnt (KURSANLEITUNG, Schritt 4).",
    `4. Vor der Veröffentlichung zeigt «npm run check:golive -- ${slug}», was noch fehlt.`,
  ];
}

/**
 * Legt die neue Seite unter <root> an.
 * @param {string} root Projektwurzel
 * @param {string | undefined} slug
 * @returns {{ code: 0 | 1 | 2, zeilen: string[] }}
 */
export function neueSeite(root, slug) {
  if (!slug) {
    return {
      code: 2,
      zeilen: ["Aufruf: npm run new -- <slug>  (z.B. adventsmarkt-2026)"],
    };
  }
  if (!SLUG.test(slug)) {
    return {
      code: 2,
      zeilen: [
        `Ungültiger slug «${slug}»: nur Kleinbuchstaben, Ziffern und Bindestriche, z.B. «mein-shop».`,
      ],
    };
  }
  const briefPfad = `docs/briefs/${slug}.md`;
  if (!existsSync(join(root, briefPfad))) {
    return {
      code: 1,
      zeilen: [
        `Brief fehlt: ${briefPfad}. Zuerst den Brief anlegen (Vorlage: docs/profil/brief-template.md).`,
      ],
    };
  }
  const siteOrdner = `src/sites/${slug}`;
  const seitenOrdner = `src/pages/${slug}`;
  for (const ordner of [siteOrdner, seitenOrdner]) {
    if (existsSync(join(root, ordner))) {
      return {
        code: 1,
        zeilen: [
          `Die Seite «${slug}» gibt es schon (${ordner}/). Es wurde nichts verändert.`,
        ],
      };
    }
  }
  let brief;
  try {
    brief = leseBrief(readFileSync(join(root, briefPfad), "utf8"));
  } catch (fehler) {
    return { code: 1, zeilen: [`${briefPfad}: ${fehler.message}`] };
  }
  mkdirSync(join(root, siteOrdner), { recursive: true });
  mkdirSync(join(root, seitenOrdner), { recursive: true });
  // flag "wx": bricht ab, statt eine vorhandene Datei zu überschreiben
  writeFileSync(join(root, siteOrdner, "site.ts"), siteTs(slug, brief), {
    flag: "wx",
  });
  writeFileSync(
    join(root, seitenOrdner, "index.astro"),
    indexAstro(slug, brief.titel),
    { flag: "wx" },
  );
  return { code: 0, zeilen: naechsteSchritte(slug, brief.titel) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { code, zeilen } = neueSeite(process.cwd(), process.argv[2]);
  (code === 0 ? console.log : console.error)(zeilen.join("\n"));
  process.exit(code);
}
