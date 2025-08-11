import QuantitySelector from "@/pages/eshop/eshop-components/ProductCounter";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

describe("QuantitySelector Component - Unit Tests", () => {
  const getElements = () => ({
    input: screen.getByRole("spinbutton") as HTMLInputElement,
    incrementBtn: screen.getByText("+"),
    decrementBtn: screen.getByText("−"),
  });

  test("renders with default values", () => {
    render(<QuantitySelector />);
    const { input, incrementBtn, decrementBtn } = getElements();

    expect(input).toBeInTheDocument();
    expect(input.value).toBe("1");
    expect(incrementBtn).toBeInTheDocument();
    expect(decrementBtn).toBeInTheDocument();
    expect(decrementBtn).toBeDisabled();
  });

  test("increments and decrements", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector onChange={handleChange} />);
    const { input, incrementBtn, decrementBtn } = getElements();

    fireEvent.click(incrementBtn);
    expect(input.value).toBe("2");
    expect(handleChange).toHaveBeenCalledWith(2);

    fireEvent.click(decrementBtn);
    expect(input.value).toBe("1");
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  test("checks if increment is disabled at max", () => {
    render(<QuantitySelector min={1} max={1} />);
    const { incrementBtn } = getElements();
    expect(incrementBtn).toBeDisabled();
  });

  test("accepts manual input within bounds", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector min={1} max={5} onChange={handleChange} />);
    const { input } = getElements();

    fireEvent.change(input, { target: { value: "3" } });
    expect(input.value).toBe("3");
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  test("rejects manual input outside bounds", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector min={1} max={5} onChange={handleChange} />);
    const { input } = getElements();

    fireEvent.change(input, { target: { value: "10" } });
    expect(input.value).toBe("1");
    expect(handleChange).not.toHaveBeenCalled();
  });
});
