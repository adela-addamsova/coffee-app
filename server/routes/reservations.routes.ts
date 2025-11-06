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
import { reservationConfirmationEmail } from "../services/emailTemplates/reservationConfirmation";

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
   * Sends a confirmation email
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

        const { subject, html } = reservationConfirmationEmail(
          { name, email, datetime, guests },
          userLocale,
          (locale) => reservationMailService.getSignatureHTML(locale),
        );

        await reservationMailService.sendMail({
          to: email,
          subject,
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
