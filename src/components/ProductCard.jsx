import { useState } from 'react';
import { useCart } from '../context/CartContext';
import SizeSelector from './SizeSelector';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { addItem } = useCart();

    const discount = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        setShowSizeModal(true);
    };

    const handleSizeSelect = (size) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            size: size
        });
        setShowSizeModal(false);
    };

    return (
        <>
            <div className="product-card">
                <div className="product-image-wrapper">
                    {!imageLoaded && <div className="product-image-skeleton shimmer"></div>}
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`product-image ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                    {product.bestseller && (
                        <span className="product-badge bestseller">Bestseller</span>
                    )}
                    {product.newArrival && (
                        <span className="product-badge new">New</span>
                    )}
                    {discount > 0 && (
                        <span className="product-badge discount">-{discount}%</span>
                    )}
                </div>

                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price-row">
                        <div className="product-prices">
                            <span className="product-price">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice > product.price && (
                                <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                    >
                        {product.inStock ? (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                Add to Cart
                            </>
                        ) : 'Out of Stock'}
                    </button>
                </div>
            </div>

            {showSizeModal && (
                <SizeSelector
                    product={product}
                    onSelect={handleSizeSelect}
                    onClose={() => setShowSizeModal(false)}
                />
            )}
        </>
    );
};

export default ProductCard;
