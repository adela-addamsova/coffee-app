import { Router, Request, Response } from "express";
import {
  getAllReservations,
  createReservationIfAvailable,
} from "@db/reservations-db";
import { reservationSchema } from "@shared/ReservationFormValidationSchema";
import { z } from "zod";

/**
 * Creates and returns a router that handles reservation-related API endpoints
 */
export default function reservationRouter() {
  const router = Router();

  type ReservationBody = z.infer<typeof reservationSchema>;

  /**
   * GET /api/reservations
   * Returns all reservations from the database
   */
  router.get("/", async (req: Request, res: Response) => {
    try {
      const reservations = await getAllReservations();
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

      if (!result.success) {
        const errors = result.error.format();
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      const { name, email, datetime, guests } = result.data;

      try {
        const success = await createReservationIfAvailable(
          name,
          email,
          datetime,
          guests,
        );
        if (!success) {
          return res
            .status(400)
            .json({ message: "Time slot already booked out" });
        }
        res.json({ message: "Reservation successful" });
      } catch (_err) {
        res.status(500).json({ message: "Server error" });
      }
    },
  );

  return router;
}
