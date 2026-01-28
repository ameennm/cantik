import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER, FREE_DELIVERY_THRESHOLD, DELIVERY_CHARGE } from '../data/products';
import './CartPage.css';

const CartPage = () => {
    const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();
    const subtotal = getCartTotal();
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryCharge = isFreeDelivery ? 0 : DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    const handleQuantityChange = (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity >= 1) {
            updateQuantity(item.id, item.size, newQuantity);
        }
    };

    const formatOrderMessage = () => {
        let message = "🛍️ *New Order from Cantik*\n\n";
        message += "*Order Details:*\n";
        message += "─────────────────\n";

        items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Size: ${item.size}\n`;
            message += `   Qty: ${item.quantity}\n`;
            message += `   Price: ₹${(item.price * item.quantity).toLocaleString()}\n\n`;
        });

        message += "─────────────────\n";
        message += `*Subtotal:* ₹${subtotal.toLocaleString()}\n`;
        message += `*Delivery:* ${isFreeDelivery ? 'FREE ✨' : `₹${deliveryCharge}`}\n`;
        message += `*Total:* ₹${total.toLocaleString()}\n\n`;
        message += "Please confirm my order. Thank you! 🙏";

        return encodeURIComponent(message);
    };

    const handlePlaceOrder = () => {
        const message = formatOrderMessage();
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <a href="/shop" className="btn btn-primary">
                            Start Shopping
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p className="cart-count">{items.length} item{items.length > 1 ? 's' : ''}</p>
                </div>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="cart-item">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <div className="cart-item-header">
                                        <div>
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-size">Size: {item.size}</p>
                                        </div>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => removeItem(item.id, item.size)}
                                            aria-label="Remove item"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="cart-item-footer">
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item, 1)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="cart-item-price">
                                            <span className="price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            {item.originalPrice > item.price && (
                                                <span className="price-original">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <div className="summary-card">
                            <h3>Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <span className={isFreeDelivery ? 'free-delivery' : ''}>
                                    {isFreeDelivery ? 'FREE' : `₹${deliveryCharge}`}
                                </span>
                            </div>

                            {!isFreeDelivery && (
                                <div className="free-delivery-note">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4" />
                                        <path d="M12 8h.01" />
                                    </svg>
                                    Add ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} more for free delivery
                                </div>
                            )}

                            <div className="summary-divider"></div>

                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>

                            <button
                                className="btn btn-primary btn-lg place-order-btn"
                                onClick={handlePlaceOrder}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Place Order on WhatsApp
                            </button>

                            <p className="order-note">
                                You'll be redirected to WhatsApp to complete your order.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Clear Cart */}
                <div className="cart-actions">
                    <button
                        className="btn btn-ghost clear-cart-btn"
                        onClick={clearCart}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Clear Cart
                    </button>
                </div>
            </div>

            {/* Mobile Place Order Button */}
            <div className="mobile-order-bar">
                <div className="mobile-order-info">
                    <span className="mobile-order-label">Total</span>
                    <span className="mobile-order-total">₹{total.toLocaleString()}</span>
                </div>
                <button
                    className="btn btn-primary mobile-order-btn"
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default CartPage;
