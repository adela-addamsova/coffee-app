import ProductCategories from "@/pages/eshop/pages/main-page/ProductCategories";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../../../test-i18n";

describe("ProductCategories - Unit Tests", () => {
  test("renders all product categories with images and links", async () => {
    const i18n = await createTestI18n();

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ProductCategories />
        </MemoryRouter>
      </I18nextProvider>,
    );

    const section = screen.getByTestId("product-categories");
    expect(section).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);

    images.forEach((img) => {
      expect(img).toBeInTheDocument();
      const anchor = img.closest("a");
      expect(anchor).toHaveAttribute("href");
    });

    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/decaf/i)).toBeInTheDocument();
  });
});
