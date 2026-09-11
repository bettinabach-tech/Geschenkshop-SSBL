// produkte.ts — liest die Produktliste (produkte.yaml) und prüft sie.
// Ein Fehler in der Liste bricht den Build ab; die Meldung nennt Produkt und
// Feld, damit man die Stelle auf GitHub findet. Fehlende preis/stueck sind
// erlaubt (Anzeige «Preis folgt», decisions.md Nr. 6).
import { z } from "astro/zod";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import roh from "./produkte.yaml?raw";

/** Leeres Feld in YAML («preis:») ergibt null — gilt wie «nicht angegeben». */
const leerErlaubt = <T extends z.ZodType>(schema: T) =>
  schema.nullish().transform((wert) => wert ?? undefined);

const hatHoechstensZweiNachkommastellen = (zahl: number) =>
  Math.abs(zahl * 100 - Math.round(zahl * 100)) < 1e-9;

export const produktSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "nur Kleinbuchstaben, Ziffern und Bindestriche",
    ),
  name: z.string().trim().min(1, "darf nicht leer sein"),
  foto: z
    .string()
    .regex(/^assets\/.+\.(jpg|jpeg|png|webp)$/, {
      error: "Bilddatei unter assets/ (jpg, png, webp)",
      abort: true,
    })
    .refine((pfad) => existsSync(resolve(process.cwd(), pfad)), {
      error: (issue) => `Datei ${String(issue.input)} gibt es nicht`,
    }),
  alt: z.string().trim().min(1, "Bildbeschreibung (Alt-Text) fehlt"),
  wein: z.boolean().default(false),
  beschreibung: leerErlaubt(z.string().trim().min(1)),
  preis: leerErlaubt(
    z
      .number({ error: "muss eine Zahl sein, z.B. 24.50 (mit Punkt)" })
      .positive("muss grösser als 0 sein")
      .refine(
        hatHoechstensZweiNachkommastellen,
        "höchstens zwei Stellen nach dem Punkt",
      ),
  ),
  stueck: leerErlaubt(
    z
      .number({ error: "muss eine ganze Zahl sein, z.B. 12" })
      .int("muss eine ganze Zahl sein, z.B. 12")
      .nonnegative("darf nicht negativ sein (0 = ausverkauft)"),
  ),
});

export const produktListeSchema = z
  .array(produktSchema)
  .min(1, "die Liste ist leer")
  .superRefine((liste, ctx) => {
    const gesehen = new Set<string>();
    liste.forEach((produkt, i) => {
      if (gesehen.has(produkt.id)) {
        ctx.addIssue({
          code: "custom",
          path: [i, "id"],
          message: `id «${produkt.id}» kommt mehrfach vor`,
        });
      }
      gesehen.add(produkt.id);
    });
  });

export type Produkt = z.output<typeof produktSchema>;

// Zustand eines Produkts: eigene Datei ohne Dateizugriff, damit auch die
// Bestellregeln im Browser ihn nutzen können (Aufgabe 018).
export { produktStatus, type ProduktStatus } from "./status";

/** Preis in Franken mit zwei Stellen: 24.5 → «CHF 24.50». */
export function formatierePreis(preis: number): string {
  return `CHF ${preis.toFixed(2)}`;
}

/** Prüft bereits gelesene Daten; wirft mit Produkt und Feld in der Meldung. */
export function pruefeProdukte(daten: unknown): Produkt[] {
  const ergebnis = produktListeSchema.safeParse(daten);
  if (ergebnis.success) return ergebnis.data;
  const zeilen = ergebnis.error.issues.map((issue) => {
    const [index, feld] = issue.path;
    if (typeof index !== "number") return `- Liste: ${issue.message}`;
    const eintrag = Array.isArray(daten) ? daten[index] : undefined;
    const id =
      eintrag && typeof eintrag === "object" && "id" in eintrag
        ? String(eintrag.id)
        : `Nr. ${index + 1}`;
    return `- Produkt «${id}», Feld «${String(feld ?? "?")}»: ${issue.message}`;
  });
  throw new Error(
    `Fehler in src/sites/geschenkshop-ssbl/produkte.yaml:\n${zeilen.join("\n")}`,
  );
}

/** Liest YAML-Text und prüft ihn. */
export function ladeProdukte(yamlText: string): Produkt[] {
  let daten: unknown;
  try {
    daten = parse(yamlText);
  } catch (fehler) {
    throw new Error(
      `produkte.yaml ist kein gültiges YAML (Einrückung prüfen): ${(fehler as Error).message}`,
    );
  }
  return pruefeProdukte(daten);
}

/** Die geprüfte Produktliste des Geschenkshops. */
export const produkte: Produkt[] = ladeProdukte(roh);
