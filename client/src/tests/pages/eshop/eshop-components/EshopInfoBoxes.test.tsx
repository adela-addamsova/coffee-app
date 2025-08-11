import EshopInfoBoxes, {
  categories,
} from "@/pages/eshop/eshop-components/EshopInfoBoxes";
import { render, screen } from "@testing-library/react";

describe("EshopInfoBoxes - Unit Tests", () => {
  beforeEach(() => {
    render(<EshopInfoBoxes />);
  });

  test("renders all info boxes", () => {
    const infoBoxes = screen.getByTestId("eshop-info-boxes");
    expect(infoBoxes).toBeInTheDocument();
  });

  test("renders all titles correctly", () => {
    categories.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("renders images with correct alt attributes", () => {
    categories.forEach(({ title }) => {
      expect(screen.getByAltText(title)).toBeInTheDocument();
    });
  });
});
