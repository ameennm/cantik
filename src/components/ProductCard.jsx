import { useState } from 'react';
import SizeSelector from './SizeSelector';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const discountPercent = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

    const handleAddToCart = () => {
        setShowSizeModal(true);
    };

    const handleSizeSelect = (size) => {
        onAddToCart(product, size);
        setShowSizeModal(false);
    };

    return (
        <>
            <article className="product-card">
                <div className="product-image-container">
                    {!imageLoaded && <div className="product-image-skeleton skeleton" />}
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`product-image ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Badges */}
                    <div className="product-badges">
                        {product.bestseller && (
                            <span className="badge badge-accent">Bestseller</span>
                        )}
                        {product.newArrival && (
                            <span className="badge badge-primary">New</span>
                        )}
                        {discountPercent > 0 && (
                            <span className="badge badge-success">-{discountPercent}%</span>
                        )}
                    </div>

                    {/* Quick Add Button */}
                    <button
                        className="quick-add-btn"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                    >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>

                <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-pricing">
                        <span className="price">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                            <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </article>

            {/* Size Selection Modal */}
            {showSizeModal && (
                <SizeSelector
                    product={product}
                    sizes={product.sizes}
                    onSelect={handleSizeSelect}
                    onClose={() => setShowSizeModal(false)}
                />
            )}
        </>
    );
};

export default ProductCard;
