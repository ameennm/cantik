// Update Appwrite Storage Bucket Permissions
// Run with: node scripts/update-bucket-permissions.js

const APPWRITE_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = '6979e02200167e338b86';
const API_KEY = 'standard_9fb6c405a3696181f9d8219833e57d9de1f304e5a17ccd9ccf71ce5cad831bcd5cd400b626aeab1d69754b95b587d3a8c5c08e7be4980c2fcf0503411bc96d5d67a87dbc1eb03c6c5e99aad46e6e539436749e95395b86ea91e1fe0cfb8c9d0ae575973894e95af01592d3180fd2aa302b30dfe0e212ac49ebf89e7111a2d188';

const STORAGE_BUCKET = 'product_images';

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

async function main() {
    console.log('🔐 Updating Storage Bucket Permissions...\n');

    try {
        // First, get current bucket info
        console.log('📦 Fetching current bucket info...');
        const bucket = await apiRequest('GET', `/storage/buckets/${STORAGE_BUCKET}`);
        console.log('   Current bucket:', bucket.name);
        console.log('   Current permissions:', bucket.permissions);

        // Update bucket with full permissions
        console.log('\n📝 Updating bucket permissions...');
        const updatedBucket = await apiRequest('PUT', `/storage/buckets/${STORAGE_BUCKET}`, {
            name: 'Product Images',
            permissions: [
                'read("any")',
                'create("any")',
                'update("any")',
                'delete("any")'
            ],
            fileSecurity: false,  // Important: This allows bucket-level permissions instead of file-level
            enabled: true,
            maximumFileSize: 10000000, // 10MB
            allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            compression: 'none',
            encryption: false,
            antivirus: false
        });

        console.log('✅ Bucket updated successfully!');
        console.log('   New permissions:', updatedBucket.permissions);
        console.log('   File security:', updatedBucket.fileSecurity ? 'Enabled (per-file)' : 'Disabled (bucket-level)');
        console.log('   Max file size:', (updatedBucket.maximumFileSize / 1000000) + 'MB');
        console.log('   Allowed extensions:', updatedBucket.allowedFileExtensions.join(', '));

        console.log('\n🎉 Image uploads should now work without any authentication required!');

    } catch (error) {
        if (error.code === 404) {
            console.log('❌ Bucket not found. Creating new bucket...');

            try {
                const newBucket = await apiRequest('POST', '/storage/buckets', {
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
                    maximumFileSize: 10000000,
                    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
                });
                console.log('✅ New bucket created:', newBucket.name);
                console.log('   Permissions:', newBucket.permissions);
            } catch (createError) {
                console.error('❌ Failed to create bucket:', createError.message);
            }
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

main();
