import React, { useState, useMemo } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus } from 'lucide-react-native';
import { router, useLocalSearchParams } from "expo-router";
import ProductCard from "../../components/ProductCard";
import { products } from "../../utilities/products";
import { useCartStore } from "../../store/cartStore";
import {SafeAreaView} from "react-native-safe-area-context";

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
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'#fff'} />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={'#ccc'}/>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    letterSpacing: -0.3,
                    color: '#fff'
                }}>
                    {product.name}
                </Text>
                <TouchableOpacity onPress={() => router.push('/Cart')}>
                    <ShoppingCart size={24} color={'#ccc'}/>
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
                            color={isFavorite ? '#e74c3c' : '#b5b5b5'}
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
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },

    /* ---------------- Header ---------------- */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#191919',
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },

    /* ---------------- Image ---------------- */
    imageContainer: {
        alignItems: 'center',
        backgroundColor: '#222',
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
        backgroundColor: '#1f1f1f',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },

    /* ---------------- Product Info ---------------- */
    productInfo: {
        padding: 20,
    },
    brandText: {
        fontSize: 14,
        color: '#b3b3b3',
        marginBottom: 4,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#f5f5f5',
        marginBottom: 4,
    },
    weightText: {
        fontSize: 14,
        color: '#9a9a9a',
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
        color: '#e0e0e0',
        marginRight: 8,
    },
    reviewsText: {
        fontSize: 14,
        color: '#a0a0a0',
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 26,
        fontWeight: '700',
        color: '#ffffff',
        marginRight: 12,
    },
    originalPrice: {
        fontSize: 18,
        color: '#8a8a8a',
        textDecorationLine: 'line-through',
    },

    /* ---------------- Variants ---------------- */
    variantRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 16,
    },
    variantChip: {
        borderWidth: 1,
        borderColor: '#3a3a3a',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#1f1f1f',
    },
    variantActive: {
        backgroundColor: '#26702A',
        borderColor: '#26702A',
    },
    variantText: {
        fontSize: 14,
        color: '#d0d0d0',
        fontWeight: '600',
    },
    variantTextActive: {
        color: '#ffffff',
    },

    /* ---------------- Description ---------------- */
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f5f5f5',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#bdbdbd',
    },

    /* ---------------- Similar Products ---------------- */
    similarSection: {
        paddingTop: 24,
        paddingHorizontal: 12,
        borderTopWidth: 8,
        borderTopColor: '#222',
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#f5f5f5',
        marginBottom: 16,
        paddingHorizontal: 20,
    },

    /* ---------------- Bottom Bar ---------------- */
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#191919',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 4,
    },
    addButton: {
        backgroundColor: '#26702A',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#ffffff',
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
    quantityText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginHorizontal: 30,
    },
});

export default ProductDetailsPage;