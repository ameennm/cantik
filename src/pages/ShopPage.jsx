import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './ShopPage.css';

const ShopPage = () => {
    const [searchParams] = useSearchParams();
    const { products, categories, loading } = useAdmin();
    const { addItem } = useCart();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const filterParam = searchParams.get('filter');

        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }

        let filtered = [...products].filter(p => p.inStock);

        // Apply category filter
        if (categoryParam && categoryParam !== 'All') {
            filtered = filtered.filter(p => p.category === categoryParam);
        } else if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Apply special filters
        if (filterParam === 'new') {
            filtered = filtered.filter(p => p.newArrival);
        } else if (filterParam === 'bestseller') {
            filtered = filtered.filter(p => p.bestseller);
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                // Keep original order (newest first)
                break;
        }

        setFilteredProducts(filtered);
    }, [products, selectedCategory, sortBy, searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setShowFilters(false);
    };

    const handleAddToCart = (product, size) => {
        addItem(product, size);
    };

    const allCategories = ['All', ...categories.map(c => c.name)];

    return (
        <div className="shop-page">
            <div className="container">
                {/* Page Header */}
                <div className="shop-header">
                    <h1>Shop All Dresses</h1>
                    <p className="shop-subtitle">
                        Discover your perfect style from our curated collection
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-left">
                        <button
                            className="filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="4" y1="21" x2="4" y2="14" />
                                <line x1="4" y1="10" x2="4" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12" y2="3" />
                                <line x1="20" y1="21" x2="20" y2="16" />
                                <line x1="20" y1="12" x2="20" y2="3" />
                                <line x1="1" y1="14" x2="7" y2="14" />
                                <line x1="9" y1="8" x2="15" y2="8" />
                                <line x1="17" y1="16" x2="23" y2="16" />
                            </svg>
                            Filters
                        </button>
                        <span className="product-count">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="filter-right">
                        <label className="sort-label">Sort by:</label>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills (Desktop) */}
                <div className={`category-pills ${showFilters ? 'show' : ''}`}>
                    {allCategories.map(category => (
                        <button
                            key={category}
                            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Mobile Filters Panel */}
                {showFilters && (
                    <div className="mobile-filters">
                        <h3>Categories</h3>
                        <div className="mobile-filter-options">
                            {allCategories.map(category => (
                                <button
                                    key={category}
                                    className={`mobile-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="shop-products-grid">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="product-skeleton">
                                <div className="skeleton" style={{ aspectRatio: '3/4' }}></div>
                                <div className="skeleton" style={{ height: '20px', marginTop: '12px' }}></div>
                                <div className="skeleton" style={{ height: '16px', marginTop: '8px', width: '60%' }}></div>
                            </div>
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="animate-fadeIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProductCard product={product} onAddToCart={handleAddToCart} />
                            </div>
                        ))
                    ) : (
                        <div className="no-products">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                                <path d="M8 11h6" />
                            </svg>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or check back later for new arrivals.</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedCategory('All')}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
