import {Text, TouchableOpacity, View, StyleSheet, Dimensions, Image} from "react-native";
import React, {useState} from "react";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ProductCard = ({product}) => {
    const [cart, setCart] = useState({});

    const addToCart = (productId) => {
        setCart(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const newCart = {...prev};
            if (newCart[productId] > 1) {
                newCart[productId]--;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const quantity = cart[product.id] || 0;

    return (
        <View style={styles.productCard}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                {product.image?.startsWith('http') ? (
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                ) : (
                    <Text style={styles.productEmoji}>{product.image}</Text>
                )}

                {/* Discount Badge */}
                {product.discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{product.discount}% OFF</Text>
                    </View>
                )}
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
                {product.brand && (
                    <Text style={styles.brandText}>{product.brand}</Text>
                )}
                <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                </Text>
                <Text style={styles.productWeight}>{product.unit}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>₹{product.originalPrice - product.discount * product.originalPrice/100}</Text>
                    {product.originalPrice && (
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                    )}
                </View>

                {quantity === 0 ? (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(product.id)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => removeFromCart(product.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => addToCart(product.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    productCard: {
        width: CARD_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        margin: 6,
        borderWidth: 1,
        borderColor: '#f0f0f0',
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