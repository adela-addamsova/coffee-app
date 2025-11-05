import { Router, Request, Response } from "express";
import {
  insertNewsletterSubscriber,
  isEmailSubscribed,
} from "../db/newsletter-db";
import { newsletterSchema } from "../../shared/NewsletterValidationSchema";
import { Pool } from "pg";
import {
  NodemailerService,
  SupportedLocale,
} from "../services/NodemailerService";

export default function newsletterRouter(poolInstance?: Pool) {
  const router = Router();
  const newsletterMailService = new NodemailerService();

  /**
   * POST /api/subscribe
   * Validates input with Zod and inserts a subscriber
   *
   * @param req - Express Request object containing email in the body
   * @param res - Express Response object used to send the result
   * @returns JSON response with success message or error
   */
  router.post("/", async (req: Request, res: Response) => {
    const parseResult = newsletterSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: parseResult.error.errors[0].message });
    }

    const { email, locale } = parseResult.data;
    const ip_address = req.ip;
    const userLocale: SupportedLocale = locale === "cs" ? "cs" : "en";

    try {
      const alreadySubscribed = await isEmailSubscribed(email, poolInstance);
      if (alreadySubscribed) {
        return res
          .status(409)
          .json({ error: "This email is already subscribed" });
      }

      const result = await insertNewsletterSubscriber(
        email,
        ip_address,
        poolInstance,
      );

      const newsletterTexts = {
        en: {
          subject: "Morning Mist Coffee Newsletter",
          heading: "Welcome to the Morning Mist Coffee Newsletter!",
          body: "Thank you for subscribing to our newsletter! We’ll be sending you updates, special offers, and the latest news.",
        },
        cs: {
          subject: "Morning Mist Coffee Newsletter",
          heading: "Vítejte v newsletteru Morning Mist Coffee!",
          body: "Děkujeme, že jste se přihlásili k odběru našeho newsletteru! Budeme vám zasílat novinky, speciální nabídky a aktuální informace.",
        },
      };

      const html = `
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; padding: 24px;">
          <tr>
            <td>
              <h4 style="font-size: 32px; font-family: Georgia, serif; margin:0 0 24px 0; line-height: 40px;">
                ${newsletterTexts[userLocale].heading}
              </h4>
              <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0 0 24px 0;">
                ${newsletterTexts[userLocale].body}
              </p>
              ${newsletterMailService.getSignatureHTML(userLocale)}
            </td>
          </tr>
        </table>
      `;

      await newsletterMailService.sendMail({
        to: email,
        subject: newsletterTexts[userLocale].subject,
        html,
      });

      return res.status(201).json({
        message: "Subscription successful",
        id: result.id,
      });
    } catch (_err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
