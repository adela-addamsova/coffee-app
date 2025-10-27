import ProductMiniature, {
  type ProductMiniatureProps,
} from "@/pages/eshop/eshop-components/ProductMiniature";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import { createTestI18n } from "../../../test-i18n";
import { I18nextProvider } from "react-i18next";

describe("ProductMiniature Component - Unit Tests", () => {
  const props: ProductMiniatureProps = {
    id: "1",
    title: "Test Coffee",
    price: 12.99,
    image_url: "/test-image.jpg",
    category: "light",
    weight: "250",
    stock: 5,
  };

  const renderWithRouter = async () => {
    const i18n = await createTestI18n();

    return render(
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <BrowserRouter>
            <ProductMiniature {...props} />
          </BrowserRouter>
        </CartProvider>
      </I18nextProvider>,
    );
  };

  test("renders product miniature with correct information", async () => {
    await renderWithRouter();

    const image = screen.getByAltText("Test Coffee");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", props.image_url);

    const cartImage = screen.getByAltText("Shopping Cart");
    expect(cartImage).toBeInTheDocument();

    expect(screen.getByText("$12.99")).toBeInTheDocument();
    expect(screen.getByText("Light roasted")).toBeInTheDocument();
  });

  test("links to the correct product page", async () => {
    const { container } = await renderWithRouter();

    const link = container.querySelector("a");
    expect(link).toHaveAttribute(
      "href",
      `/e-shop/products/${props.category}/${props.id}`,
    );
  });
});
