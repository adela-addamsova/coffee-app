export default function ProductMiniature({ title, price, image_url, category }) {
    const categoryLabels = {
        light: 'Light roasted',
        dark: 'Dark roasted',
        decaf: 'Decaf'
    };

    return (
        <div className="eshop-product-miniature">
            <div className="product-image">
                <img src={image_url} alt={title} />
            </div>
            <div className="product-info">
                <h3 className="product-title">{title}</h3>
                <p className="product-description font-light">{categoryLabels[category] || category}</p>
                <p className="product-price">${price.toFixed(2)}</p>
            </div>
        </div>
    );
}