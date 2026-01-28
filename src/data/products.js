// Sample products for the boutique
export const sampleProducts = [
    {
        id: 'sample_1',
        name: 'Floral Summer Dress',
        price: 899,
        originalPrice: 1499,
        category: 'Casual',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
        description: 'Beautiful floral print summer dress perfect for casual outings. Made with breathable cotton fabric.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        bestseller: true,
        inStock: true,
        newArrival: false
    },
    {
        id: 'sample_2',
        name: 'Black Cocktail Dress',
        price: 1299,
        originalPrice: 2199,
        category: 'Party Wear',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
        description: 'Elegant black cocktail dress for parties and special occasions. Features a flattering silhouette.',
        sizes: ['S', 'M', 'L', 'XL'],
        bestseller: true,
        inStock: true,
        newArrival: false
    },
    {
        id: 'sample_3',
        name: 'Anarkali Suit Set',
        price: 1599,
        originalPrice: 2999,
        category: 'Ethnic',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
        description: 'Traditional Anarkali suit with intricate embroidery. Complete set includes kurta, palazzo, and dupatta.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        bestseller: true,
        inStock: true,
        newArrival: true
    },
    {
        id: 'sample_4',
        name: 'Denim Shirt Dress',
        price: 799,
        originalPrice: 1299,
        category: 'Western',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80',
        description: 'Trendy denim shirt dress that can be dressed up or down. Perfect for a casual chic look.',
        sizes: ['XS', 'S', 'M', 'L'],
        bestseller: false,
        inStock: true,
        newArrival: true
    },
    {
        id: 'sample_5',
        name: 'Pleated Midi Skirt',
        price: 699,
        originalPrice: 1099,
        category: 'Casual',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aebd?w=500&q=80',
        description: 'Elegant pleated midi skirt in soft fabric. Pairs beautifully with any top.',
        sizes: ['S', 'M', 'L', 'XL'],
        bestseller: false,
        inStock: true,
        newArrival: false
    },
    {
        id: 'sample_6',
        name: 'Sequin Party Gown',
        price: 1999,
        originalPrice: 3499,
        category: 'Party Wear',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80',
        description: 'Stunning sequin gown for special occasions. Make a statement at any party.',
        sizes: ['S', 'M', 'L'],
        bestseller: true,
        inStock: true,
        newArrival: true
    },
    {
        id: 'sample_7',
        name: 'Cotton Kurti Set',
        price: 599,
        originalPrice: 999,
        category: 'Ethnic',
        image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=500&q=80',
        description: 'Comfortable cotton kurti with matching pants. Perfect for daily wear.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        bestseller: false,
        inStock: true,
        newArrival: false
    },
    {
        id: 'sample_8',
        name: 'Blazer Dress',
        price: 1499,
        originalPrice: 2499,
        category: 'Formal',
        image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&q=80',
        description: 'Professional blazer dress perfect for business meetings and formal events.',
        sizes: ['XS', 'S', 'M', 'L'],
        bestseller: false,
        inStock: true,
        newArrival: true
    },
    {
        id: 'sample_9',
        name: 'Off-Shoulder Maxi',
        price: 1099,
        originalPrice: 1799,
        category: 'Casual',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
        description: 'Flowy off-shoulder maxi dress for beach vacations and summer parties.',
        sizes: ['S', 'M', 'L', 'XL'],
        bestseller: true,
        inStock: true,
        newArrival: false
    },
    {
        id: 'sample_10',
        name: 'Velvet Evening Gown',
        price: 2299,
        originalPrice: 3999,
        category: 'Party Wear',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
        description: 'Luxurious velvet evening gown for weddings and formal dinners.',
        sizes: ['S', 'M', 'L'],
        bestseller: false,
        inStock: true,
        newArrival: true
    },
    {
        id: 'sample_11',
        name: 'Printed Wrap Dress',
        price: 849,
        originalPrice: 1399,
        category: 'Western',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
        description: 'Stylish printed wrap dress with adjustable fit. Great for any occasion.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        bestseller: false,
        inStock: true,
        newArrival: false
    },
    {
        id: 'sample_12',
        name: 'Saree with Blouse',
        price: 1899,
        originalPrice: 3299,
        category: 'Ethnic',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
        description: 'Elegant silk saree with designer blouse. Perfect for festivals and weddings.',
        sizes: ['Free Size'],
        bestseller: true,
        inStock: true,
        newArrival: true
    }
];

// Default categories
export const defaultCategories = [
    { id: 'cat_1', name: 'Casual', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&q=80' },
    { id: 'cat_2', name: 'Party Wear', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80' },
    { id: 'cat_3', name: 'Ethnic', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80' },
    { id: 'cat_4', name: 'Western', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80' },
    { id: 'cat_5', name: 'Formal', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=300&q=80' }
];

// WhatsApp number for orders
export const WHATSAPP_NUMBER = '+919605996444';

// Delivery threshold for free shipping
export const FREE_DELIVERY_THRESHOLD = 999;
export const DELIVERY_CHARGE = 49;
