import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image, ActivityIndicator,
} from "react-native";
import React, {useMemo} from "react";
import {router} from "expo-router";
import {useCartStore} from "../store/cartStore";
import {useThemeStore} from "../store/themeStore";
import {SafeAreaView} from "react-native-safe-area-context";

const ProductCard = ({product, isHorizontal = false}) => {
    const selectedVariant = product.variants?.[0];
    const cartKey = useMemo(
        () =>
            selectedVariant
                ? `${product.id}-${selectedVariant.sku}`
                : null,
        [product.id, selectedVariant?.sku]
    );
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const quantity = useCartStore(
        state => (cartKey ? state.itemsByKey[cartKey]?.quantity ?? 0 : 0)
    );

    const addItem = useCartStore(state => state.addItem);
    const increment = useCartStore(state => state.incrementQuantity);
    const decrement = useCartStore(state => state.decrementQuantity);
    const hasHydrated = useThemeStore((s) => s._hasHydrated);

    const handleCardPush = () => {
        router.push(`/(home)/${product.id}`);
    };

    const discountPercent = useMemo(() => {
        if (!selectedVariant?.originalPrice) return 0;
        return Math.round(
            ((selectedVariant.originalPrice - selectedVariant.price) /
                selectedVariant.originalPrice) *
            100
        );
    }, [selectedVariant]);

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

    console.log("Render ProductCard", product.id);
    if (!hasHydrated) {
        return (
            <SafeAreaView style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#fff'
            }}>
                <ActivityIndicator size="large" color={'blue'}/>
                <Text style={{
                    color: '#1e1e1e'
                }}>
                    Loading...
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <TouchableOpacity
            style={[
                styles.productCard,
                isHorizontal && styles.horizontalCard  // Add conditional style
            ]}
            onPress={handleCardPush}
        >
            <View style={styles.imageContainer}>
                <Image source={{uri: product.image}} style={styles.productImage}/>

                {discountPercent > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            {discountPercent}% OFF
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.productInfo}>
                {product.brand && (
                    <Text style={styles.brandText}>{product.brand}</Text>
                )}

                <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                </Text>

                {selectedVariant && (
                    <Text style={styles.productWeight}>
                        {selectedVariant.label}
                    </Text>
                )}

                {selectedVariant && (
                    <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>
                            ₹{selectedVariant.price}
                        </Text>
                        {selectedVariant.originalPrice >
                            selectedVariant.price && (
                                <Text style={styles.originalPrice}>
                                    ₹{selectedVariant.originalPrice}
                                </Text>
                            )}
                    </View>
                )}

                {quantity === 0 ? (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddToCart}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={handleDecrement}
                        >
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{quantity}</Text>

                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={handleIncrement}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(ProductCard);


const createStyles = (theme) => StyleSheet.create({
    productCard: {
        flex: 1,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        margin: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        maxWidth: '50%',
    },
    horizontalCard: {
        flex: 0,
        width: 160,
        maxWidth: 'none',
    },
    imageContainer: {
        width: '100%',
        height: 100,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productEmoji: {
        fontSize: 70,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
    },
    productInfo: {
        padding: theme.spacing.md,
    },
    brandText: {
        fontSize: 11,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    productName: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    productWeight: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    productPrice: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginRight: 6,
    },
    originalPrice: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
        textDecorationLine: 'line-through',
    },
    addButton: {
        borderWidth: 2,
        borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
    },
    addButtonText: {
        color: theme.colors.accent,
        fontSize: 13,
        fontWeight: theme.fontWeight.bold,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
        paddingVertical: 4,
        paddingHorizontal: 2,
        borderWidth: 2,
        borderColor: theme.colors.accent,
        justifyContent: 'space-between',  // Add this
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    quantityButtonText: {
        color: theme.colors.accentText,
        fontSize: 18,
        fontWeight: theme.fontWeight.bold,
    },
    quantityText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        textAlign: 'center',
    },
});