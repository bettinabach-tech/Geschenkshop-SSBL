// regeln.ts — Formatregeln, die Browser (client.ts) und Server (Bestellregeln,
// Aufgabe 018) teilen: eine Stelle, keine Abweichungen. Rein: kein DOM, kein
// Netz, keine Uhr. Texte: vom Auftraggeber freigegeben am 11.09.2026.

export const FORMAT_MELDUNG = {
  email: "Bitte prüfen Sie die E-Mail-Adresse, z.B. name@beispiel.ch.",
  telefon: "Bitte geben Sie eine Telefonnummer mit mindestens 9 Ziffern an.",
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Erlaubt: Ziffern, Leerzeichen, + - / ( ); mindestens 9 Ziffern.
const TELEFON_ZEICHEN = /^[\d\s+\-/()]*$/;
const TELEFON_MIN_ZIFFERN = 9;

export function istEmail(text: string): boolean {
  return EMAIL.test(text.trim());
}

export function istTelefon(text: string): boolean {
  const t = text.trim();
  return (
    TELEFON_ZEICHEN.test(t) &&
    t.replace(/\D/g, "").length >= TELEFON_MIN_ZIFFERN
  );
}
