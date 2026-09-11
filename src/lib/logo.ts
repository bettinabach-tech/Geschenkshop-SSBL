// logo.ts — das Logo einer Seite über seinen Pfad laden (site.logo,
// z.B. «assets/SSBL_Logo.svg»). Logos liegen als SVG oder PNG direkt in assets/.
// Bewusst NICHT assets/**: Vite liefert jede Datei aus, die der Suchmuster
// trifft — auch ungenutzte Produktfotos (je 3–8 MB) landeten sonst in dist/.

const logos = import.meta.glob<{ default: ImageMetadata }>(
  "/assets/*.{svg,png}",
);

/** Bild-Metadaten (src, width, height, format) des Logos. */
export async function ladeLogo(pfad: string): Promise<ImageMetadata> {
  const laden = logos[`/${pfad}`];
  if (!laden) {
    throw new Error(
      `Logo «${pfad}» nicht gefunden. Logos liegen als .svg oder .png direkt im Ordner assets/.`,
    );
  }
  return (await laden()).default;
}
