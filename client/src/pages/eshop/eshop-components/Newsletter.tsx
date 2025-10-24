import { JSX } from "react";
import { useState, FormEvent } from "react";
import ArrowIcon from "@assets/e-shop/eshop-components/newsletter-arrow.svg";
import { newsletterSchema } from "@shared/NewsletterValidationSchema";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL as string;

type Status = "validationError" | "success" | "exists" | "error" | null;

/**
 * NewsletterSection component
 *
 * Renders a newsletter subscription form with email input and submit button
 * Validates the email using a zod schema, submits to backend API,
 * and displays status messages for success, validation errors, existing subscription, or general errors
 *
 * @returns {JSX.Element} The newsletter subscription section element
 */

export default function NewsletterSection(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<Status>(null);
  const [validationError, setValidationError] = useState<string>("");
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus(null);
    setValidationError("");

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setStatus("validationError");
      setValidationError(t(result.error.errors[0].message));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else if (response.status === 409) {
        setStatus("exists");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="newsletter-section" data-testid="newsletter-section">
      <div className="newsletter-content">
        <h2>{t("eshop.newsletter-head")}</h2>
        <form onSubmit={handleSubmit} noValidate aria-label="newsletter form">
          <input
            type="email"
            placeholder={t("eshop.newsletter-placeholder")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="email-error"
          />
          <button type="submit">
            <img src={ArrowIcon} alt="Arrow Icon" className="w-8 h-8" />
          </button>
        </form>

        {status === "validationError" && (
          <p id="email-error" className="newsletter-error">
            {validationError}
          </p>
        )}
        {status === "success" && (
          <p className="newsletter-success">{t("eshop.newsletter-msg-1")}</p>
        )}
        {status === "exists" && (
          <p className="newsletter-error">{t("eshop.newsletter-msg-2")}</p>
        )}
        {status === "error" && (
          <p className="newsletter-error">{t("eshop.newsletter-msg-3")}</p>
        )}

        <p className="newsletter-content-text">{t("eshop.newsletter-info")}</p>
      </div>
    </section>
  );
}
