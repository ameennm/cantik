import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingCart from './components/FloatingCart'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import { client } from './lib/appwrite'

function App() {
    const location = useLocation()
    const isCartPage = location.pathname === '/cart'
    const isAdminPage = location.pathname === '/admin'

    useEffect(() => {
        // Ping Appwrite to verify connection
        client.ping().then(() => {
            console.log('✅ Appwrite connection successful')
        }).catch((error) => {
            console.log('⚠️ Appwrite connection failed, using localStorage fallback', error)
        })
    }, [])

    return (
        <div className="app">
            {!isAdminPage && <Header />}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </main>
            {!isAdminPage && <Footer />}
            {!isCartPage && !isAdminPage && <FloatingCart />}
        </div>
    )
}

export default App
