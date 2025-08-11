import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import ScrollToTop from "@/components/ScrollToTop";

describe("ScrollToTop - Unit Tests", () => {
  function TestNavigator({ to }: { to: string }) {
    const navigate = useNavigate();
    React.useEffect(() => {
      navigate(to);
    }, [navigate, to]);
    return null;
  }

  function renderWithRouter(initialEntries: string[], to?: string) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ScrollToTop />
        <Routes>
          <Route path="/initial-path" element={<div>Initial Page</div>} />
          <Route path="/new-path" element={<div>New Page</div>} />
          <Route path="/:hash" element={<div>Page with Hash</div>} />
          <Route path="/another#hash" element={<div>Another Page</div>} />
        </Routes>
        {to && <TestNavigator to={to} />}
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("calls window.scrollTo on pathname change without hash", () => {
    renderWithRouter(["/initial-path"], "/new-path");

    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("does not call window.scrollTo if URL contains hash", () => {
    renderWithRouter(["/#section"], "/another#hash");

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  test("renders null", () => {
    const { container } = render(<ScrollToTop />, { wrapper: MemoryRouter });

    expect(container.firstChild).toBeNull();
  });
});
