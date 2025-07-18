import { Router, Request, Response } from 'express';
import { insertNewsletterSubscriber, isEmailSubscribed } from '../db/newsletter-db';
import { newsletterSchema } from '../../shared/NewsletterValidationSchema';

const router = Router();

/**
 * POST /api/subscribe
 * Validates input with Zod and inserts a subscriber
 *
 * @param req - Express Request object containing email in the body
 * @param res - Express Response object used to send the result
 * @returns JSON response with success message or error
 */
router.post('/', (req: Request, res: Response) => {
  const parseResult = newsletterSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors[0].message });
  }

  const { email } = parseResult.data;
  const ip_address = req.ip;

  try {
    if (isEmailSubscribed(email)) {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }

    const result = insertNewsletterSubscriber(email, ip_address);
    return res.status(201).json({ message: 'Subscription successful', id: result.lastInsertRowid });

  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
