import { Router, Request, Response } from "express";
import { createOrder, OrderData } from "../db/orders-db";
import { z, ZodError } from "zod";
import { orderSchema } from "../../shared/OrderValidationSchema";
import { Pool } from "pg";
import {
  NodemailerService,
  SupportedLocale,
} from "../services/NodemailerService";
import { orderConfirmationEmail } from "../services/emailTemplates/orderConfirmation";

/**
 * Orders Router
 * Handles creation of new customer orders
 */
export default function ordersRouter(poolInstance?: Pool) {
  const router = Router();
  const orderMailService = new NodemailerService();

  type OrderBody = z.infer<typeof orderSchema>;

  /**
   * @route POST /api/orders/order
   * Validates incoming order data, creates a new order record in the database,
   * and returns the generated order ID
   * Sends an order confirmation email
   */
  router.post(
    "/order",
    async (
      req: Request<Record<string, never>, unknown, OrderBody>,
      res: Response,
    ) => {
      const parsed = orderSchema.safeParse(req.body);
      const userLocale: SupportedLocale =
        parsed.data?.locale === "cs" ? "cs" : "en";

      if (!parsed.success) {
        const errors = parsed.error.format();
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const data = parsed.data;

      const orderData: OrderData = {
        customer_name: data.name,
        customer_address: data.street,
        customer_city: data.city,
        customer_postalcode: data.zipCode,
        customer_email: data.email,
        customer_phone: data.phone,
        shipment_method: data.shipment_method,
        payment_method: data.payment_method,
        items: data.items,
        total_amount: data.total_amount,
        paid: data.paid,
      };

      try {
        const orderId = await createOrder(orderData, poolInstance);

        const { subject, html } = orderConfirmationEmail(
          orderData,
          orderId,
          userLocale,
          (locale) => orderMailService.getSignatureHTML(locale),
        );

        await orderMailService.sendMail({
          to: data.email,
          subject,
          html,
        });

        res.status(201).json({ success: true, orderId });
      } catch (err) {
        if (err instanceof ZodError) {
          res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.format(),
          });
        } else {
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
    },
  );

  return router;
}
