import PackageImg from '../../../assets/e-shop/product-packages/package.png';

export default function ProductMiniature() {
    return (
        <div className="eshop-product-miniature">
            <div className="product-image">
                <img src={PackageImg} alt="Product Package" />
            </div>
            <div className="product-info">
                <h3 className="product-title">Columbia</h3>
                <p className="product-description">Light roasted</p>
                <p className="product-price">$15.00</p>
            </div>
        </div>
    );
}