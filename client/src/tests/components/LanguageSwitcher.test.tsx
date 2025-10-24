import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import LanguageSwitcher from "@/components/LanguageSwitcher";

vi.mock("@assets/components/cz-flag.png", () => ({ default: "cz-flag.png" }));
vi.mock("@assets/components/en-flag.png", () => ({ default: "en-flag.png" }));

const changeLanguageMock = vi.fn();
const mockI18n = { language: "en", changeLanguage: changeLanguageMock };

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: mockI18n }),
}));

describe("LanguageSwitcher - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    render(<LanguageSwitcher />);
  });

  test("renders both language buttons with images and highlighted current language", () => {
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Čeština" })).toBeInTheDocument();

    const englishFlag = screen.getByAltText("English");
    const czechFlag = screen.getByAltText("Čeština");

    expect(englishFlag).toHaveStyle({ height: "40px" });
    expect(czechFlag).toHaveStyle({ height: "32px" });
  });

  test("calls i18n.changeLanguage and saves to localStorage when clicked", () => {
    const czechButton = screen.getByRole("button", { name: "Čeština" });

    fireEvent.click(czechButton);

    expect(changeLanguageMock).toHaveBeenCalledWith("cs");
    expect(localStorage.getItem("language")).toBe("cs");
  });

  test("loads saved language from localStorage on mount", () => {
    localStorage.setItem("language", "cs");

    render(<LanguageSwitcher />);

    expect(changeLanguageMock).toHaveBeenCalledWith("cs");
  });

  test("does not call changeLanguage if saved language equals current", () => {
    mockI18n.language = "cs";
    localStorage.setItem("language", "cs");

    render(<LanguageSwitcher />);
    expect(changeLanguageMock).not.toHaveBeenCalled();
  });
});
