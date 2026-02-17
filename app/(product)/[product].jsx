import React, {useState, useMemo} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import { Heart, ArrowLeft, Minus, Plus} from 'lucide-react-native';
import {router, useLocalSearchParams} from "expo-router";
import ProductCard from "../../components/ProductCard";
import {products} from "../../utilities/products";
import {useCartStore} from "../../store/cartStore";
import {SafeAreaView} from "react-native-safe-area-context";
import {useThemeStore} from "../../store/themeStore";
import CartBadgeIcon from "../../components/CartBadgeIcon";

const ProductDetailsPage = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const params = useLocalSearchParams();

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
            <StatusBar backgroundColor={theme.colors.inverted}/>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={theme.colors.textSecondary}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {product.name}
                </Text>
                <CartBadgeIcon/>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image source={{uri: product.image}} style={styles.productImage}/>

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(v => !v)}
                    >
                        <Heart
                            size={20}
                            color={isFavorite ? theme.colors.danger : theme.colors.textSecondary}
                            fill={isFavorite ? theme.colors.danger : 'none'}
                        />
                    </TouchableOpacity>

                    {discount > 0 && (
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
                        <Text style={styles.ratingText}>⭐ {product.rating}</Text>
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
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.similarProductsContainer}
                        >
                            {similarProducts.map(item => (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    isHorizontal={true}  // Add this prop
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={{height: 120}}/>
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
                            <Minus size={20} color={theme.colors.accentText}/>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={handleIncrement}>
                            <Plus size={20} color={theme.colors.accentText}/>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};


const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitle: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        letterSpacing: -0.3,
        color: theme.colors.textPrimary,
    },

    /* ---------------- Image ---------------- */
    imageContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: 30,
        position: 'relative',
    },
    productImage: {
        width: 250,
        height: 250,
        borderRadius: theme.radius.md,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        padding: theme.spacing.sm,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    discountBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.radius.sm,
    },
    discountText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
    },

    /* ---------------- Product Info ---------------- */
    productInfo: {
        padding: theme.spacing.lg,
    },
    brandText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    productName: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    weightText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.md,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    ratingText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textPrimary,
        marginRight: theme.spacing.sm,
    },
    reviewsText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    price: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginRight: theme.spacing.md,
    },
    originalPrice: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.textMuted,
        textDecorationLine: 'line-through',
    },

    /* ---------------- Variants ---------------- */
    variantRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: theme.spacing.md,
    },
    variantChip: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.card,
    },
    variantActive: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    variantText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.medium,
    },
    variantTextActive: {
        color: theme.colors.accentText,
    },

    /* ---------------- Description ---------------- */
    sectionTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: theme.colors.textSecondary,
    },

    /* ---------------- Similar Products ---------------- */
    similarSection: {
        paddingTop: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
        borderTopWidth: 8,
        borderTopColor: theme.colors.surface,
    },
    similarTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },

    /* ---------------- Bottom Bar ---------------- */
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 4,
    },
    addButton: {
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
    },
    addButtonText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.md,
    },
    quantityText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        marginHorizontal: 30,
    },
    similarProductsContainer: {
        paddingHorizontal: 4,
    },
});

export default ProductDetailsPage;