import { useEffect, useState } from 'react';
import ProductMiniature from '../../eshop-components/ProductMiniature';

export default function LandingPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products/latest')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching latest products:', err));
    }, []);

    return (
        <section className="latest-products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductMiniature
                    key={product.id}
                    title={product.title}
                    category={product.category}
                    price={product.price}
                    image_url={product.image_url}
                />
            ))}
        </section>
    );
}
