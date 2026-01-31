import React, {useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {ShoppingCart, Heart, ArrowLeft, Minus, Plus} from 'lucide-react-native';
import {router, useLocalSearchParams} from "expo-router";
import ProductCard from "../../components/ProductCard";

const ProductDetailsPage = () => {
    const params = useLocalSearchParams();
    const [quantity, setQuantity] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Debug logging
    console.log("=== Product Details Page ===");
    console.log("Current product ID:", params.product);
    console.log("From parameter:", params.from);
    console.log("All params:", params);

    // All available products with descriptions
    const allProducts = [
        {
            id: 2,
            name: 'Green Apples',
            brand: 'Fresh Farm',
            price: 120,
            originalPrice: 150,
            discount: 20,
            weight: '4 pcs',
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=200&h=200&fit=crop',
            rating: 4.5,
            reviews: 234,
            delivery: '10 mins',
            description: 'Crisp and refreshing green apples, handpicked from premium orchards. Perfect for snacking, baking, or adding a tangy crunch to your salads. Rich in fiber and antioxidants.',
        },
        {
            id: 3,
            name: 'Fresh Oranges',
            brand: 'Citrus Co',
            price: 80,
            originalPrice: 100,
            discount: 20,
            weight: '6 pcs',
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200&h=200&fit=crop',
            rating: 4.7,
            reviews: 189,
            delivery: '8 mins',
            description: 'Juicy and sweet oranges bursting with vitamin C. Sourced from sun-kissed groves to bring you the freshest citrus experience. Great for fresh juice or healthy snacking.',
        },
        {
            id: 4,
            name: 'Red Grapes',
            brand: 'Valley Fresh',
            price: 95,
            originalPrice: 120,
            discount: 21,
            weight: '500g',
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1571663716920-9fd87840c9ef?w=200&h=200&fit=crop',
            rating: 4.4,
            reviews: 156,
            delivery: '12 mins',
            description: 'Sweet and seedless red grapes, perfect for a healthy snack or dessert. Packed with natural sugars and antioxidants to boost your energy and health.',
        },
        {
            id: 5,
            name: 'Strawberries',
            brand: 'Berry Farm',
            price: 150,
            originalPrice: 180,
            discount: 17,
            weight: '250g',
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
            rating: 4.8,
            reviews: 312,
            delivery: '15 mins',
            description: 'Premium fresh strawberries with vibrant color and sweet flavor. Handpicked at peak ripeness to ensure maximum taste and nutrition. Perfect for desserts, smoothies, or eating fresh.',
        },
        {
            id: 6,
            name: 'Starfruit',
            brand: 'Ignyter Farm',
            price: 400,
            originalPrice: 789,
            discount: 49,
            weight: '250g',
            category: 'fruits',
            image: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/11_exotic_fruits_you_should_try_slideshow/1800ss_getty_rf_star_fruit_carambola.jpg?resize=750px:*&output-quality=75',
            rating: 4.2,
            reviews: 87,
            delivery: '20 mins',
            description: 'Exotic starfruit with a unique sweet-tart flavor and distinctive star shape. Rich in vitamin C and fiber, this tropical treat adds a special touch to fruit salads and garnishes.',
        },
        {
            id: 7,
            name: 'Watermelon',
            brand: 'Berry Farm',
            price: 150,
            originalPrice: 180,
            discount: 17,
            weight: '2 kg',
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
            rating: 4.6,
            reviews: 278,
            delivery: '10 mins',
            description: 'Fresh and juicy watermelon, perfect for hot summer days. Sweet, hydrating, and packed with vitamins A and C. Great for refreshing snacks or making fresh juice.',
        },
        {
            id: 8,
            name: 'Banana',
            brand: 'Unsplash Farm',
            price: 150,
            originalPrice: 180,
            discount: 17,
            weight: '6 pcs',
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=200&h=200&fit=crop',
            rating: 4.5,
            reviews: 445,
            delivery: '8 mins',
            description: 'Fresh yellow bananas, nature\'s perfect snack. Rich in potassium, fiber, and natural energy. Ideal for breakfast, smoothies, or a quick energy boost throughout the day.',
        },
    ];

    // Find the current product based on the ID from params
    const product = allProducts.find(p => p.id === parseInt(params.product)) || allProducts[0];

    // Get similar products (same category, excluding current product)
    const similarProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // Handle back navigation
    const handleBack = () => {
        console.log("=== Back Button Pressed ===");
        console.log("Using router.back() in Stack navigation");
        router.back();
    };

    const addToCart = () => {
        setQuantity(1);
    };

    const increment = () => {
        setQuantity(quantity + 1);
    };

    const decrement = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
                    <ArrowLeft size={24} color="#000"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <ShoppingCart size={24} color="#000"/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={{uri: product.image}} style={styles.productImage}/>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart
                            size={20}
                            color={isFavorite ? '#e74c3c' : '#666'}
                            fill={isFavorite ? '#e74c3c' : 'none'}
                        />
                    </TouchableOpacity>
                    {product.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount}% OFF</Text>
                        </View>
                    )}
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.brandText}>{product.brand}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.weightText}>{product.weight}</Text>

                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>⭐ {product.rating}</Text>
                        <Text style={styles.reviewsText}>({product.reviews} reviews)</Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{product.price}</Text>
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                    </View>

                    <View style={styles.deliveryContainer}>
                        <Text style={styles.deliveryText}>🚀 Delivery in {product.delivery}</Text>
                    </View>

                    {/* Product Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Product Details</Text>
                        <Text style={styles.descriptionText}>{product.description}</Text>
                    </View>
                </View>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <View style={styles.similarSection}>
                        <Text style={styles.similarTitle}>Similar Products</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
                            {similarProducts.map((item) => (
                                <View key={item.id}>
                                    <ProductCard product={item}/>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.bottomPadding}/>
            </ScrollView>

            {/* Bottom Add to Cart */}
            <View style={styles.bottomBar}>
                {quantity === 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={addToCart}>
                        <Text style={styles.addButtonText}>ADD TO CART</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={decrement}>
                            <Minus size={20} color="#fff"/>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={increment}>
                            <Plus size={20} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingVertical: 30,
        position: 'relative',
    },
    productImage: {
        width: 250,
        height: 250,
        borderRadius: 12,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    discountBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#26702A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    productInfo: {
        padding: 20,
    },
    brandText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    weightText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginRight: 8,
    },
    reviewsText: {
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 26,
        fontWeight: '700',
        color: '#000',
        marginRight: 12,
    },
    originalPrice: {
        fontSize: 18,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    deliveryContainer: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    deliveryText: {
        color: '#26702A',
        fontSize: 14,
        fontWeight: '600',
    },
    descriptionContainer: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
    },
    similarSection: {
        paddingTop: 24,
        borderTopWidth: 8,
        borderTopColor: '#f8f8f8',
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    similarScroll: {
        paddingLeft: 20,
    },
    similarCard: {
        width: 160,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    similarImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#f8f8f8',
    },
    similarDiscountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#26702A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    similarDiscountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    similarInfo: {
        padding: 12,
    },
    similarBrand: {
        fontSize: 11,
        color: '#999',
        marginBottom: 4,
    },
    similarName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    similarWeight: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    similarPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    similarPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginRight: 6,
    },
    similarOriginalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    similarAddButton: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#26702A',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    similarAddText: {
        color: '#26702A',
        fontSize: 13,
        fontWeight: '700',
    },
    bottomPadding: {
        height: 100,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    addButton: {
        backgroundColor: '#26702A',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#26702A',
        borderRadius: 12,
        paddingVertical: 12,
    },
    quantityButton: {
        padding: 8,
    },
    quantityText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginHorizontal: 30,
    },
})

export default ProductDetailsPage;