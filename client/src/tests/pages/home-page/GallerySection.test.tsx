import FullWidthSwiper from "@/pages/home-page/GallerySection";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("GallerySection - Unit Tests", () => {
  beforeEach(() => {
    render(<FullWidthSwiper />);
  });

  test("renders gallery swiper with desktop and mobile images", () => {
    expect(screen.getByTestId("gallery-text")).toBeInTheDocument();

    const desktopSwiper = screen.getByTestId("desktop-swiper");
    expect(desktopSwiper).toBeInTheDocument();
    expect(
      within(desktopSwiper).getAllByAltText(/Interior-slide-1/i),
    ).toHaveLength(3);

    const mobileSwiper = screen.getByTestId("mobile-swiper");
    expect(mobileSwiper).toBeInTheDocument();
    expect(within(mobileSwiper).getAllByRole("img")).toHaveLength(8);
  });

  describe("Lightbox behavior - Unit Tests", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
    });

    test("opens image in lightbox on click", async () => {
      const img = screen.getByAltText("Interior-slide-1 img-1");
      await user.click(img);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("closes lightbox with Escape key and close button", async () => {
      const img = screen.getByAltText("Interior-slide-1 img-1");

      await user.click(img);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      await user.click(img);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });
});
