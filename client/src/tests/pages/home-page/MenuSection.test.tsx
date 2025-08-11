import MenuSection from "@/pages/home-page/MenuSection";
import { render, screen, within } from "@testing-library/react";

describe("MenuSection - Unit Tests", () => {
  beforeEach(() => {
    render(<MenuSection />);
  });

  test("renders a menu table with multiple rows and prices", () => {
    const menuTable = screen.getByRole("table");
    const tableRows = within(menuTable).getAllByRole("row");

    expect(tableRows.length).toBeGreaterThan(1);

    tableRows.forEach((row) => {
      const cells = within(row).getAllByRole("cell");
      expect(cells.length).toBe(2);

      const priceCells = document.querySelectorAll("td.price");
      priceCells.forEach((cell) => {
        expect(cell).toHaveTextContent(/\$\d/);
      });
    });
  });
});
