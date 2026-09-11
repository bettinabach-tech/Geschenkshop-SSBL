// text.ts — Wörter und Sätze zählen, damit die Bausteine die Design-Regeln
// (Hero-Überschrift ≤ 8 Wörter, Unterzeile 1 Satz, Nutzen-Text ≤ 2 Sätze)
// selbst durchsetzen.
//
// Wort: ein durch Leerraum getrenntes Stück mit mindestens einem Buchstaben
//   oder einer Ziffer. «Weihnachts-Geschenke» = 1 Wort; «–», «·», «&» = 0.
// Satz: endet mit . ! ? oder …, wenn danach nichts mehr kommt oder gross
//   (bzw. mit Ziffer) weitergeschrieben wird. Ausnahmen, die NIE einen Satz
//   beenden: Abkürzungen wie «ca.», «z.B.», «Nr.», «St.» sowie Ordnungszahlen
//   und kurze Daten («3. Dezember», «bis 15.12. Bestellen»). «usw.», «etc.»
//   und Jahreszahlen («seit 2020.») beenden einen Satz nach der Grossregel.
//   Text ohne Schlusszeichen zählt als ein Satz.

/** Abkürzungen, nach denen der Satz immer weitergeht (klein geschrieben). */
const ABKUERZUNGEN = new Set([
  "ca.",
  "z.b.",
  "z.",
  "b.",
  "d.h.",
  "d.",
  "h.",
  "u.a.",
  "u.",
  "a.",
  "bzw.",
  "evtl.",
  "ggf.",
  "inkl.",
  "exkl.",
  "vgl.",
  "nr.",
  "str.",
  "st.",
  "fr.",
  "hr.",
  "dr.",
  "max.",
  "min.",
  "mind.",
  "tel.",
  "jan.",
  "feb.",
  "aug.",
  "sept.",
  "okt.",
  "nov.",
  "dez.",
]);

const HAT_ZEICHEN = /[\p{L}\p{N}]/u;
const OEFFNEND = /^["'»«“„‚(]+/u;
const SCHLIESSEND = /["'»«“”’)\]]+$/u;
/** Schlusszeichen am Ende, danach evtl. schliessende Anführung/Klammer. */
const SATZENDE = /[.!?…]+["'»«“”’)\]]*$/u;
/** Beginnt wie ein neuer Satz: Grossbuchstabe oder Ziffer. */
const SATZANFANG = /^["'»«“„‚(]*[\p{Lu}\p{N}]/u;
/** Ordnungszahl oder kurzes Datum: «3.», «15.12.» */
const ORDNUNGSZAHL = /^\d{1,2}\.(\d{1,2}\.)?$/;

function stuecke(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** Anzahl Wörter (Stücke mit mindestens einem Buchstaben oder einer Ziffer). */
export function zaehleWoerter(text: string): number {
  return stuecke(text).filter((s) => HAT_ZEICHEN.test(s)).length;
}

function istSatzende(stueck: string, naechstes: string | undefined): boolean {
  if (!SATZENDE.test(stueck)) return false;
  const kern = stueck.replace(SCHLIESSEND, "").replace(OEFFNEND, "");
  if (naechstes !== undefined && kern.endsWith(".")) {
    if (ABKUERZUNGEN.has(kern.toLowerCase())) return false;
    if (ORDNUNGSZAHL.test(kern)) return false;
  }
  return naechstes === undefined || SATZANFANG.test(naechstes);
}

/** Anzahl Sätze nach den Regeln oben. Leerer Text = 0. */
export function zaehleSaetze(text: string): number {
  const teile = stuecke(text);
  let saetze = 0;
  let offen = false; // Wörter seit dem letzten Satzende?
  teile.forEach((stueck, i) => {
    if (HAT_ZEICHEN.test(stueck)) offen = true;
    if (offen && istSatzende(stueck, teile[i + 1])) {
      saetze += 1;
      offen = false;
    }
  });
  return saetze + (offen ? 1 : 0);
}
