import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import EshopLandingPage from "@/pages/eshop/pages/main-page/EshopLandingPage";
import { createTestI18n } from "../test-i18n";
import { MemoryRouter } from "react-router-dom";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

describe("LanguageSwitcher integration with EshopLandingPage", () => {
  beforeEach(async () => {
    i18n = await createTestI18n();
    i18n.changeLanguage("en");
  });

  it("updates EshopLandingPage text when language is switched", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LanguageSwitcher />
          <EshopLandingPage />
        </MemoryRouter>
      </I18nextProvider>,
    );

    expect(screen.getByText(/freshly roasted coffee/i)).toBeInTheDocument();
    expect(screen.getByText(/new selection coffee/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Čeština" }));

    await waitFor(() => {
      expect(screen.getByText(/Čerstvě pražená káva/i)).toBeInTheDocument();
      expect(screen.getByText(/Nová výběrová káva/i)).toBeInTheDocument();
    });
  });
});
