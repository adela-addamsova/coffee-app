import { Router, Request, Response } from "express";
import {
  getAllReservations,
  createReservationIfAvailable,
} from "../db/reservations-db";
import { reservationSchema } from "../../shared/ReservationFormValidationSchema";
import { z } from "zod";
import { Pool } from "pg";
import {
  NodemailerService,
  SupportedLocale,
} from "../services/NodemailerService";

/**
 * Creates and returns a router that handles reservation-related API endpoints
 */
export default function reservationRouter(poolInstance?: Pool) {
  const router = Router();
  const reservationMailService = new NodemailerService();

  type ReservationBody = z.infer<typeof reservationSchema>;

  /**
   * GET /api/reservations
   * Returns all reservations from the database
   */
  router.get("/", async (req: Request, res: Response) => {
    try {
      const reservations = await getAllReservations(poolInstance);
      res.json(reservations);
    } catch (_err) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  /**
   * POST /api/reservations/reserve
   * Validates input with Zod and creates a reservation if capacity allows
   */
  router.post(
    "/reserve",
    async (
      req: Request<Record<string, never>, unknown, ReservationBody>,
      res: Response,
    ) => {
      const result = reservationSchema.safeParse(req.body);
      const userLocale: SupportedLocale =
        result.data?.locale === "cs" ? "cs" : "en";

      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.format(),
        });
      }

      const { name, email, datetime, guests } = result.data;

      try {
        const success = await createReservationIfAvailable(
          name,
          email,
          datetime,
          guests,
          poolInstance,
        );

        if (!success) {
          return res
            .status(400)
            .json({ message: "Time slot already booked out" });
        }

        const reservationTexts = {
          en: {
            subject: "Reservation Confirmation",
            text: "Your reservation is confirmed. Thank you for choosing us – we're looking forward to your visit.",
            summary: "Reservation Summary",
            summaryTime: "Date and time:",
            summarySeats: "Guests:",
          },
          cs: {
            subject: "Potvrzení rezervace",
            text: "Povrzujeme Vaši rezervaci. Děkujeme, že jste si nás vybrali – těšíme se na Vaši návštěvu.",
            summary: "Shrnutí rezervace",
            summaryTime: "Datum a čas:",
            summarySeats: "Počet hostů:",
          },
        };

        const formattedDate = new Intl.DateTimeFormat(
          userLocale === "cs" ? "cs-CZ" : "en-GB",
          {
            dateStyle: "long",
            timeStyle: "short",
          },
        ).format(new Date(result.data.datetime));

        const html = `
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; padding: 24px;">
              <tr>
                <td>
                  <p style="font-size: 16px; font-family: Georgia, serif; margin:0 0 32px 0; line-height: 32px;">
                    ${reservationTexts[userLocale].text}
                  </p>
                  <h4 style="font-size: 20px; font-family: Georgia, serif; margin:0 0 4px 0; line-height: 32px;">
                    ${reservationTexts[userLocale].summary}
                  </h4>
                  <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0 0 0 20px;">
                    <strong>${reservationTexts[userLocale].summaryTime}</strong> ${formattedDate}
                  </p>
                  <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0 0 24px 20px;">
                    <strong>${reservationTexts[userLocale].summarySeats}</strong> ${result.data.guests}
                  </p>
                  ${reservationMailService.getSignatureHTML(userLocale)}
                </td>
              </tr>
            </table>
      `;

        await reservationMailService.sendMail({
          to: email,
          subject: reservationTexts[userLocale].subject,
          html,
        });

        return res.json({ message: "Reservation successful" });
      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
    },
  );

  return router;
}
