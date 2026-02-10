import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus } from 'lucide-react-native';
import { router, useLocalSearchParams } from "expo-router";
import ProductCard from "../../components/ProductCard";
import { products } from "../../utilities/products";
import { useCartStore } from "../../store/cartStore";

const ProductDetailsPage = () => {
    const params = useLocalSearchParams();
    const [cardWidth, setCardWidth] = useState(0);

    const product = products.find(
        p => p.id === Number(params.product)
    ) || products[0];

    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
    const [isFavorite, setIsFavorite] = useState(false);
    const cartKey = useMemo(
        () =>
            selectedVariant
                ? `${product.id}-${selectedVariant.sku}`
                : null,
        [product.id, selectedVariant?.sku]
    );
    const addItem = useCartStore(state => state.addItem);
    const increment = useCartStore(state => state.incrementQuantity);
    const decrement = useCartStore(state => state.decrementQuantity);

    const quantity = useCartStore(
        state => (cartKey ? state.itemsByKey[cartKey]?.quantity ?? 0 : 0)
    );


    /* ---------------- Derived Values ---------------- */
    const discount = useMemo(() => {
        if (!selectedVariant?.originalPrice) return 0;
        return Math.round(
            ((selectedVariant.originalPrice - selectedVariant.price) /
                selectedVariant.originalPrice) *
            100
        );
    }, [selectedVariant]);

    const similarProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 6);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            variantSku: selectedVariant.sku,
            price: selectedVariant.price,
            originalPrice: selectedVariant.originalPrice,
            name: product.name,
            image: product.image,
            brand: product.brand,
            weight: selectedVariant.label,
        });
    };
    const handleIncrement = () => increment(cartKey);
    const handleDecrement = () => decrement(cartKey);


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/Cart')}>
                    <ShoppingCart size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.productImage} />

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(v => !v)}
                    >
                        <Heart
                            size={20}
                            color={isFavorite ? '#e74c3c' : '#666'}
                            fill={isFavorite ? '#e74c3c' : 'none'}
                        />
                    </TouchableOpacity>

                    {discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discount}% OFF</Text>
                        </View>
                    )}
                </View>

                {/* Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.brandText}>{product.brand}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.weightText}>{selectedVariant.weight}</Text>

                    <View style={styles.ratingContainer}>
                        <Text>⭐ {product.rating}</Text>
                        <Text style={styles.reviewsText}>({product.reviews} reviews)</Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{selectedVariant.price}</Text>
                        <Text style={styles.originalPrice}>
                            ₹{selectedVariant.originalPrice}
                        </Text>
                    </View>

                    {/* Variant Selector */}
                    <View style={styles.variantRow}>
                        {product.variants.map(v => (
                            <TouchableOpacity
                                key={v.sku}
                                style={[
                                    styles.variantChip,
                                    v.sku === selectedVariant.sku && styles.variantActive
                                ]}
                                onPress={() => {
                                    setSelectedVariant(v);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.variantText,
                                        v.sku === selectedVariant.sku && styles.variantTextActive
                                    ]}
                                >
                                    {v.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <Text style={styles.descriptionText}>{product.description}</Text>
                </View>

                {/* Similar */}
                {similarProducts.length > 0 && (
                    <View style={styles.similarSection}>
                        <Text style={styles.similarTitle}>Similar Products</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                    onLayout={(event) => {
                                        const containerWidth = event.nativeEvent.layout.width;
                                        setCardWidth(containerWidth);
                                    }}>
                            {similarProducts.map(item => (
                                <ProductCard key={item.id} product={item} width={cardWidth} />
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                {quantity === 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                        <Text style={styles.addButtonText}>ADD TO CART</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={handleDecrement}>
                            <Minus size={20} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={handleIncrement}>
                            <Plus size={20} color="#fff" />
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
    variantRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 16,
    },
    variantChip: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    variantActive: {
        backgroundColor: '#26702A',
        borderColor: '#26702A',
    },
    variantText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    variantTextActive: {
        color: '#fff',
    },

})

export default ProductDetailsPage;