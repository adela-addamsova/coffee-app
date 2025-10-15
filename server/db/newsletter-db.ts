import { query } from "./coffee-app-db";

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
 * A subscriber used for existence checks
 */
type NewsletterSubscriberCheck = Pick<NewsletterSubscriber, "id">;

/**
 * Checks if the given email is already subscribed (i.e., not soft-deleted)
 *
 * @param email - The subscriber's email
 * @returns True if the email exists and is not deleted, false otherwise
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  const result = await query<NewsletterSubscriberCheck>(
    `
      SELECT id FROM newsletter_subscribers
      WHERE email = $1 AND deleted_at IS NULL
    `,
    [email],
  );

  return result.length > 0;
}

/**
 * Inserts a new subscriber into the newsletter table
 *
 * @param email - The subscriber's email address
 * @param ip_address - The IP address of the subscriber
 * @returns The inserted subscriber row
 */
export async function insertNewsletterSubscriber(
  email: string,
  ip_address?: string,
): Promise<NewsletterSubscriber> {
  const result = await query<NewsletterSubscriber>(
    `
      INSERT INTO newsletter_subscribers (email, ip_address)
      VALUES ($1, $2)
      RETURNING *
    `,
    [email, ip_address || null],
  );

  return result[0];
}
