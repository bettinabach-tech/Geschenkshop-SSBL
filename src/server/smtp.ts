// smtp.ts — Versand über einen normalen Mailserver (SMTP) mit nodemailer
// (Aufgabe 010, decisions.md Nr. 8). Zugangsdaten nur aus den Umgebungs-
// variablen (Namen: .env.example); die Werte liefert die SSBL-IT und stehen
// beim Hosting-Anbieter, nie im Projekt.
// Fehlermeldungen nennen fehlende Variablen beim NAMEN, nie ihre Werte.
import nodemailer from "nodemailer";
import type { Mail } from "./empfaenger";

export const SMTP_VARIABLEN = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_FROM",
] as const;

type Umgebung = Record<string, string | undefined>;

export interface SmtpEinstellungen {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

/** Liest die Einstellungen; wirft mit den Namen fehlender Variablen. */
export function leseSmtpEinstellungen(
  umgebung: Umgebung = process.env,
): SmtpEinstellungen {
  const fehlend = SMTP_VARIABLEN.filter((name) => !umgebung[name]?.trim());
  if (fehlend.length > 0) {
    throw new Error(
      `Mailversand nicht eingerichtet — es fehlen: ${fehlend.join(", ")} (Vorlage: .env.example).`,
    );
  }
  const port = Number(umgebung.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT ist keine gültige Portnummer (z.B. 587).");
  }
  return {
    host: umgebung.SMTP_HOST!.trim(),
    port,
    user: umgebung.SMTP_USER!.trim(),
    pass: umgebung.SMTP_PASS!,
    from: umgebung.MAIL_FROM!.trim(),
  };
}

/** Das Stück von nodemailer, das wir brauchen (im Test ersetzbar). */
export type TransportFabrik = (optionen: {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
}) => { sendMail: (nachricht: Record<string, unknown>) => Promise<unknown> };

/**
 * Versandfunktion für verarbeiteEinsendung. Die Einstellungen werden erst beim
 * ersten Versand gelesen: Fehlt etwas, scheitert dieser Versand mit einer
 * Meldung (→ Antwort 502, Eintrag im Protokoll), statt den Server zu stoppen.
 */
export function erstelleSmtpVersand(
  umgebung: Umgebung = process.env,
  fabrik: TransportFabrik = nodemailer.createTransport as unknown as TransportFabrik,
): (mail: Mail) => Promise<void> {
  let verbindung: {
    from: string;
    transport: ReturnType<TransportFabrik>;
  } | null = null;
  return async (mail) => {
    if (!verbindung) {
      const e = leseSmtpEinstellungen(umgebung);
      verbindung = {
        from: e.from,
        transport: fabrik({
          host: e.host,
          port: e.port,
          secure: e.port === 465, // 465 = verschlüsselt ab Start, sonst STARTTLS
          auth: { user: e.user, pass: e.pass },
        }),
      };
    }
    await verbindung.transport.sendMail({
      from: verbindung.from,
      to: mail.an,
      replyTo: mail.antwortAn,
      subject: mail.betreff,
      text: mail.text,
      html: mail.html,
    });
  };
}
