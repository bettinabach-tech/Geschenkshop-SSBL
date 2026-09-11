// site.ts — Einstellungen einer Landingpage (Schema + defineSite).
// Jede Seite hat eine Datei src/sites/<slug>/site.ts, die defineSite() aufruft.
// Alle Fabrik-Bausteine lesen ihre Angaben nur aus diesem Objekt.
// Felder mit «optional bis Live-Gang» dürfen fehlen; die Prüfung vor dem
// Live-Gang (Aufgabe 013) meldet sie. Unbekanntes nie raten.
import { z } from "astro/zod";
import { MINDESTKONTRAST, kontrast } from "./kontrast";

const httpsUrl = z
  .url({ protocol: /^https$/, error: "muss eine https://-Adresse sein" })
  .optional();

export const siteSchema = z.object({
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "nur Kleinbuchstaben, Ziffern und Bindestriche",
    ),
  titel: z.string().min(1).max(60),
  beschreibung: z.string().min(1).max(160),
  adresse: httpsUrl,
  farben: z
    .object({
      // Weisse Schrift auf dem Kauf-Button muss lesbar bleiben (WCAG AA).
      primaer: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, {
          error: "Farbe im Format #rrggbb",
          abort: true,
        })
        .refine((farbe) => kontrast(farbe, "#ffffff") >= MINDESTKONTRAST, {
          error: (issue) => {
            const farbe = String(issue.input);
            const wert = kontrast(farbe, "#ffffff").toFixed(2);
            return `Primärfarbe ${farbe} ist gegen Weiss zu hell (Kontrast ${wert}:1, nötig ${MINDESTKONTRAST}:1) — bitte eine dunklere Farbe wählen.`;
          },
        })
        .default("#005CA9"),
    })
    .prefault({}),
  logo: z
    .string()
    .regex(/^assets\/.+/, "Pfad unter assets/")
    .default("assets/SSBL_Logo.svg"),
  logoAlt: z.string().min(1),
  kontakt: z.object({
    email: z.email(),
    telefon: z.string().min(1).optional(),
  }),
  rechtliches: z
    .object({
      impressumUrl: httpsUrl,
      datenschutzUrl: httpsUrl,
    })
    .prefault({}),
  formular: z.object({
    empfaenger: z.email(),
    endpunkt: z.string().min(1).optional(),
    // Zeitpunkt mit Zeitzone, z.B. 2026-12-16T00:00:00+01:00
    schluss: z.iso.datetime({ offset: true, local: false }).optional(),
  }),
});

/** Was in src/sites/<slug>/site.ts steht (Standardwerte dürfen fehlen). */
export type SiteInput = z.input<typeof siteSchema>;
/** Geprüfte Einstellungen, Standardwerte eingesetzt. */
export type Site = z.output<typeof siteSchema>;

/** Prüft die Einstellungen einer Seite; wirft bei ungültigen Angaben. */
export function defineSite(input: SiteInput): Site {
  const result = siteSchema.safeParse(input);
  if (!result.success) {
    const name = typeof input?.slug === "string" ? input.slug : "(ohne slug)";
    throw new Error(
      `Ungültige Seiten-Einstellungen für «${name}»:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
