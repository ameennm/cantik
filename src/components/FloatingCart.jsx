import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './FloatingCart.css';

const FloatingCart = () => {
    const { getCartCount, getCartTotal } = useCart();
    const count = getCartCount();
    const total = getCartTotal();

    if (count === 0) return null;

    return (
        <Link to="/cart" className="floating-cart">
            <div className="floating-cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="floating-cart-badge">{count}</span>
            </div>
            <div className="floating-cart-info">
                <span className="floating-cart-label">{count} item{count > 1 ? 's' : ''}</span>
                <span className="floating-cart-total">₹{total.toLocaleString()}</span>
            </div>
            <svg className="floating-cart-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </Link>
    );
};

export default FloatingCart;
