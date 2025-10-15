import { z } from "zod";

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{16}$/.test(val), {
      message: "Card number must be exactly 16 digits",
    }),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY")
    .refine(
      (value) => {
        const [month, year] = value.split("/").map((v) => parseInt(v, 10));
        if (!month || !year) return false;

        const fullYear = 2000 + year;
        const expiryDate = new Date(fullYear, month, 0);
        const today = new Date();

        return expiryDate >= today;
      },
      { message: "Card has expired" },
    ),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be 3 digits"),
});
