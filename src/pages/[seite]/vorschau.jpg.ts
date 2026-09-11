// Vorschaubild für Social Media (Aufgabe 024): /<slug>/vorschau.jpg für jede
// Seite mit vorschau.bild in site.ts, beim Bauen erzeugt (src/lib/vorschau.ts).
import type { APIRoute, GetStaticPaths } from "astro";
import { getSites } from "../../lib/sites";
import { erzeugeVorschau } from "../../lib/vorschau";

export const getStaticPaths = (() =>
  getSites().flatMap((site) =>
    site.vorschau.bild
      ? [{ params: { seite: site.slug }, props: { foto: site.vorschau.bild } }]
      : [],
  )) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const bild = await erzeugeVorschau(props.foto as string);
  return new Response(new Uint8Array(bild), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
