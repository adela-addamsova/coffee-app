import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InlineMenu from '../eshop-components/InlineMenu';
import HeroSection from '../../../components/HeroSection';
import HeroImg from '../../../assets/e-shop/category-hero.jpg';
import MainButton from '../../../components/MainButton';
import Newsletter from '../eshop-components/Newsletter';
import ProductCounter from '../eshop-components/ProductCounter';
import DeliveryIcon from '../../../assets/e-shop/eshop-components/delivery.svg'
import StockIcon from '../../../assets/e-shop/eshop-components/stock.svg'

export default function ProductPageLayout() {
    const { category, id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = `${import.meta.env.VITE_API_URL}/products/${category}/${id}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Product not found');
                }
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setError(null);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setError('Product not found');
            });
    }, [category, id]);

    if (error) {
        return (
            <div className='subpage-error'>
                <p className='pt-[100px]'>{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className='subpage-error'>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero section */}
            <div className="product-page-hero">
                <HeroSection
                    imgSrc={HeroImg}
                    heading={false}
                    subheading={false}
                    buttonText={false}
                    buttonHref={false}
                />
            </div>

            {/* Inline Menu */}
            <InlineMenu />

            {/* Product Detail */}
            <section className="product-container">
                <div className='product-detail'>
                    <div className='product-img hidden lg:block'>
                        <img src={product.image_url} alt="Product Image" />
                    </div>
                    <div className="product-description">
                        <h3>{product.title}</h3>
                        <div className='product-img block lg:hidden pb-10 pt-4'>
                            <img src={product.image_url} alt="Product Image" />
                        </div>
                        <h4>$ {product.price}</h4>
                        <ProductCounter min={1} max={product.stock} />
                        <div className='product-info-text'>
                            <p>{product.ingredients}</p>
                            <p>{product.weight}</p>
                            <p>Origin: {product.origin}</p>
                            <p>Taste profile: {product.taste_profile}</p>
                        </div>
                        <div className='product-delivery-info'>
                            <div className='product-delivery-info-box'>
                                <div>
                                    <img src={DeliveryIcon} alt="Delivery Icon" />
                                </div>
                                <div className='product-delivery-info-text'>
                                    <p className='font-light text-[#6C6C6C]'>Free Delivery</p>
                                    <p>1–2 days</p>
                                </div>
                            </div>
                            <div className='product-delivery-info-box'>
                                <div>
                                    <img src={StockIcon} alt="Delivery Icon" />
                                </div>
                                <div className='product-delivery-info-text'>
                                    <p className='font-light text-[#6C6C6C]'>In Stock</p>
                                    <p>{product.stock} pcs</p>
                                </div>
                            </div>
                        </div>
                        <MainButton text="ADD TO CART" color="black" />
                    </div>
                </div>
                {/* <div className='full-description'>
            <p>{product.full_description}</p>
        </div> */}
            </section>

            <Newsletter />
        </div>
    );
}
