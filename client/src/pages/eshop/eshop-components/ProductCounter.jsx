import { useState } from 'react';

export default function QuantitySelector({ min = 1, max = 10, onChange }) {
    const [count, setCount] = useState(min);

    const handleChange = (newCount) => {
        if (newCount >= min && newCount <= max) {
            setCount(newCount);
            onChange?.(newCount);
        }
    };

    return (
        <div className="product-counter">
            <button
                onClick={() => handleChange(count - 1)}
                disabled={count <= min}
            >
                −
            </button>
            <input
                type="number"
                value={count}
                onChange={(e) => handleChange(Number(e.target.value))}
                min={min}
                max={max}
            />
            <button
                onClick={() => handleChange(count + 1)}
                disabled={count >= max}
            >
                +
            </button>
        </div>
    );
}
