import { Router, Request, Response } from "express";
import { google } from "googleapis";

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI || "http://localhost:5000/auth/google/callback",
);

router.get("/google", (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
    prompt: "consent",
  });
  res.redirect(url);
});

router.get("/google/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.send(`
      <h2>Google OAuth Successful ✅</h2>
      <p>Refresh token: <b>${tokens.refresh_token}</b></p>
      <p>Copy it now and store it safely in your environment variables.</p>
    `);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth failed");
  }
});

export default router;
