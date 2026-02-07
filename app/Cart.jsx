import {SafeAreaView} from "react-native-safe-area-context";
import React, {useMemo} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from 'react-native';
import {router} from "expo-router";
import {ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ShoppingCart} from "lucide-react-native";
import {useCartStore} from '../store/cartStore';


export default function Cart() {
    // Updated handler to use cartKey
    console.log('@/app/Cart accessed')
    const incrementQuantity = useCartStore(state => state.incrementQuantity);
    const decrementQuantity = useCartStore(state => state.decrementQuantity);

    const itemsByKey = useCartStore(state => state.itemsByKey);
    const cartItems = useMemo(() => Object.values(itemsByKey), [itemsByKey]);

    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (s, i) => s + i.price * i.quantity,
                0
            ),
        [cartItems]
    );

    const savings = useMemo(
        () =>
            cartItems.reduce(
                (s, i) =>
                    s +
                    ((i.originalPrice ?? i.price) - i.price) * i.quantity,
                0
            ),
        [cartItems]
    );



    const removeItem = useCartStore(state => state.removeItem);

    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryFee;
    const handleUpdateQuantity = (cartKey, change) => {
        if (change > 0) {
            incrementQuantity(cartKey);
        } else {
            decrementQuantity(cartKey);
        }
    };


    const renderCartItem = ({item}) => (
        <TouchableOpacity style={styles.cartItem} onPress={() => router.push(`/${item.id}?from=cart`)}>
            <Image source={{uri: item.image}} style={styles.itemImage}/>

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>

                {/* Display variant label if available */}
                <View style={styles.variantContainer}>
                    <Text style={styles.itemWeight}>
                        {item.variantLabel || item.weight}
                    </Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    {item.originalPrice > item.price && (
                        <Text style={styles.itemOriginalPrice}>₹{item.originalPrice}</Text>
                    )}
                </View>
            </View>

            <View style={styles.itemActions}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.cartKey)}
                    activeOpacity={0.7}
                >
                    <Trash2 size={18} color="#ef4444"/>
                </TouchableOpacity>

                <View style={styles.quantityControl}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item.cartKey, -1)}
                        activeOpacity={0.7}
                    >
                        <Minus size={16} color="#0c831f"/>
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item.cartKey, 1)}
                        activeOpacity={0.7}
                    >
                        <Plus size={16} color="#0c831f"/>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={24} color="#0f172a"/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <View style={styles.placeholder}/>
                </View>

                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <ShoppingBag size={80} color="#cbd5e1"/>
                    </View>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add some delicious items to get started!</Text>

                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/index')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#0f172a"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity
                    style={[styles.cartIconButton, {flexShrink: 0}]}
                    activeOpacity={0.7}
                >
                    <View style={styles.cartIcon}>
                        <ShoppingCart size={20} color={'#fff'}/>
                    </View>
                    {cartItems.length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Cart Items */}
                <View style={styles.cartSection}>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={item => item.cartKey}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>}
                    />
                </View>

                {/* Delivery Info */}
                {deliveryFee === 0 && (
                    <View style={styles.freeDeliveryBanner}>
                        <Text style={styles.freeDeliveryText}>🎉 Yay! You get FREE delivery</Text>
                    </View>
                )}

                {deliveryFee > 0 && (
                    <View style={styles.deliveryInfoBanner}>
                        <Text style={styles.deliveryInfoText}>
                            Add ₹{500 - subtotal} more to get FREE delivery
                        </Text>
                    </View>
                )}

                {/* Bill Details */}
                <View style={styles.billSection}>
                    <Text style={styles.billTitle}>Bill Details</Text>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Subtotal</Text>
                        <Text style={styles.billValue}>₹{subtotal}</Text>
                    </View>

                    {savings > 0 && (
                        <View style={styles.billRow}>
                            <Text style={styles.billLabelSavings}>Item Discount</Text>
                            <Text style={styles.billValueSavings}>-₹{savings}</Text>
                        </View>
                    )}

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        {deliveryFee === 0 ? (
                            <Text style={styles.billValueFree}>FREE</Text>
                        ) : (
                            <Text style={styles.billValue}>₹{deliveryFee}</Text>
                        )}
                    </View>

                    <View style={styles.billDivider}/>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabelTotal}>To Pay</Text>
                        <Text style={styles.billValueTotal}>₹{total}</Text>
                    </View>

                    {savings > 0 && (
                        <View style={styles.savingsTag}>
                            <Text style={styles.savingsTagText}>
                                You&#39;re saving ₹{savings} on this order 🎉
                            </Text>
                        </View>
                    )}
                </View>

                {/* Spacer for checkout button */}
                <View style={{height: 100}}/>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.checkoutContainer}>
                <View style={styles.checkoutInfo}>
                    <Text style={styles.checkoutLabel}>Total Amount</Text>
                    <Text style={styles.checkoutPrice}>₹{total}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => {
                        router.push({
                            pathname: '/Checkout',
                            params: {
                                deliveryFee: deliveryFee,
                                subTotal: subtotal,
                                totalAmount: total,
                                cartItems: cartItems,
                                savings: savings,
                            }
                        })
                        console.log('Proceeding to checkout');
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
        textAlign: 'center',
    },
    cartIconButton: {
        width: 48,
        height: 48,
        backgroundColor: '#0c831f',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0c831f',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    cartIcon: {
        fontSize: 24,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ef4444',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    cartBadgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    placeholder: {
        width: 32,
    },

    // Content
    content: {
        flex: 1,
    },
    cartSection: {
        backgroundColor: '#ffffff',
        marginTop: 8,
    },

    // Cart Item
    cartItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    itemBrand: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 4,
    },
    variantContainer: {
        backgroundColor: '#f1f5f9',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 4,
    },
    itemWeight: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0c831f',
    },
    itemOriginalPrice: {
        fontSize: 14,
        color: '#94a3b8',
        textDecorationLine: 'line-through',
    },
    itemActions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    deleteButton: {
        padding: 8,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    quantityButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
        paddingHorizontal: 12,
        minWidth: 32,
        textAlign: 'center',
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 20,
    },

    // Delivery Banners
    freeDeliveryBanner: {
        backgroundColor: '#dcfce7',
        marginHorizontal: 20,
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    freeDeliveryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#166534',
        textAlign: 'center',
    },
    deliveryInfoBanner: {
        backgroundColor: '#fef3c7',
        marginHorizontal: 20,
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    deliveryInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400e',
        textAlign: 'center',
    },

    // Bill Section
    billSection: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 12,
    },
    billTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    billLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    billLabelSavings: {
        fontSize: 14,
        color: '#0c831f',
    },
    billValueSavings: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0c831f',
    },
    billValueFree: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0c831f',
    },
    billDivider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    },
    billLabelTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    billValueTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0c831f',
    },
    savingsTag: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginTop: 12,
    },
    savingsTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#166534',
        textAlign: 'center',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        backgroundColor: '#f1f5f9',
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 32,
    },
    shopButton: {
        backgroundColor: '#0c831f',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#0c831f',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    shopButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },

    // Checkout Button
    checkoutContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    checkoutInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkoutLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    checkoutPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    checkoutButton: {
        backgroundColor: '#0c831f',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#0c831f',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});