import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Image,
} from "react-native";
import React, { useMemo } from "react";
import { router } from "expo-router";
import { useCartStore } from "../store/cartStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const ProductCard = ({ product }) => {
    const selectedVariant = product.variants?.[0];

    const cartKey = useMemo(
        () =>
            selectedVariant
                ? `${product.id}-${selectedVariant.sku}`
                : null,
        [product.id, selectedVariant?.sku]
    );

    // ✅ O(1) subscription — this is ALL you need
    const quantity = useCartStore(
        state => (cartKey ? state.itemsByKey[cartKey]?.quantity ?? 0 : 0)
    );

    const addItem = useCartStore(state => state.addItem);
    const increment = useCartStore(state => state.incrementQuantity);
    const decrement = useCartStore(state => state.decrementQuantity);

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

    return (
        <TouchableOpacity style={styles.productCard} onPress={handleCardPush}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />

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

                <Text style={styles.productName} numberOfLines={2}>
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


const styles = StyleSheet.create({
    productCard: {
        width: CARD_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        margin: 6,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: '#f8f8f8',
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
        backgroundColor: '#26702A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    productInfo: {
        padding: 12,
    },
    brandText: {
        fontSize: 11,
        color: '#999',
        marginBottom: 4,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    productWeight: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginRight: 6,
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    addButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#26702A',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#26702A',
        fontSize: 13,
        fontWeight: '700',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#26702A',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    quantityText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
});