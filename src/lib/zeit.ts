// zeit.ts — Datum und Uhrzeit in Zürcher Zeit (Sommer-/Winterzeit automatisch).
// Rein: läuft im Build, im Browser und auf dem Server.

const ZEITZONE = "Europe/Zurich";
const DATUM = new Intl.DateTimeFormat("de-CH", {
  timeZone: ZEITZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const UHRZEIT = new Intl.DateTimeFormat("de-CH", {
  timeZone: ZEITZONE,
  hour: "2-digit",
  minute: "2-digit",
});

/** z.B. «16.12.2026» */
export const datumZuerich = (zeit: Date): string => DATUM.format(zeit);

/** z.B. «14:03» */
export const uhrzeitZuerich = (zeit: Date): string => UHRZEIT.format(zeit);
