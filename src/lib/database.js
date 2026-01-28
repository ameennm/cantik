import {
    databases,
    storage,
    ID,
    Query,
    DATABASE_ID,
    PRODUCTS_COLLECTION,
    ORDERS_COLLECTION,
    CATEGORIES_COLLECTION,
    STORAGE_BUCKET
} from './appwrite';
import { sampleProducts, defaultCategories } from '../data/products';

// Check if Appwrite is configured
let isAppwriteConnected = false;

export const checkAppwriteConnection = async () => {
    try {
        await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [Query.limit(1)]);
        isAppwriteConnected = true;
        return true;
    } catch (error) {
        console.log('Appwrite not configured, using localStorage fallback');
        isAppwriteConnected = false;
        return false;
    }
};

// ========== PRODUCTS ==========

export const getProducts = async () => {
    try {
        if (!isAppwriteConnected) {
            await checkAppwriteConnection();
        }

        if (isAppwriteConnected) {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PRODUCTS_COLLECTION,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            );
            return response.documents.map(doc => {
                // Parse sizes from JSON string if needed
                let sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                try {
                    if (doc.sizes) {
                        sizes = typeof doc.sizes === 'string' ? JSON.parse(doc.sizes) : doc.sizes;
                    }
                } catch (e) {
                    console.warn('Error parsing sizes:', e);
                }
                return {
                    id: doc.$id,
                    name: doc.name,
                    price: doc.price,
                    originalPrice: doc.originalPrice,
                    category: doc.category,
                    image: doc.image,
                    description: doc.description,
                    sizes: sizes,
                    bestseller: doc.bestseller || false,
                    inStock: doc.inStock !== false,
                    newArrival: doc.newArrival || false
                };
            });
        }
    } catch (error) {
        console.error('Error fetching products from Appwrite:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem('cantik_products');
    if (stored) {
        return JSON.parse(stored);
    }

    // Return sample products
    localStorage.setItem('cantik_products', JSON.stringify(sampleProducts));
    return sampleProducts;
};

export const addProduct = async (product) => {
    const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const productData = {
        name: product.name,
        price: Number(product.price),
        originalPrice: Number(product.originalPrice),
        category: product.category,
        image: product.image,
        description: product.description || '',
        sizes: JSON.stringify(sizes),
        bestseller: product.bestseller || false,
        inStock: product.inStock !== false,
        newArrival: product.newArrival || false
    };

    try {
        if (isAppwriteConnected) {
            const response = await databases.createDocument(
                DATABASE_ID,
                PRODUCTS_COLLECTION,
                ID.unique(),
                productData
            );
            return { id: response.$id, ...productData };
        }
    } catch (error) {
        console.error('Error adding product to Appwrite:', error);
    }

    // Fallback to localStorage
    const products = await getProducts();
    const newProduct = { id: `local_${Date.now()}`, ...productData };
    products.unshift(newProduct);
    localStorage.setItem('cantik_products', JSON.stringify(products));
    return newProduct;
};

export const updateProduct = async (id, product) => {
    const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const productData = {
        name: product.name,
        price: Number(product.price),
        originalPrice: Number(product.originalPrice),
        category: product.category,
        image: product.image,
        description: product.description || '',
        sizes: JSON.stringify(sizes),
        bestseller: product.bestseller || false,
        inStock: product.inStock !== false,
        newArrival: product.newArrival || false
    };

    try {
        if (isAppwriteConnected && !id.startsWith('local_')) {
            await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, id, productData);
            return { id, ...productData };
        }
    } catch (error) {
        console.error('Error updating product in Appwrite:', error);
    }

    // Fallback to localStorage
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { id, ...productData };
        localStorage.setItem('cantik_products', JSON.stringify(products));
    }
    return { id, ...productData };
};

export const deleteProduct = async (id) => {
    try {
        if (isAppwriteConnected && !id.startsWith('local_')) {
            await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION, id);
            return true;
        }
    } catch (error) {
        console.error('Error deleting product from Appwrite:', error);
    }

    // Fallback to localStorage
    const products = await getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('cantik_products', JSON.stringify(filtered));
    return true;
};

// ========== CATEGORIES ==========

export const getCategories = async () => {
    try {
        if (!isAppwriteConnected) {
            await checkAppwriteConnection();
        }

        if (isAppwriteConnected) {
            const response = await databases.listDocuments(
                DATABASE_ID,
                CATEGORIES_COLLECTION,
                [Query.orderAsc('name'), Query.limit(50)]
            );
            return response.documents.map(doc => ({
                id: doc.$id,
                name: doc.name,
                image: doc.image || ''
            }));
        }
    } catch (error) {
        console.error('Error fetching categories from Appwrite:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem('cantik_categories');
    if (stored) {
        return JSON.parse(stored);
    }

    localStorage.setItem('cantik_categories', JSON.stringify(defaultCategories));
    return defaultCategories;
};

export const addCategory = async (category) => {
    const categoryData = {
        name: category.name,
        image: category.image || ''
    };

    try {
        if (isAppwriteConnected) {
            const response = await databases.createDocument(
                DATABASE_ID,
                CATEGORIES_COLLECTION,
                ID.unique(),
                categoryData
            );
            return { id: response.$id, ...categoryData };
        }
    } catch (error) {
        console.error('Error adding category to Appwrite:', error);
    }

    // Fallback to localStorage
    const categories = await getCategories();
    const newCategory = { id: `local_${Date.now()}`, ...categoryData };
    categories.push(newCategory);
    localStorage.setItem('cantik_categories', JSON.stringify(categories));
    return newCategory;
};

export const deleteCategory = async (id) => {
    try {
        if (isAppwriteConnected && !id.startsWith('local_')) {
            await databases.deleteDocument(DATABASE_ID, CATEGORIES_COLLECTION, id);
            return true;
        }
    } catch (error) {
        console.error('Error deleting category from Appwrite:', error);
    }

    // Fallback to localStorage
    const categories = await getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem('cantik_categories', JSON.stringify(filtered));
    return true;
};

// ========== ORDERS ==========

export const getOrders = async () => {
    try {
        if (!isAppwriteConnected) {
            await checkAppwriteConnection();
        }

        if (isAppwriteConnected) {
            const response = await databases.listDocuments(
                DATABASE_ID,
                ORDERS_COLLECTION,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            );
            return response.documents.map(doc => ({
                id: doc.$id,
                items: JSON.parse(doc.items || '[]'),
                total: doc.total,
                status: doc.status,
                createdAt: doc.$createdAt,
                customerPhone: doc.customerPhone || ''
            }));
        }
    } catch (error) {
        console.error('Error fetching orders from Appwrite:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem('cantik_orders');
    return stored ? JSON.parse(stored) : [];
};

export const addOrder = async (order) => {
    const orderData = {
        items: JSON.stringify(order.items),
        total: order.total,
        status: order.status || 'pending',
        customerPhone: order.customerPhone || ''
    };

    try {
        if (isAppwriteConnected) {
            const response = await databases.createDocument(
                DATABASE_ID,
                ORDERS_COLLECTION,
                ID.unique(),
                orderData
            );
            return { id: response.$id, ...order, createdAt: response.$createdAt };
        }
    } catch (error) {
        console.error('Error adding order to Appwrite:', error);
    }

    // Fallback to localStorage
    const orders = await getOrders();
    const newOrder = {
        id: `local_${Date.now()}`,
        ...order,
        createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem('cantik_orders', JSON.stringify(orders));
    return newOrder;
};

export const updateOrderStatus = async (id, status) => {
    try {
        if (isAppwriteConnected && !id.startsWith('local_')) {
            await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION, id, { status });
            return true;
        }
    } catch (error) {
        console.error('Error updating order status in Appwrite:', error);
    }

    // Fallback to localStorage
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem('cantik_orders', JSON.stringify(orders));
    }
    return true;
};

// ========== IMAGE UPLOAD ==========

export const uploadImage = async (file) => {
    console.log('📤 Starting image upload...');
    console.log('   File name:', file.name);
    console.log('   File size:', (file.size / 1024).toFixed(2) + ' KB');
    console.log('   File type:', file.type);
    console.log('   Appwrite connected:', isAppwriteConnected);

    // Check connection first
    if (!isAppwriteConnected) {
        console.log('🔄 Checking Appwrite connection...');
        await checkAppwriteConnection();
        console.log('   Connection result:', isAppwriteConnected);
    }

    try {
        if (isAppwriteConnected) {
            console.log('☁️ Uploading to Appwrite Storage...');
            console.log('   Bucket ID:', STORAGE_BUCKET);

            const response = await storage.createFile(
                STORAGE_BUCKET,
                ID.unique(),
                file
            );

            console.log('✅ File uploaded successfully!');
            console.log('   File ID:', response.$id);

            // Build the file URL manually (Appwrite SDK v15+)
            const endpoint = 'https://sgp.cloud.appwrite.io/v1';
            const projectId = '6979e02200167e338b86';
            const fileUrl = `${endpoint}/storage/buckets/${STORAGE_BUCKET}/files/${response.$id}/view?project=${projectId}`;

            console.log('🔗 File URL:', fileUrl);

            return fileUrl;
        } else {
            console.log('⚠️ Appwrite not connected, using base64 fallback');
        }
    } catch (error) {
        console.error('❌ Error uploading image to Appwrite:');
        console.error('   Error message:', error.message);
        console.error('   Error code:', error.code);
        console.error('   Full error:', error);
        console.log('📝 Falling back to base64 encoding...');
    }

    // Fallback: Convert to base64 for localStorage
    console.log('🔄 Converting image to base64...');
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            console.log('✅ Base64 conversion complete');
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            console.error('❌ Base64 conversion failed:', error);
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};
