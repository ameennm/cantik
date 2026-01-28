import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateOrderStatus,
    uploadImage
} from '../lib/database';
import './AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        login,
        logout,
        products,
        categories,
        orders,
        loading,
        refreshProducts,
        refreshCategories,
        refreshOrders
    } = useAdmin();

    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'success', 'error'
    const fileInputRef = useRef(null);

    // Form state
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        description: '',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        bestseller: false,
        inStock: true,
        newArrival: false,
        image: ''
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        image: ''
    });

    const handleLogin = (e) => {
        e.preventDefault();
        const success = login(password);
        if (!success) {
            setLoginError('Incorrect password');
            setPassword('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const resetProductForm = () => {
        setProductForm({
            name: '',
            price: '',
            originalPrice: '',
            category: '',
            description: '',
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            bestseller: false,
            inStock: true,
            newArrival: false,
            image: ''
        });
        setImagePreview('');
        setEditingProduct(null);
    };

    const handleEditProduct = (product) => {
        setProductForm({
            name: product.name,
            price: product.price.toString(),
            originalPrice: product.originalPrice.toString(),
            category: product.category,
            description: product.description || '',
            sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            bestseller: product.bestseller || false,
            inStock: product.inStock !== false,
            newArrival: product.newArrival || false,
            image: product.image
        });
        setImagePreview(product.image);
        setEditingProduct(product);
        setShowProductModal(true);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.log('❌ No file selected');
            return;
        }

        console.log('🖼️ Image selected:', file.name, file.size, file.type);
        setUploadStatus('uploading');

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('✅ Preview loaded');
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload to Appwrite
        try {
            console.log('📤 Starting upload to Appwrite...');
            const imageUrl = await uploadImage(file);
            console.log('✅ Upload successful! URL:', imageUrl);
            setProductForm(prev => ({ ...prev, image: imageUrl }));
            setUploadStatus('success');
        } catch (error) {
            console.error('❌ Image upload error:', error);
            setUploadStatus('error');
            // Still keep the base64 preview as fallback
            setProductForm(prev => ({ ...prev, image: imagePreview }));
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productForm);
            } else {
                await addProduct(productForm);
            }
            await refreshProducts();
            setShowProductModal(false);
            resetProductForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }

        setIsSubmitting(false);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            await refreshProducts();
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addCategory(categoryForm);
            await refreshCategories();
            setShowCategoryModal(false);
            setCategoryForm({ name: '', image: '' });
        } catch (error) {
            console.error('Error adding category:', error);
        }

        setIsSubmitting(false);
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await deleteCategory(id);
            await refreshCategories();
        }
    };

    const handleOrderStatusChange = async (orderId, status) => {
        await updateOrderStatus(orderId, status);
        await refreshOrders();
    };

    const toggleSize = (size) => {
        setProductForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <div className="login-card">
                    <div className="login-header">
                        <img src="/logo.jpeg" alt="Cantik" className="login-logo" />
                        <h1>Admin Panel</h1>
                        <p>Enter password to continue</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                            {loginError && <p className="error-text">{loginError}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            Login
                        </button>
                    </form>
                    <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>
                        ← Back to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.jpeg" alt="Cantik" className="sidebar-logo" />
                    <h2>Cantik Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Products
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        Orders
                        {orders.filter(o => o.status === 'pending').length > 0 && (
                            <span className="nav-badge">{orders.filter(o => o.status === 'pending').length}</span>
                        )}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Categories
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h1>Products</h1>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    resetProductForm();
                                    setShowProductModal(true);
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add Product
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading-state">Loading products...</div>
                        ) : (
                            <div className="products-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>
                                                    <img src={product.image} alt={product.name} className="table-image" />
                                                </td>
                                                <td>
                                                    <div className="product-name-cell">
                                                        {product.name}
                                                        {product.bestseller && <span className="badge badge-accent">Bestseller</span>}
                                                        {product.newArrival && <span className="badge badge-primary">New</span>}
                                                    </div>
                                                </td>
                                                <td>{product.category}</td>
                                                <td>
                                                    <div className="price-cell">
                                                        <span className="price">₹{product.price}</span>
                                                        <span className="price-original">₹{product.originalPrice}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${product.inStock ? 'badge-success' : 'badge-error'}`}>
                                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={() => handleEditProduct(product)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-ghost btn-sm delete-btn"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h1>Orders</h1>
                            <button className="btn btn-secondary" onClick={refreshOrders}>
                                Refresh
                            </button>
                        </div>

                        {orders.length === 0 ? (
                            <div className="empty-state">
                                <p>No orders yet</p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <span className="order-id">Order #{order.id.slice(-6)}</span>
                                                <span className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <select
                                                className="status-select"
                                                value={order.status}
                                                onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="order-items">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="order-item">
                                                    <span>{item.name} ({item.size})</span>
                                                    <span>×{item.quantity}</span>
                                                    <span>₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-footer">
                                            <span className="order-total">Total: ₹{order.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h1>Categories</h1>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCategoryModal(true)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add Category
                            </button>
                        </div>

                        <div className="categories-grid">
                            {categories.map(category => (
                                <div key={category.id} className="category-admin-card">
                                    {category.image && (
                                        <img src={category.image} alt={category.name} className="category-admin-image" />
                                    )}
                                    <div className="category-admin-info">
                                        <h3>{category.name}</h3>
                                        <button
                                            className="btn btn-ghost btn-sm delete-btn"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {showProductModal && (
                <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
                    <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button className="modal-close" onClick={() => setShowProductModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit}>
                            <div className="modal-body">
                                {/* Image Upload */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Product Image
                                        {uploadStatus === 'uploading' && <span style={{ color: '#D4AF37', marginLeft: '8px' }}>⏳ Uploading...</span>}
                                        {uploadStatus === 'success' && <span style={{ color: '#4CAF50', marginLeft: '8px' }}>✅ Uploaded!</span>}
                                        {uploadStatus === 'error' && <span style={{ color: '#E57373', marginLeft: '8px' }}>❌ Upload failed (using preview)</span>}
                                    </label>
                                    <div
                                        className={`image-upload-area ${uploadStatus === 'uploading' ? 'uploading' : ''}`}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="image-preview" />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <span>Click to upload image</span>
                                            </div>
                                        )}
                                        {uploadStatus === 'uploading' && (
                                            <div className="upload-overlay">
                                                <div className="upload-spinner"></div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Product Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={productForm.name}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select
                                            className="form-input"
                                            value={productForm.category}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Price (₹) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Original Price (₹) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={productForm.originalPrice}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        value={productForm.description}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Available Sizes</label>
                                    <div className="size-checkboxes">
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                            <label key={size} className="size-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={productForm.sizes.includes(size)}
                                                    onChange={() => toggleSize(size)}
                                                />
                                                <span>{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Options</label>
                                    <div className="toggle-options">
                                        <label className="toggle-option">
                                            <input
                                                type="checkbox"
                                                checked={productForm.inStock}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                                            />
                                            <span>In Stock</span>
                                        </label>
                                        <label className="toggle-option">
                                            <input
                                                type="checkbox"
                                                checked={productForm.bestseller}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, bestseller: e.target.checked }))}
                                            />
                                            <span>Bestseller</span>
                                        </label>
                                        <label className="toggle-option">
                                            <input
                                                type="checkbox"
                                                checked={productForm.newArrival}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, newArrival: e.target.checked }))}
                                            />
                                            <span>New Arrival</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
                    <div className="modal-content admin-modal small-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Category</h3>
                            <button className="modal-close" onClick={() => setShowCategoryModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Category Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL (optional)</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://..."
                                        value={categoryForm.image}
                                        onChange={(e) => setCategoryForm(prev => ({ ...prev, image: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
