import { useState } from 'react';
import './SizeSelector.css';

const SizeSelector = ({ product, sizes, onSelect, onClose }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    const handleConfirm = () => {
        if (selectedSize) {
            onSelect(selectedSize);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="size-modal modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Select Size</h3>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Product Preview */}
                    <div className="size-product-preview">
                        <img src={product.image} alt={product.name} className="preview-image" />
                        <div className="preview-info">
                            <h4 className="preview-name">{product.name}</h4>
                            <div className="preview-price">
                                <span className="price">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice > product.price && (
                                    <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Size Options */}
                    <div className="size-options">
                        <p className="size-label">Choose your size:</p>
                        <div className="size-grid">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Guide Link */}
                    <p className="size-guide-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        Need help? Check our size guide
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={!selectedSize}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SizeSelector;
