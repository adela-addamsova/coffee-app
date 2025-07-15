import { useEffect, useState } from 'react';
import ProductMiniature from '../../eshop-components/ProductMiniature';

export default function LandingPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/products/latest`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching latest products:', err));
    }, []);

    return (
        <section className="latest-products">
            {products.map((product) => (
                <ProductMiniature
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    category={product.category}
                    price={product.price}
                    image_url={product.image_url}
                />
            ))}
        </section>
    );
}
