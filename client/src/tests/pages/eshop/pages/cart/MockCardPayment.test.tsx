import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockPaymentForm from "@/pages/eshop/pages/cart/MockCartPayment";
import React from "react";
import { describe } from "vitest";

const PaymentFormTestWrapper = () => {
  const [cardData, setCardData] = React.useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  return (
    <MockPaymentForm
      cardData={cardData}
      onDataChange={setCardData}
      errors={{}}
      setErrors={() => {}}
    />
  );
};

const renderPaymentForm = () => {
  render(<PaymentFormTestWrapper />);
};

describe("Card Payment Form - Unit tests", () => {
  test("renders Card Payment Form", async () => {
    renderPaymentForm();

    expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("1234 1234 1234 1234"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM/YY")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("CVV")).toBeInTheDocument();
  });

  test("types card number with the space in the input", async () => {
    renderPaymentForm();
    const cardNumberInput = screen.getByPlaceholderText(
      "1234 1234 1234 1234",
    ) as HTMLInputElement;
    const user = userEvent.setup();

    await user.type(cardNumberInput, "11111111");

    expect(cardNumberInput).toHaveValue("1111 1111");
  });

  test("types card expiry with /", async () => {
    renderPaymentForm();
    const cardNumberInput = screen.getByPlaceholderText(
      "MM/YY",
    ) as HTMLInputElement;
    const user = userEvent.setup();

    await user.type(cardNumberInput, "0130");

    expect(cardNumberInput).toHaveValue("01/30");
  });

  test("deletes input value if Nan is typed", async () => {
    renderPaymentForm();
    const cardNumberInput = screen.getByPlaceholderText(
      "1234 1234 1234 1234",
    ) as HTMLInputElement;
    const user = userEvent.setup();

    await user.type(cardNumberInput, "s");

    expect(cardNumberInput).toHaveValue("");
  });
});
