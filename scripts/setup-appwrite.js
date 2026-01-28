// Appwrite Setup Script (ES Module)
// Run with: node scripts/setup-appwrite.js

const APPWRITE_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = '6979e02200167e338b86';
const API_KEY = 'standard_9fb6c405a3696181f9d8219833e57d9de1f304e5a17ccd9ccf71ce5cad831bcd5cd400b626aeab1d69754b95b587d3a8c5c08e7be4980c2fcf0503411bc96d5d67a87dbc1eb03c6c5e99aad46e6e539436749e95395b86ea91e1fe0cfb8c9d0ae575973894e95af01592d3180fd2aa302b30dfe0e212ac49ebf89e7111a2d188';

const DATABASE_ID = 'cantik_db';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const CATEGORIES_COLLECTION = 'categories';
const STORAGE_BUCKET = 'product_images';

// Helper function to make API requests using fetch
async function apiRequest(method, path, data = null) {
    const url = APPWRITE_ENDPOINT + path;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY,
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const text = await response.text();

    let parsed;
    try {
        parsed = text ? JSON.parse(text) : {};
    } catch (e) {
        parsed = { raw: text };
    }

    if (!response.ok) {
        const error = new Error(parsed.message || 'Request failed');
        error.code = parsed.code;
        error.status = response.status;
        throw error;
    }

    return parsed;
}

async function createDatabase() {
    console.log('\n📦 Creating database...');
    try {
        const result = await apiRequest('POST', '/databases', {
            databaseId: DATABASE_ID,
            name: 'Cantik Database'
        });
        console.log('✅ Database created:', result.name);
        return result;
    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️ Database already exists, continuing...');
            return { $id: DATABASE_ID };
        }
        throw error;
    }
}

async function createCollection(collectionId, name, attributes) {
    console.log(`\n📋 Creating collection: ${name}...`);
    try {
        const result = await apiRequest('POST', `/databases/${DATABASE_ID}/collections`, {
            collectionId: collectionId,
            name: name,
            permissions: [
                'read("any")',
                'create("any")',
                'update("any")',
                'delete("any")'
            ]
        });
        console.log('✅ Collection created:', result.name);

        // Create attributes
        for (const attr of attributes) {
            await createAttribute(collectionId, attr);
        }

        return result;
    } catch (error) {
        if (error.code === 409) {
            console.log(`⚠️ Collection ${name} already exists, skipping...`);
            return { $id: collectionId };
        }
        throw error;
    }
}

async function createAttribute(collectionId, attr) {
    console.log(`  📝 Creating attribute: ${attr.key}...`);
    try {
        let endpoint = `/databases/${DATABASE_ID}/collections/${collectionId}/attributes`;

        switch (attr.type) {
            case 'string':
                endpoint += '/string';
                await apiRequest('POST', endpoint, {
                    key: attr.key,
                    size: attr.size || 255,
                    required: attr.required || false,
                    default: attr.default || null,
                    array: attr.array || false
                });
                break;
            case 'integer':
                endpoint += '/integer';
                await apiRequest('POST', endpoint, {
                    key: attr.key,
                    required: attr.required || false,
                    min: attr.min,
                    max: attr.max,
                    default: attr.default || null,
                    array: attr.array || false
                });
                break;
            case 'float':
                endpoint += '/float';
                await apiRequest('POST', endpoint, {
                    key: attr.key,
                    required: attr.required || false,
                    min: attr.min,
                    max: attr.max,
                    default: attr.default || null,
                    array: attr.array || false
                });
                break;
            case 'boolean':
                endpoint += '/boolean';
                await apiRequest('POST', endpoint, {
                    key: attr.key,
                    required: attr.required || false,
                    default: attr.default || null,
                    array: attr.array || false
                });
                break;
        }
        console.log(`  ✅ Attribute created: ${attr.key}`);
    } catch (error) {
        if (error.code === 409) {
            console.log(`  ⚠️ Attribute ${attr.key} already exists, skipping...`);
        } else {
            console.log(`  ❌ Error creating ${attr.key}:`, error.message || error);
        }
    }

    // Small delay between attributes to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
}

async function createStorageBucket() {
    console.log('\n🗂️ Creating storage bucket...');
    try {
        const result = await apiRequest('POST', '/storage/buckets', {
            bucketId: STORAGE_BUCKET,
            name: 'Product Images',
            permissions: [
                'read("any")',
                'create("any")',
                'update("any")',
                'delete("any")'
            ],
            fileSecurity: false,
            enabled: true,
            maximumFileSize: 10000000, // 10MB
            allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
        });
        console.log('✅ Storage bucket created:', result.name);
        return result;
    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️ Storage bucket already exists, continuing...');
            return { $id: STORAGE_BUCKET };
        }
        throw error;
    }
}

async function addSampleData() {
    console.log('\n🛍️ Adding sample products...');

    const sampleProducts = [
        {
            name: 'Floral Summer Dress',
            price: 899,
            originalPrice: 1499,
            category: 'Casual',
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
            description: 'Beautiful floral print summer dress perfect for casual outings.',
            sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
            bestseller: true,
            inStock: true,
            newArrival: false
        },
        {
            name: 'Black Cocktail Dress',
            price: 1299,
            originalPrice: 2199,
            category: 'Party Wear',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
            description: 'Elegant black cocktail dress for parties and special occasions.',
            sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
            bestseller: true,
            inStock: true,
            newArrival: false
        },
        {
            name: 'Anarkali Suit Set',
            price: 1599,
            originalPrice: 2999,
            category: 'Ethnic',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
            description: 'Traditional Anarkali suit with intricate embroidery.',
            sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
            bestseller: true,
            inStock: true,
            newArrival: true
        },
        {
            name: 'Denim Shirt Dress',
            price: 799,
            originalPrice: 1299,
            category: 'Western',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80',
            description: 'Trendy denim shirt dress for a casual chic look.',
            sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
            bestseller: false,
            inStock: true,
            newArrival: true
        },
        {
            name: 'Pleated Midi Skirt',
            price: 699,
            originalPrice: 1099,
            category: 'Casual',
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aebd?w=500&q=80',
            description: 'Elegant pleated midi skirt in soft fabric.',
            sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
            bestseller: false,
            inStock: true,
            newArrival: false
        },
        {
            name: 'Sequin Party Gown',
            price: 1999,
            originalPrice: 3499,
            category: 'Party Wear',
            image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80',
            description: 'Stunning sequin gown for special occasions.',
            sizes: JSON.stringify(['S', 'M', 'L']),
            bestseller: true,
            inStock: true,
            newArrival: true
        }
    ];

    for (const product of sampleProducts) {
        try {
            await apiRequest('POST', `/databases/${DATABASE_ID}/collections/${PRODUCTS_COLLECTION}/documents`, {
                documentId: 'unique()',
                data: product
            });
            console.log(`  ✅ Added: ${product.name}`);
        } catch (error) {
            console.log(`  ❌ Error adding ${product.name}:`, error.message || error);
        }
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n📂 Adding sample categories...');
    const categories = ['Casual', 'Party Wear', 'Ethnic', 'Western', 'Formal'];

    for (const cat of categories) {
        try {
            await apiRequest('POST', `/databases/${DATABASE_ID}/collections/${CATEGORIES_COLLECTION}/documents`, {
                documentId: 'unique()',
                data: {
                    name: cat,
                    image: ''
                }
            });
            console.log(`  ✅ Added category: ${cat}`);
        } catch (error) {
            console.log(`  ❌ Error adding ${cat}:`, error.message || error);
        }
        await new Promise(r => setTimeout(r, 300));
    }
}

async function main() {
    console.log('🚀 Starting Appwrite Setup for Cantik...');
    console.log('━'.repeat(50));

    try {
        // Step 1: Create Database
        await createDatabase();

        // Step 2: Create Collections
        await createCollection(PRODUCTS_COLLECTION, 'Products', [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'price', type: 'integer', required: true },
            { key: 'originalPrice', type: 'integer', required: true },
            { key: 'category', type: 'string', size: 100, required: true },
            { key: 'image', type: 'string', size: 2000, required: false },
            { key: 'description', type: 'string', size: 2000, required: false },
            { key: 'sizes', type: 'string', size: 500, required: false },
            { key: 'bestseller', type: 'boolean', required: false },
            { key: 'inStock', type: 'boolean', required: false },
            { key: 'newArrival', type: 'boolean', required: false }
        ]);

        await createCollection(ORDERS_COLLECTION, 'Orders', [
            { key: 'items', type: 'string', size: 10000, required: true },
            { key: 'total', type: 'integer', required: true },
            { key: 'status', type: 'string', size: 50, required: true },
            { key: 'customerPhone', type: 'string', size: 50, required: false }
        ]);

        await createCollection(CATEGORIES_COLLECTION, 'Categories', [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'image', type: 'string', size: 2000, required: false }
        ]);

        // Step 3: Create Storage Bucket
        await createStorageBucket();

        // Wait for attributes to be ready
        console.log('\n⏳ Waiting for attributes to be indexed (30 seconds)...');
        await new Promise(r => setTimeout(r, 30000));

        // Step 4: Add Sample Data
        await addSampleData();

        console.log('\n' + '━'.repeat(50));
        console.log('🎉 Appwrite setup completed successfully!');
        console.log('\n📌 Summary:');
        console.log(`   Database ID: ${DATABASE_ID}`);
        console.log(`   Collections: ${PRODUCTS_COLLECTION}, ${ORDERS_COLLECTION}, ${CATEGORIES_COLLECTION}`);
        console.log(`   Storage Bucket: ${STORAGE_BUCKET}`);
        console.log('\n✨ Your Cantik store is ready!');

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

main();
