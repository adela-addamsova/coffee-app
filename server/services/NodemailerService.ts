import nodemailer from "nodemailer";

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
  //   });
  // }

  async sendMail({ to, subject, text, html }: MailData): Promise<void> {
    try {
      console.log("📧 Sending email to:", to);
      const info = await this.transporter.sendMail({
        from: `"Morning Mist Coffee" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log("✅ Email sent:", info.response);
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      throw err; // rethrow so the route logs it too
    }
  }
}
