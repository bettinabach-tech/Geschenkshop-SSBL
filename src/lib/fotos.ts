// fotos.ts — Fotos aus assets/ über ihren Pfad laden (z.B. aus produkte.yaml).
// Die Metadaten gehen an <Picture> (astro:assets), das verkleinerte Fassungen
// erzeugt. Siehe CLAUDE.md «Bekannte Fallen»: jede Datei, die dieses Muster
// trifft, prüft der Build — nach dem Bauen `ls dist/_astro` kontrollieren.

const fotos = import.meta.glob<{ default: ImageMetadata }>(
  "/assets/**/*.{jpg,jpeg,png,webp}",
);

/** Bild-Metadaten zu einem Pfad unter assets/. */
export async function ladeFoto(pfad: string): Promise<ImageMetadata> {
  const laden = fotos[`/${pfad}`];
  if (!laden) {
    throw new Error(
      `Foto «${pfad}» nicht gefunden. Erwartet wird eine .jpg/.png/.webp-Datei unter assets/.`,
    );
  }
  return (await laden()).default;
}

/**
 * Masse des Originals, ohne es als «gebraucht» zu markieren. Astro verfolgt
 * jeden Zugriff wie foto.width und liefert das Original (3–8 MB) dann mit aus;
 * die (undokumentierte) Kopie über .clone zählt nicht als Zugriff.
 */
export function masse(foto: ImageMetadata): { width: number; height: number } {
  const kopie = (foto as ImageMetadata & { clone?: ImageMetadata }).clone;
  const { width, height } = kopie ?? foto;
  return { width, height };
}
