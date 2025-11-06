import nodemailer from "nodemailer";
import path from "path";

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

  private signatures: Record<
    SupportedLocale,
    { closing: string; signature: string }
  > = {
    en: { closing: "See you soon,", signature: "Morning Mist Coffee Team" },
    cs: { closing: "Brzy na shledanou,", signature: "Tým Morning Mist Coffee" },
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Returns HTML for the email signature, and embedded favicon
   * - locale: pick 'en' or 'cs' signature
   * - Uses CID to embed the image directly in the email
   */
  public getSignatureHTML(locale: SupportedLocale = "en"): string {
    const { closing, signature } = this.signatures[locale];
    return `
      <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0;">
        ${closing}
      </p>
      <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0;">
        ${signature}
      </p>
      <img src="cid:appFavicon" alt="Logo" width="44" height="44" style="margin-top:8px;">
    `;
  }

  /**
   * Sends an email with optional text and HTML
   */
  // async sendMail({ to, subject, text, html }: MailData): Promise<void> {
  //   await this.transporter.sendMail({
  //     from: `"Morning Mist Coffee" <${process.env.EMAIL_USER}>`,
  //     to,
  //     subject,
  //     text,
  //     html,
  //     attachments: [
  //       {
  //         filename: "favicon.ico",
  //         path: path.join(__dirname, "../../client/public/favicon.ico"),
  //         cid: "appFavicon",
  //       },
  //     ],
  //   });
  // }

  async sendMail({ to, subject, text, html }: MailData): Promise<void> {
    try {
      console.log("📧 Attempting to send email...");
      console.log("🔐 EMAIL_USER:", !!process.env.EMAIL_USER);
      console.log("🔐 EMAIL_PASS:", !!process.env.EMAIL_PASS);
      console.log("📨 To:", to);
      console.log("📨 Subject:", subject);

      const attachmentPath = path.join(
        __dirname,
        "../../client/public/favicon.ico",
      );
      console.log("📎 Attachment path:", attachmentPath);

      const mailOptions = {
        from: `"Morning Mist Coffee" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
        attachments: [
          {
            filename: "favicon.ico",
            path: attachmentPath,
            cid: "appFavicon",
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.response);
    } catch (err) {
      console.error(
        "❌ Failed to send email:",
        err instanceof Error ? err.message : err,
      );
      throw err;
    }
  }
}
