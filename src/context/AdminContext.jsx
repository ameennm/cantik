import { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, getCategories, getOrders } from '../lib/database';

const AdminContext = createContext();

const ADMIN_PASSWORD = 'cantik123';

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if admin session exists
        const adminSession = sessionStorage.getItem('cantik_admin');
        if (adminSession === 'true') {
            setIsAuthenticated(true);
        }

        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData, ordersData] = await Promise.all([
                getProducts(),
                getCategories(),
                getOrders()
            ]);

            setProducts(productsData);
            setCategories(categoriesData);
            setOrders(ordersData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const login = (password) => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('cantik_admin', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('cantik_admin');
    };

    const refreshProducts = async () => {
        const productsData = await getProducts();
        setProducts(productsData);
    };

    const refreshCategories = async () => {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
    };

    const refreshOrders = async () => {
        const ordersData = await getOrders();
        setOrders(ordersData);
    };

    return (
        <AdminContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            products,
            categories,
            orders,
            loading,
            refreshProducts,
            refreshCategories,
            refreshOrders,
            loadData
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
