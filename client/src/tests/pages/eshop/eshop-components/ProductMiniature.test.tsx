import ProductMiniature, {
  type ProductMiniatureProps,
} from "@/pages/eshop/eshop-components/ProductMiniature";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("ProductMiniature Component - Unit Tests", () => {
  const props = {
    id: "1",
    title: "Test Coffee",
    price: 12.99,
    image_url: "/test-image.jpg",
    category: "light",
  };
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <ProductMiniature {...(props as ProductMiniatureProps)} />
      </BrowserRouter>,
    );
  };

  test("renders product miniature with correct information", () => {
    renderWithRouter();
    const image = screen.getByAltText("Test Coffee");
    expect(image).toBeInTheDocument();

    expect(image).toHaveAttribute("src", props.image_url);
    const cartImage = screen.getByAltText("Shopping Cart");
    expect(cartImage).toBeInTheDocument();

    expect(screen.getByText("$12.99")).toBeInTheDocument();
    expect(screen.getByText("Light roasted")).toBeInTheDocument();
  });

  test("links to the correct product page", () => {
    const { container } = renderWithRouter();
    const link = container.querySelector("a");
    expect(link).toHaveAttribute(
      "href",
      `/e-shop/products/${props.category}/${props.id}`,
    );
  });
});
