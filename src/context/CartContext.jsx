import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(
                item => item.id === action.payload.id && item.size === action.payload.size
            );

            if (existingIndex > -1) {
                const newItems = [...state.items];
                newItems[existingIndex].quantity += action.payload.quantity || 1;
                return { ...state, items: newItems };
            }

            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
            };
        }

        case 'REMOVE_ITEM': {
            return {
                ...state,
                items: state.items.filter(
                    item => !(item.id === action.payload.id && item.size === action.payload.size)
                )
            };
        }

        case 'UPDATE_QUANTITY': {
            const newItems = state.items.map(item => {
                if (item.id === action.payload.id && item.size === action.payload.size) {
                    return { ...item, quantity: action.payload.quantity };
                }
                return item;
            }).filter(item => item.quantity > 0);

            return { ...state, items: newItems };
        }

        case 'CLEAR_CART': {
            return { ...state, items: [] };
        }

        case 'LOAD_CART': {
            return { ...state, items: action.payload };
        }

        default:
            return state;
    }
};

const initialState = {
    items: []
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cantik_cart');
        if (savedCart) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('cantik_cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product, size, quantity = 1) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: { ...product, size, quantity }
        });
    };

    const removeItem = (id, size) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
    };

    const updateQuantity = (id, size, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return state.items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            items: state.items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
