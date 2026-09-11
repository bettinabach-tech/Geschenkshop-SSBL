// client.ts — Prüfung und Versand der Fabrik-Formulare im Browser (Aufgabe 009).
// Die Bausteine in src/components/formular/ liefern das HTML; dieses Skript
// prüft beim Verlassen eines Feldes und beim Absenden, zeigt Hinweise direkt am
// Feld (#<feld>-fehler) und schickt die Daten als JSON an den Endpunkt.
// Texte: vom Auftraggeber freigegeben am 11.09.2026.

export type Daten = Record<string, unknown>;
/** Hinweise je Feldname; `_formular` = Hinweis oben am Formular. */
export type Fehler = Record<string, string>;
/** Seitenspezifische Zusatzprüfung, z.B. Bestellregeln (Aufgabe 018). */
export type Zusatz = (daten: Daten) => Fehler;

export const MELDUNG = {
  pflicht: "Bitte füllen Sie dieses Feld aus.",
  auswahl: "Bitte wählen Sie eine Möglichkeit aus.",
  haekchen: "Bitte bestätigen Sie dies mit dem Häkchen.",
  email: "Bitte prüfen Sie die E-Mail-Adresse, z.B. name@beispiel.ch.",
  telefon: "Bitte geben Sie eine Telefonnummer mit mindestens 9 Ziffern an.",
  zahl: (min: string, max: string) =>
    `Bitte geben Sie eine Zahl von ${min} bis ${max} an.`,
  senden: "Wird gesendet …",
  technisch:
    "Leider hat das Senden nicht geklappt. Ihre Angaben sind noch da. Bitte versuchen Sie es noch einmal oder melden Sie sich direkt bei uns:",
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Wie die Bestellregeln auf dem Server (018): Ziffern, Leerzeichen, + - / ( )
const TELEFON_ZEICHEN = /^[\d\s+\-/()]*$/;
const TELEFON_MIN_ZIFFERN = 9;
/** Unsichtbares Spam-Feld (decisions.md Nr. 9): wird mitgesendet, nie geprüft. */
const FALLE = "website";

type Eingabe = HTMLInputElement;

// Zusatzprüfungen je Formular-id; Seiten melden sie mit setzeZusatz() an.
const zusaetze = new Map<string, Zusatz>();

/** Meldet die Zusatzprüfung einer Seite für das Formular mit dieser id an. */
export function setzeZusatz(formularId: string, zusatz: Zusatz): void {
  zusaetze.set(formularId, zusatz);
}

/** Alle aktiven Felder nach Name gruppiert, in Reihenfolge der Seite.
 *  Ausgeblendete (in [hidden]) und gesperrte Felder zählen nicht — sie werden
 *  weder geprüft noch gesendet (z.B. Adresse bei Abholung, Aufgabe 020). */
function felder(form: HTMLFormElement): Map<string, Eingabe[]> {
  const gruppen = new Map<string, Eingabe[]>();
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement) || !el.name) continue;
    if (el.disabled || el.closest("[hidden]")) continue;
    if (["submit", "button", "reset"].includes(el.type)) continue;
    const liste = gruppen.get(el.name) ?? [];
    liste.push(el);
    gruppen.set(el.name, liste);
  }
  return gruppen;
}

function wert(elemente: Eingabe[]): unknown {
  const [el] = elemente;
  switch (el.type) {
    case "radio":
      return elemente.find((e) => e.checked)?.value ?? "";
    case "checkbox":
      return el.checked;
    case "number":
      // Leeres Mengenfeld heisst «keine»: 0.
      return el.value.trim() === "" ? 0 : Number(el.value);
    default:
      return el.value.trim();
  }
}

/** Die Formulardaten, wie sie an den Endpunkt gehen. Felder mit
 *  data-gruppe/data-schluessel landen verschachtelt, z.B. mengen.keramik. */
export function sammle(form: HTMLFormElement): Daten {
  const daten: Daten = {};
  for (const [name, elemente] of felder(form)) {
    const { gruppe, schluessel } = elemente[0].dataset;
    if (gruppe && schluessel) {
      const ziel = (daten[gruppe] ??= {}) as Record<string, unknown>;
      ziel[schluessel] = wert(elemente);
    } else {
      daten[name] = wert(elemente);
    }
  }
  return daten;
}

/** Grundprüfung eines Feldes: Pflicht, E-Mail, Telefon, Zahl mit min/max. */
function pruefeFeld(elemente: Eingabe[]): string | null {
  const [el] = elemente;
  if (el.name === FALLE) return null;
  const pflicht = el.dataset.pflicht !== undefined;
  switch (el.type) {
    case "radio":
      return pflicht && !elemente.some((e) => e.checked)
        ? MELDUNG.auswahl
        : null;
    case "checkbox":
      return pflicht && !el.checked ? MELDUNG.haekchen : null;
    case "number": {
      const leer = el.value.trim() === "" && !el.validity?.badInput;
      if (leer) return pflicht ? MELDUNG.pflicht : null;
      const n = Number(el.value);
      const min = el.min === "" ? -Infinity : Number(el.min);
      const max = el.max === "" ? Infinity : Number(el.max);
      return el.validity?.badInput || !Number.isInteger(n) || n < min || n > max
        ? MELDUNG.zahl(el.min, el.max)
        : null;
    }
  }
  const text = el.value.trim();
  if (text === "") return pflicht ? MELDUNG.pflicht : null;
  if (el.type === "email" && !EMAIL.test(text)) return MELDUNG.email;
  if (el.type === "tel") {
    const ziffern = text.replace(/\D/g, "").length;
    if (!TELEFON_ZEICHEN.test(text) || ziffern < TELEFON_MIN_ZIFFERN) {
      return MELDUNG.telefon;
    }
  }
  return null;
}

/** Hinweis am Feld zeigen (meldung) oder entfernen (null). Gibt false zurück,
 *  wenn es für diesen Namen keinen Platz für einen Hinweis gibt. */
function zeige(
  form: HTMLFormElement,
  name: string,
  meldung: string | null,
): boolean {
  const kasten = document.getElementById(`${name}-fehler`);
  const elemente = felder(form).get(name) ?? [];
  // Bei Radio-Gruppen trägt die Gruppe den Fehlerzustand, sonst das Feld.
  const ziel =
    elemente[0]?.type === "radio"
      ? elemente[0].closest("fieldset")
      : elemente[0];
  if (ziel) {
    if (meldung) ziel.setAttribute("aria-invalid", "true");
    else ziel.removeAttribute("aria-invalid");
  }
  if (!kasten) return false;
  kasten.textContent = meldung ?? "";
  kasten.hidden = !meldung;
  return true;
}

function zeigeOben(form: HTMLFormElement, inhalt: Node[] | null): void {
  const kasten = document.getElementById(`${form.id}-meldung`);
  if (!kasten) return;
  kasten.replaceChildren(...(inhalt ?? []));
  kasten.hidden = !inhalt;
}

function zusatzVon(form: HTMLFormElement, zusatz?: Zusatz): Zusatz | undefined {
  return zusatz ?? zusaetze.get(form.id);
}

/** Prüft alle Felder, zeigt/entfernt die Hinweise und liefert die Fehler. */
export function pruefeAlle(form: HTMLFormElement, zusatz?: Zusatz): Fehler {
  const fehler: Fehler = {};
  const alle = felder(form);
  for (const [name, elemente] of alle) {
    const meldung = pruefeFeld(elemente);
    if (meldung) fehler[name] = meldung;
  }
  const extra = zusatzVon(form, zusatz)?.(sammle(form)) ?? {};
  for (const [name, meldung] of Object.entries(extra)) {
    fehler[name] ??= meldung;
  }
  for (const name of alle.keys()) zeige(form, name, fehler[name] ?? null);
  zeigeFehlerOhneFeld(form, fehler, alle);
  return fehler;
}

/** Hinweise ohne eigenes Feld (z.B. `mengen`, `_formular`): an ihren Kasten,
 *  falls es einen gibt, sonst oben ans Formular. */
function zeigeFehlerOhneFeld(
  form: HTMLFormElement,
  fehler: Fehler,
  alle = felder(form),
): void {
  const oben: string[] = [];
  for (const [name, meldung] of Object.entries(fehler)) {
    if (alle.has(name)) continue;
    if (!zeige(form, name, meldung)) oben.push(meldung);
  }
  zeigeOben(form, oben.length ? oben.map((m) => absatz(m)) : null);
}

function absatz(text: string): HTMLParagraphElement {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}

function fokusAufErstes(form: HTMLFormElement, fehler: Fehler): void {
  for (const [name, elemente] of felder(form)) {
    if (!fehler[name]) continue;
    (elemente.find((e) => e.checked) ?? elemente[0]).focus();
    return;
  }
  const oben = document.getElementById(`${form.id}-meldung`);
  if (oben && !oben.hidden) oben.focus();
}

/** Hinweis bei technischem Fehler: Telefon und E-Mail aus der Konfiguration. */
function technischerFehler(form: HTMLFormElement): void {
  const { telefon, email } = form.dataset;
  const p = document.createElement("p");
  p.append(`${MELDUNG.technisch} `);
  const wege: HTMLAnchorElement[] = [];
  if (telefon) {
    const a = document.createElement("a");
    a.href = `tel:${telefon.replace(/[^\d+]/g, "")}`;
    a.textContent = `Telefon ${telefon}`;
    wege.push(a);
  }
  if (email) {
    const a = document.createElement("a");
    a.href = `mailto:${email}`;
    a.textContent = `E-Mail ${email}`;
    wege.push(a);
  }
  wege.forEach((a, i) => p.append(...(i > 0 ? [", ", a] : [a])));
  zeigeOben(form, [p]);
  document.getElementById(`${form.id}-meldung`)?.focus();
}

function sendeKnoepfe(form: HTMLFormElement): HTMLButtonElement[] {
  return Array.from(form.elements).filter(
    (el): el is HTMLButtonElement =>
      el instanceof HTMLButtonElement && el.type === "submit",
  );
}

function sperre(form: HTMLFormElement, gesperrt: boolean): void {
  form.setAttribute("aria-busy", String(gesperrt));
  for (const knopf of sendeKnoepfe(form)) {
    knopf.dataset.text ??= knopf.textContent ?? "";
    knopf.disabled = gesperrt;
    knopf.textContent = gesperrt ? MELDUNG.senden : knopf.dataset.text;
  }
}

function zeigeDanke(form: HTMLFormElement): void {
  const danke = document.getElementById(`${form.id}-danke`);
  form.hidden = true;
  if (danke) {
    danke.hidden = false;
    danke.focus();
  }
}

/** Antwort des Endpunkts auswerten. true = erfolgreich gesendet. */
async function werteAus(form: HTMLFormElement, antwort: Response) {
  if (antwort.ok) return true;
  if (antwort.status < 500) {
    const json = (await antwort.json().catch(() => null)) as {
      fehler?: unknown;
    } | null;
    if (json?.fehler && typeof json.fehler === "object") {
      const fehler = json.fehler as Fehler;
      const alle = felder(form);
      for (const name of alle.keys()) zeige(form, name, fehler[name] ?? null);
      zeigeFehlerOhneFeld(form, fehler, alle);
      fokusAufErstes(form, fehler);
      return false;
    }
  }
  technischerFehler(form);
  return false;
}

/** Verbindet ein Formular mit Prüfung und Versand. */
export function verbinde(
  form: HTMLFormElement,
  optionen: { pruefeZusatz?: Zusatz } = {},
): void {
  if (form.dataset.verbunden !== undefined) return;
  form.dataset.verbunden = "";
  let sendet = false;

  // Beim Verlassen eines Feldes: nur dieses Feld prüfen und seinen Hinweis
  // zeigen. Ist ein Hinweis sichtbar, verschwindet er, sobald die Eingabe passt.
  const pruefeEines = (name: string) => {
    const elemente = felder(form).get(name);
    if (!elemente) return;
    const extra = zusatzVon(form, optionen.pruefeZusatz)?.(sammle(form)) ?? {};
    zeige(form, name, pruefeFeld(elemente) ?? extra[name] ?? null);
  };
  for (const [name, elemente] of felder(form)) {
    if (name === FALLE) continue;
    for (const el of elemente) {
      el.addEventListener("blur", () => pruefeEines(name));
      const nachkorrektur = () => {
        const ziel = el.type === "radio" ? el.closest("fieldset") : el;
        if (ziel?.getAttribute("aria-invalid") === "true") pruefeEines(name);
      };
      el.addEventListener("input", nachkorrektur);
      el.addEventListener("change", nachkorrektur);
    }
  }

  form.addEventListener("submit", async (ereignis) => {
    ereignis.preventDefault();
    if (sendet) return; // Doppelklick: nur ein Versand
    zeigeOben(form, null);
    const fehler = pruefeAlle(form, optionen.pruefeZusatz);
    if (Object.keys(fehler).length > 0) {
      fokusAufErstes(form, fehler);
      return;
    }
    sendet = true;
    sperre(form, true);
    let erfolg = false;
    try {
      const endpunkt = form.dataset.endpunkt;
      if (!endpunkt) throw new Error("Kein Endpunkt eingetragen.");
      const antwort = await fetch(endpunkt, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sammle(form)),
      });
      erfolg = await werteAus(form, antwort);
    } catch {
      technischerFehler(form);
    }
    if (erfolg) {
      zeigeDanke(form);
    } else {
      sendet = false;
      sperre(form, false);
    }
  });
}

/** Verbindet alle Fabrik-Formulare der Seite (aufgerufen von Formular.astro). */
export function verbindeAlle(): void {
  document
    .querySelectorAll<HTMLFormElement>("form[data-formular]")
    .forEach((form) => verbinde(form));
}
