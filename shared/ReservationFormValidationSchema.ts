import { z } from "zod";

export const MAX_CAPACITY = 10;

const baseReservationSchema = z.object({
  name: z
    .string()
    .min(1, "errors.name-required")
    .refine((val: string) => val.trim().split(/\s+/).length >= 2, {
      message: "errors.name-required",
    }),
  email: z.string().email("errors.invalid-email"),
  guests: z.number().min(1, "At least one guest required"),
  datetime: z.string().datetime(),
  remainingSeats: z.number().optional(),
  locale: z.enum(["en", "cs"]).optional(),
});

export const reservationSchema = baseReservationSchema.superRefine(
  (data, ctx) => {
    const max = data.remainingSeats ?? MAX_CAPACITY;
    if (data.guests > max) {
      ctx.addIssue({
        path: ["guests"],
        code: z.ZodIssueCode.too_big,
        maximum: max,
        type: "number",
        inclusive: true,
        message: `Guest count must not exceed ${max}`,
      });
    }
  },
);

export const reservationResponseSchema = baseReservationSchema.omit({
  remainingSeats: true,
});
