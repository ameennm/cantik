import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './FloatingCart.css';

const FloatingCart = () => {
    const location = useLocation();
    const { items, getCartTotal, getCartCount } = useCart();
    const cartCount = getCartCount();
    const cartTotal = getCartTotal();

    // Hide on cart and admin pages
    const hiddenPaths = ['/cart', '/admin'];
    if (hiddenPaths.includes(location.pathname) || cartCount === 0) {
        return null;
    }

    return (
        <Link to="/cart" className="floating-cart">
            <div className="floating-cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="floating-cart-badge">{cartCount}</span>
            </div>
            <div className="floating-cart-info">
                <span className="floating-cart-label">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
                <span className="floating-cart-total">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="floating-cart-items">
                {items.slice(0, 3).map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${idx}`} className="floating-cart-item">
                        <span className="item-name">{item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}</span>
                        <span className="item-size">({item.size})</span>
                    </div>
                ))}
                {items.length > 3 && (
                    <div className="floating-cart-more">+{items.length - 3} more</div>
                )}
            </div>
            <div className="floating-cart-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </Link>
    );
};

export default FloatingCart;
