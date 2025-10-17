import { z } from "zod";

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, "errors.name-required")
    .refine((val: string) => val.trim().split(/\s+/).length >= 2, {
      message: "errors.name-required",
    }),
  email: z.string().email("errors.invalid-email"),
  phone: z
    .string()
    .min(9, "errors.invalid-phone")
    .max(9, "errors.invalid-phone")
    .regex(/^\d+$/, "errors.invalid-phone"),
  street: z
    .string()
    .min(1, "errors.address-required")
    .refine((val: string) => /\D+\s+\d+/.test(val), {
      message: "errors.invalid-address",
    }),
  city: z.string().min(1, "errors.city-required"),
  zipCode: z.string().min(1, "errors.zip-required"),
});
