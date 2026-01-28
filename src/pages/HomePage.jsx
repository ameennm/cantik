import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './HomePage.css';

const HomePage = () => {
    const { products, categories, loading } = useAdmin();
    const { addItem } = useCart();
    const [activeProducts, setActiveProducts] = useState([]);

    useEffect(() => {
        setActiveProducts(products.filter(p => p.inStock));
    }, [products]);

    const bestsellers = activeProducts.filter(p => p.bestseller).slice(0, 4);
    const newArrivals = activeProducts.filter(p => p.newArrival).slice(0, 4);
    const featuredCategories = categories.slice(0, 3);

    const handleAddToCart = (product, size) => {
        addItem(product, size);
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80"
                        alt="Hero"
                        className="hero-image"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content container">
                    <p className="hero-subtitle animate-fadeIn">Welcome to Cantik</p>
                    <h1 className="hero-title">
                        Where <span className="italic text-primary">Style</span><br />
                        Meets <span className="italic">Confidence</span>
                    </h1>
                    <p className="hero-description animate-fadeIn">
                        Discover beautiful women's dresses crafted with love and elegance.
                    </p>
                    <Link to="/shop" className="btn btn-primary btn-lg">
                        Shop Now
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Categories</h2>
                        <Link to="/shop" className="see-all-link">
                            View All
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {featuredCategories.map((category, index) => (
                            <Link
                                key={category.id}
                                to={`/shop?category=${category.name}`}
                                className="category-card"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <h3 className="category-name">{category.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="section new-arrivals-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>New Arrivals</h2>
                            <Link to="/shop?filter=new" className="see-all-link">
                                See All New
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Link>
                        </div>
                        <div className="products-grid">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="product-skeleton">
                                        <div className="skeleton" style={{ aspectRatio: '3/4' }}></div>
                                        <div className="skeleton" style={{ height: '20px', marginTop: '12px' }}></div>
                                        <div className="skeleton" style={{ height: '16px', marginTop: '8px', width: '60%' }}></div>
                                    </div>
                                ))
                            ) : (
                                newArrivals.map((product, index) => (
                                    <div key={product.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fadeIn">
                                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
                <section className="section bestsellers-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Best Sellers</h2>
                            <Link to="/shop?filter=bestseller" className="see-all-link">
                                Shop Bestsellers
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Link>
                        </div>
                        <div className="products-grid">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="product-skeleton">
                                        <div className="skeleton" style={{ aspectRatio: '3/4' }}></div>
                                        <div className="skeleton" style={{ height: '20px', marginTop: '12px' }}></div>
                                        <div className="skeleton" style={{ height: '16px', marginTop: '8px', width: '60%' }}></div>
                                    </div>
                                ))
                            ) : (
                                bestsellers.map((product, index) => (
                                    <div key={product.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fadeIn">
                                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Cantik */}
            <section className="section why-section">
                <div className="container">
                    <h2 className="text-center">Why Cantik?</h2>
                    <div className="why-grid">
                        <div className="why-card">
                            <div className="why-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <h3>Premium Quality</h3>
                            <p>Every piece is crafted with the finest fabrics and meticulous attention to detail.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <h3>Trendy Designs</h3>
                            <p>Stay ahead of fashion with our curated collection of latest styles and trends.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                                </svg>
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Quick and reliable shipping to get your favorite pieces to you in no time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2>Ready to Find Your Perfect Look?</h2>
                            <p>Explore our complete collection and discover dresses that make you feel beautiful.</p>
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                Explore Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
