import { render, screen } from "@testing-library/react";
import EshopInfoBoxes from "@/pages/eshop/eshop-components/EshopInfoBoxes";
import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("EshopInfoBoxes", () => {
  beforeEach(() => {
    render(<EshopInfoBoxes />);
  });

  test("renders all titles", () => {
    [
      "eshop.info-box-head-1",
      "eshop.info-box-head-2",
      "eshop.info-box-head-3",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("renders all texts", () => {
    [
      "eshop.info-box-text-1",
      "eshop.info-box-text-2",
      "eshop.info-box-text-3",
    ].forEach((text) => {
      expect(screen.getByText(text, { exact: false })).toBeInTheDocument();
    });
  });

  test("renders all info boxes", () => {
    const infoBoxes = screen.getByTestId("eshop-info-boxes");
    expect(infoBoxes).toBeInTheDocument();
  });

  test("renders all titles correctly", () => {
    const titles = screen.getAllByText(/./, { selector: ".title" });
    expect(titles.length).toBe(3);
  });

  test("renders images with correct alt attributes", () => {
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(3);
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });
});
