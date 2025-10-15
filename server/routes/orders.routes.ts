import { Router, Request, Response } from "express";
import { createOrder, OrderData } from "@db/orders-db";
import { z } from "zod";
import { orderSchema } from "shared/OrderValidationSchema";

/**
 * Orders Router
 * Handles creation of new customer orders
 */
export default function ordersRouter() {
  const router = Router();

  type OrderBody = z.infer<typeof orderSchema>;

  /**
   * @route POST /api/orders/order
   * Validates incoming order data, creates a new order record in the database,
   * and returns the generated order ID
   */
  router.post(
    "/order",
    async (
      req: Request<Record<string, never>, unknown, OrderBody>,
      res: Response,
    ) => {
      const parsed = orderSchema.safeParse(req.body);

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
        // no dbInstance needed, use pool inside createOrder
        const orderId = await createOrder(orderData);
        res.status(201).json({ success: true, orderId });
      } catch (err) {
        if (err instanceof Error) {
          res.status(400).json({ success: false, message: err.message });
        } else {
          res.status(400).json({ success: false, message: "Unknown error" });
        }
      }
    },
  );

  return router;
}
