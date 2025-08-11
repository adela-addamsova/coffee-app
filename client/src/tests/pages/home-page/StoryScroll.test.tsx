import StoryScroll from "@/pages/home-page/StoryScroll";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom";

describe("StoryScroll - Unit Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <StoryScroll />
      </MemoryRouter>,
    );
  });

  test("renders all slides", () => {
    const slide1 = screen.getByTestId(/slide-1/i);
    const slide2 = screen.getByTestId(/slide-2/i);
    const slide3 = screen.getByTestId(/slide-3/i);

    expect(slide1).toBeInTheDocument();
    expect(slide2).toBeInTheDocument();
    expect(slide3).toBeInTheDocument();
  });

  test("renders slides with text and images", () => {
    for (let i = 1; i <= 3; i++) {
      const slide = screen.getByTestId(`slide-${i}`);
      expect(slide.querySelector("img")).toBeInTheDocument();
      expect(slide.querySelector("p")).toBeInTheDocument();
    }
  });

  test("renders last slides' button with href and text", () => {
    const slide = screen.getByTestId(/slide-3/i);
    const button = within(slide).getByRole("link", { name: /eshop/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/e-shop");
    expect(button).toHaveAttribute("class", "main-button white");
  });
});

describe("StoryScroll - Integration Test", () => {
  test("navigates to e-shop on button click", async () => {
    const user = userEvent.setup();
    const EshopPage = () => <div data-testid="eshop-page">E-shop Page</div>;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<StoryScroll />} />
          <Route path="/e-shop" element={<EshopPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const button = screen.getByRole("link", { name: /eshop/i });
    await user.click(button);
    expect(screen.getByTestId("eshop-page")).toBeInTheDocument();
  });
});

describe("StoryScroll - Scroll Behavior", () => {
  const slides = 3;
  const slideHeightVh = 70;
  const extraScrollVh = 30;
  let vh: number;
  let slideHeightPx: number;
  let extraScrollPx: number;
  let totalHeightPx: number;
  let totalScroll: number;
  let section: HTMLElement;
  let track: HTMLElement;

  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      writable: true,
    });

    render(
      <MemoryRouter>
        <StoryScroll />
      </MemoryRouter>,
    );

    section = screen.getByTestId("story-scroll-section");
    track = screen.getByTestId("story-scroll-track");

    vh = window.innerHeight / 100;
    slideHeightPx = slideHeightVh * vh;
    extraScrollPx = extraScrollVh * vh;
    totalHeightPx = slides * slideHeightPx + extraScrollPx;
    totalScroll = totalHeightPx - window.innerHeight;
  });

  const triggerScroll = (scrollY: number, offsetTop = 0) => {
    Object.defineProperty(section, "offsetTop", {
      configurable: true,
      value: offsetTop,
    });
    window.scrollY = scrollY;
    fireEvent.scroll(window);
  };

  test("transforms is 0vw at top scroll (scrollY = sectionTop)", () => {
    triggerScroll(0, 0);
    expect(track.style.transform).toBe("translateX(0vw)");
  });

  test("transforms clamps at max scroll (scrollY > total scroll)", () => {
    triggerScroll(2000, 0);
    expect(track.style.transform).toBe(`translateX(-${(slides - 1) * 100}vw)`);
  });

  test("transforms calculates correctly with non-zero section offsetTop", () => {
    const scrollY = 150;
    const offsetTop = 100;
    triggerScroll(scrollY, offsetTop);

    const clamped = Math.max(0, Math.min(scrollY - offsetTop, totalScroll));
    const progress = clamped / totalScroll;
    const expectedTranslate = -progress * (slides - 1) * 100;

    expect(track.style.transform).toBe(`translateX(${expectedTranslate}vw)`);
  });
});
