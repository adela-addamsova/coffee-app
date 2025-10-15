import { z } from "zod";
import { addressSchema } from "./AddressFormValidationSchema";

export const orderItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

export const orderSchema = z.object({
  ...addressSchema.shape,
  shipment_method: z.enum(["standard", "express"]),
  payment_method: z.enum(["card", "bank-transfer", "cash"]),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  total_amount: z.number().min(0),
  paid: z.boolean(),
});
