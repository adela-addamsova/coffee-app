import NewsletterSection from "@/pages/eshop/eshop-components/Newsletter";
import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../../test-i18n";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

beforeEach(async () => {
  global.fetch = vi.fn() as Mock;
  i18n = await createTestI18n();

  render(
    <I18nextProvider i18n={i18n}>
      <NewsletterSection />
    </I18nextProvider>,
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

const fillAndSubmitForm = (email: string) => {
  const form = screen.getByRole("form", { name: /newsletter form/i });
  const input = within(form).getByPlaceholderText(/enter your email/i);
  const button = within(form).getByRole("button");
  fireEvent.change(input, { target: { value: email } });
  fireEvent.click(button);
};

describe("NewsletterSection Component - Unit Tests", () => {
  test("renders form elements", () => {
    const form = screen.getByRole("form", { name: /newsletter form/i });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(within(form).getByRole("button")).toBeInTheDocument();
  });

  test("shows validation error for invalid email", async () => {
    fillAndSubmitForm("invalid-email");

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  test("shows 'already subscribed' message for existing email on 409 response", async () => {
    (fetch as Mock).mockResolvedValueOnce({ ok: false, status: 409 });

    fillAndSubmitForm("subscribed@email.com");

    await waitFor(() => {
      expect(
        screen.getByText(/you are already subscribed/i),
      ).toBeInTheDocument();
    });
  });

  test("shows success message on successful subscription", async () => {
    (fetch as Mock).mockResolvedValueOnce({ ok: true });

    fillAndSubmitForm("test@email.com");

    await waitFor(() => {
      expect(
        screen.getByText(/thank you for subscribing/i),
      ).toBeInTheDocument();
    });
  });

  test("shows error message on general error", async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error("Network error"));

    fillAndSubmitForm("test@email.com");

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });

  test("checks correct czech translation", async () => {
    await i18n.changeLanguage("cs");

    (fetch as Mock).mockResolvedValueOnce({ ok: true });

    fillAndSubmitForm("test@email.com");

    await waitFor(() => {
      expect(screen.getByText(/děkujeme za přihlášení/i)).toBeInTheDocument();
    });
  });
});
