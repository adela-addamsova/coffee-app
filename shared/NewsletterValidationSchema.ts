import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("errors.invalid-email"),
  locale: z.enum(["en", "cs"]).optional(),
});
