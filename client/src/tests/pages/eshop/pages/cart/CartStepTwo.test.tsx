import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CartStepTwo from "@eshop/pages/cart/CartStepTwo";
import { createTestI18n } from "@/tests/test-i18n";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockUseCart = vi.fn();
vi.mock("@eshop/pages/cart/CartContext", () => ({
  useCart: () => mockUseCart(),
}));

vi.mock("@config/NavItems", () => ({
  eshopNavItems: [
    { label: "data.eshop-nav-items.cart", to: "/cart" },
    { label: "data.eshop-nav-items.payment", to: "/payment" },
  ],
}));

const defaultDeliveryData = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  zipCode: "",
};

const renderCartStepTwo = async (overrides = {}) => {
  const i18n = await createTestI18n();
  const setDeliveryData = vi.fn();
  const setDeliveryErrors = vi.fn();
  const setShippingFee = vi.fn();
  const setShippingMethod = vi.fn();

  mockUseCart.mockReturnValue({
    cart: [{ id: 1, title: "Coffee", price: 10, quantity: 1 }],
    deliveryData: defaultDeliveryData,
    deliveryErrors: {},
    setDeliveryData,
    setDeliveryErrors,
    setShippingFee,
    setShippingMethod,
    ...overrides,
  });

  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <CartStepTwo />
      </I18nextProvider>
    </MemoryRouter>,
  );

  return {
    i18n,
    setDeliveryData,
    setDeliveryErrors,
    setShippingFee,
    setShippingMethod,
  };
};

describe("CartStepTwo - Integration Tests", () => {
  test("renders delivery form", async () => {
    await renderCartStepTwo();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
  });

  test("renders shipment picker", async () => {
    await renderCartStepTwo();
    expect(screen.getByLabelText("Free Standard")).toBeInTheDocument();
    expect(screen.getByLabelText("$5.00 Express")).toBeInTheDocument();
  });

  test("validates delivery data and sets errors on invalid submit", async () => {
    const { i18n, setDeliveryErrors } = await renderCartStepTwo({
      deliveryData: {
        name: "oneword",
        email: "not-an-email",
        phone: "111",
        street: "Main",
        city: "",
        zipCode: "",
      },
    });

    await userEvent.click(screen.getByText("NEXT"));

    expect(setDeliveryErrors).toHaveBeenCalled();
    const errorPayload = setDeliveryErrors.mock.calls[0][0];
    expect(errorPayload).toMatchObject({
      name: { message: i18n.t("errors.name-required") },
      email: { message: i18n.t("errors.invalid-email") },
      phone: { message: i18n.t("errors.invalid-phone") },
      street: { message: i18n.t("errors.invalid-address") },
      city: { message: i18n.t("errors.city-required") },
      zipCode: { message: i18n.t("errors.zip-required") },
    });
  });

  test("shows error for invalid name and clears it after typing", async () => {
    const { i18n, setDeliveryErrors } = await renderCartStepTwo();

    await userEvent.type(screen.getByLabelText("Name"), "Jane");
    await userEvent.click(screen.getByText(i18n.t("eshop-cart.btn-next")));

    let errorCall;

    for (const call of setDeliveryErrors.mock.calls) {
      const [arg] = call;

      const isObject = typeof arg === "object" && arg !== null;
      const hasNameError =
        isObject && arg.name?.message === i18n.t("errors.name-required");

      if (hasNameError) {
        errorCall = call;
        break;
      }
    }

    expect(errorCall).toBeDefined();

    await userEvent.type(screen.getByLabelText("Name"), " Doe");

    let clearCall;

    const allCalls = setDeliveryErrors.mock.calls;
    const reversedCalls = [...allCalls].reverse();

    for (const call of reversedCalls) {
      const [firstArg] = call;

      const isFunction = typeof firstArg === "function";

      if (isFunction) {
        clearCall = call;
        break;
      }
    }

    expect(clearCall).toBeDefined();

    const clearFn = clearCall![0] as (
      prev: Record<string, { message: string } | undefined>,
    ) => Record<string, { message: string } | undefined>;

    const cleared = clearFn({ name: { message: "some error" } });
    expect(cleared).toMatchObject({ name: undefined });
  });

  test("clears name error immediately when user starts typing", async () => {
    const { i18n, setDeliveryErrors } = await renderCartStepTwo();

    await userEvent.type(screen.getByLabelText("Name"), "Jane");
    await userEvent.click(screen.getByText(i18n.t("eshop-cart.btn-next")));

    expect(setDeliveryErrors).toHaveBeenCalledWith(
      expect.objectContaining({
        name: { message: i18n.t("errors.name-required") },
      }),
    );

    setDeliveryErrors.mockClear();
    await userEvent.type(screen.getByLabelText("Name"), " ");

    const clearCall = [...setDeliveryErrors.mock.calls].find(
      ([arg]) => typeof arg === "function",
    );
    expect(clearCall).toBeDefined();

    const clearFn = clearCall![0] as (
      prev: Record<string, { message: string } | undefined>,
    ) => Record<string, { message: string } | undefined>;

    const cleared = clearFn({ name: { message: "some error" } });
    expect(cleared).toMatchObject({ name: undefined });
  });
});
