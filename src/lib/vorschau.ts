// vorschau.ts — Social-Media-Vorschau (Aufgabe 024). Beim Bauen wird ein Foto
// aus assets/ auf 1200 × 630 zugeschnitten (das Format, das Facebook,
// WhatsApp & Co. gross zeigen) und unter /<slug>/vorschau.jpg abgelegt
// (src/pages/[seite]/vorschau.jpg.ts).
// Das Foto wird direkt gelesen, nicht über import.meta.glob — sonst landete
// das Original mit in dist/ (CLAUDE.md «Bekannte Fallen»).
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const VORSCHAU_BREITE = 1200;
export const VORSCHAU_HOEHE = 630;

/** Adresse des Vorschaubilds einer Seite, relativ zu site.adresse. */
export function vorschauPfad(slug: string): string {
  return `/${slug}/vorschau.jpg`;
}

/** Schneidet das Foto zu (Ausschnitt dort, wo am meisten zu sehen ist) → JPG. */
export async function erzeugeVorschau(foto: string): Promise<Buffer> {
  let original: Buffer;
  try {
    original = await readFile(resolve(process.cwd(), foto));
  } catch {
    throw new Error(
      `Vorschaubild «${foto}» nicht gefunden (vorschau.bild in site.ts).`,
    );
  }
  // Erst hier geladen, damit das Grundlayout (vorschauPfad) sharp nicht braucht.
  const { default: sharp } = await import("sharp");
  return sharp(original)
    .rotate()
    .resize(VORSCHAU_BREITE, VORSCHAU_HOEHE, {
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
}
