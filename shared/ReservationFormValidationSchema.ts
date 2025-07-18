import { z } from 'zod';

export const MAX_CAPACITY = 10;

export const reservationSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Please enter your full name')
      .refine((val) => val.trim().split(/\s+/).length >= 2, {
        message: 'Please enter your full name',
      }),
    email: z.string().email('Please enter a valid email address'),
    guests: z.number().min(1, 'At least one guest required'),
    datetime: z.string().datetime(),
    remainingSeats: z.number(),
  })
  .superRefine((data, ctx) => {
    const max = data.remainingSeats ?? MAX_CAPACITY;
    if (data.guests > max) {
      ctx.addIssue({
        path: ['guests'],
        code: z.ZodIssueCode.too_big,
        maximum: max,
        type: 'number',
        inclusive: true,
        message: `Guest count must not exceed ${max}`,
      });
    }
  });
