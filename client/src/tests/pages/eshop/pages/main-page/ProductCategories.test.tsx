import ProductCategories, {
  categories,
} from "@/pages/eshop/pages/main-page/ProductCategories";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("ProductCategories - Unit Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ProductCategories />
      </MemoryRouter>,
    );
  });

  test("renders product categories with correct links and images", () => {
    categories.forEach(({ name, link }) => {
      const image = screen.getByAltText(name);
      expect(image).toBeInTheDocument();

      const anchor = image.closest("a");
      expect(anchor).toHaveAttribute("href", link ?? "#");
    });
  });
});
