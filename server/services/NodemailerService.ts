import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface MailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface MailService {
  sendMail(mailData: MailData): Promise<void>;
}

export type SupportedLocale = "en" | "cs";

export class NodemailerService implements MailService {
  private transporter;
  private oauth2Client;

  private signatures: Record<
    SupportedLocale,
    { closing: string; signature: string }
  > = {
    en: { closing: "See you soon,", signature: "Morning Mist Coffee Team" },
    cs: { closing: "Brzy na shledanou,", signature: "Tým Morning Mist Coffee" },
  };

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground",
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const transportOptions = new SMTPTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  public getSignatureHTML(locale: SupportedLocale = "en"): string {
    const { closing, signature } = this.signatures[locale];
    return `
      <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0;">
        ${closing}
      </p>
      <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0;">
        ${signature}
      </p>
      <img src="https://coffee-app-frontend-chi.vercel.app/favicon.ico" alt="Logo" width="44" height="44" style="margin-top:8px;">
    `;
  }

  async sendMail({ to, subject, text, html }: MailData): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Morning Mist Coffee" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      throw err;
    }
  }
}
