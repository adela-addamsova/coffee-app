import { query } from "./coffee-app-db";
import type { Pool } from "pg";

/**
 * Interface representing a newsletter subscriber
 */
export interface NewsletterSubscriber {
  id: number;
  email: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  ip_address: string | null;
}

/**
 * Checks if the given email is already subscribed (i.e., not soft-deleted)
 *
 * @param email - The subscriber's email
 * @returns True if the email exists and is not deleted, false otherwise
 */
export async function isEmailSubscribed(
  email: string,
  poolInstance?: Pool,
): Promise<boolean> {
  const result = await query<{ id: number }>(
    `
      SELECT id FROM newsletter_subscribers
      WHERE email = $1 AND deleted_at IS NULL
    `,
    [email],
    poolInstance,
  );

  return result.length > 0;
}

export async function insertNewsletterSubscriber(
  email: string,
  ip_address?: string,
  poolInstance?: Pool,
) {
  const result = await query(
    `
      INSERT INTO newsletter_subscribers (email, ip_address)
      VALUES ($1, $2)
      RETURNING *
    `,
    [email, ip_address || null],
    poolInstance,
  );

  return result[0];
}
