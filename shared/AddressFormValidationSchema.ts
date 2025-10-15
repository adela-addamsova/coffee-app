import { z } from "zod";

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your full name")
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Please enter your full name",
    }),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number")
    .max(9, "Please enter a valid phone number")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  street: z
    .string()
    .min(1, "Please enter your address")
    .refine((val) => /\D+\s+\d+/.test(val), {
      message: "Please enter a valid address (e.g., 'Main St 123')",
    }),
  city: z.string().min(1, "Please enter a city"),
  zipCode: z.string().min(1, "Please enter a postal code"),
});
