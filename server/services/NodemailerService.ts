import { google } from "googleapis";

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

export class GmailService implements MailService {
  private gmail;
  private signatures: Record<
    SupportedLocale,
    { closing: string; signature: string }
  > = {
    en: { closing: "See you soon,", signature: "Morning Mist Coffee Team" },
    cs: { closing: "Brzy na shledanou,", signature: "Tým Morning Mist Coffee" },
  };

  constructor() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground",
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.gmail = google.gmail({ version: "v1", auth: oauth2Client });
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
      const messageParts = [
        `From: "Morning Mist Coffee" <${process.env.EMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        `Content-Type: text/html; charset=UTF-8`,
        "",
        html || text || "",
      ];

      const message = Buffer.from(messageParts.join("\r\n"))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await this.gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: message,
        },
      });

      console.log(`✅ Email sent to ${to}`);
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      throw err;
    }
  }
}
