import type { Database as DBType } from "better-sqlite3";

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
function isEmailSubscribed(email: string, dbInstance: DBType): boolean {
  const result = dbInstance
    .prepare(
      `
        SELECT id FROM newsletter_subscribers
        WHERE email = ? AND deleted_at IS NULL
    `,
    )
    .get(email) as NewsletterSubscriberCheck | undefined;

  return !!result;
}

/**
 * Inserts a new subscriber into the newsletter table
 *
 * @param email - The subscriber's email address
 * @param ip_address - The IP address of the subscriber
 * @returns The result of the insertion operation
 */
function insertNewsletterSubscriber(
  email: string,
  ip_address: string | undefined,
  dbInstance: DBType,
) {
  return dbInstance
    .prepare(
      `
        INSERT INTO newsletter_subscribers (email, ip_address)
        VALUES (?, ?)
    `,
    )
    .run(email, ip_address);
}

export { insertNewsletterSubscriber, isEmailSubscribed };
