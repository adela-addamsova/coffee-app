import { useState, ChangeEvent, JSX, useEffect } from "react";

type QuantitySelectorProps = {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
};

/**
 * QuantitySelector component
 *
 * A numeric input with increment and decrement buttons to select a quantity
 *
 * @param {Object} props - Component props
 * @param {number} [props.min=1] - Minimum allowed quantity
 * @param {number} [props.max=10] - Maximum allowed quantity
 * @param {(value: number) => void} [props.onChange] - Optional callback triggered when quantity changes
 * @returns {JSX.Element} The quantity selector element
 */

export default function QuantitySelector({
  min = 1,
  max = 10,
  value,
  onChange,
}: QuantitySelectorProps): JSX.Element {
  const [count, setCount] = useState<number>(value ?? min);

  useEffect(() => {
    if (value !== undefined) setCount(value);
  }, [value]);

  const handleChange = (newCount: number) => {
    if (newCount >= min && newCount <= max) {
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!isNaN(v)) handleChange(v);
  };

  return (
    <div className="product-counter">
      <button onClick={() => handleChange(count - 1)} disabled={count <= min}>
        −
      </button>
      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        min={min}
        max={max}
      />
      <button onClick={() => handleChange(count + 1)} disabled={count >= max}>
        +
      </button>
    </div>
  );
}
