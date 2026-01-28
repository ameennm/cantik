import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../lib/database';
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const products = await getProducts();
                const found = products.find(p => p.id === id);
                setProduct(found);
            } catch (error) {
                console.error('Error loading product:', error);
            }
            setLoading(false);
        };
        loadProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addItem(product, selectedSize, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) {
        return (
            <div className="product-page-loading">
                <div className="loading-spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
            </div>
        );
    }

    // Get all images (support for multiple images)
    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image];

    const discount = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/shop">Shop</Link>
                <span>/</span>
                <span>{product.category}</span>
                <span>/</span>
                <span className="current">{product.name}</span>
            </nav>

            <div className="product-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image-wrapper" onClick={() => setShowFullImage(true)}>
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="main-image"
                        />
                        <div className="zoom-hint">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                                <path d="M11 8v6" />
                                <path d="M8 11h6" />
                            </svg>
                            Click to zoom
                        </div>
                        {discount > 0 && (
                            <span className="page-discount-badge">-{discount}%</span>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="thumbnail-strip">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(idx)}
                                >
                                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="product-details">
                    <div className="product-badges">
                        {product.bestseller && <span className="detail-badge bestseller">Bestseller</span>}
                        {product.newArrival && <span className="detail-badge new">New Arrival</span>}
                        {!product.inStock && <span className="detail-badge out-of-stock">Out of Stock</span>}
                    </div>

                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-cat">{product.category}</p>

                    <div className="product-pricing">
                        <span className="current-price">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                            <>
                                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                                <span className="save-badge">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                            </>
                        )}
                    </div>

                    <p className="tax-info">Inclusive of all taxes</p>

                    {/* Size Selection */}
                    <div className="size-section">
                        <div className="size-header">
                            <span className="size-title">Select Size</span>
                            <button className="size-guide-btn">Size Guide</button>
                        </div>
                        <div className="size-options">
                            {(product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map(size => (
                                <button
                                    key={size}
                                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="action-buttons">
                        <button
                            className={`add-cart-btn ${addedToCart ? 'added' : ''}`}
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                        >
                            {addedToCart ? (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Added to Cart!
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </>
                            )}
                        </button>
                        <Link to="/cart" className="view-cart-btn">
                            View Cart
                        </Link>
                    </div>

                    {/* Product Description */}
                    {product.description && (
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>
                    )}

                    {/* Features */}
                    <div className="product-features">
                        <div className="feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                            <span>Free delivery on orders above ₹999</span>
                        </div>
                        <div className="feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            <span>Easy 7-day returns</span>
                        </div>
                        <div className="feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span>100% Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Image Modal */}
            {showFullImage && (
                <div className="fullscreen-modal" onClick={() => setShowFullImage(false)}>
                    <button className="close-fullscreen" onClick={() => setShowFullImage(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="fullscreen-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {images.length > 1 && (
                        <div className="fullscreen-nav">
                            <button
                                className="nav-btn prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <span>{selectedImage + 1} / {images.length}</span>
                            <button
                                className="nav-btn next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductPage;
