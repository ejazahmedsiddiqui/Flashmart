import {SafeAreaView} from "react-native-safe-area-context";
import {Text, StyleSheet, View, TouchableOpacity, ScrollView, Modal} from "react-native";
import {router} from "expo-router";
import {ArrowLeft, MapPin, Check, Store, Package, Plus} from "lucide-react-native";
import React, {useEffect, useMemo, useState} from "react";
import {useCartStore} from "../store/cartStore";
import {useOrderStore} from "../store/orderStore";
import {shopAddresses} from "../utilities/shopAddress";
import {useUser} from "../context/UserContext";
import {useAddress} from "../context/AddressContext";
import {useThemeStore} from "../store/themeStore";
import CartBadgeIcon from "../components/CartBadgeIcon";

const Checkout = () => {

    const { allAddresses } = useAddress();
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showShopModal, setShowShopModal] = useState(false);
    const {isAuthenticated} = useUser();
    const itemsByKey = useCartStore(state => state.itemsByKey);
    const clearCart = useCartStore(state => state.clearCart);
    const placeOrder = useOrderStore(state => state.placeOrder);
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

    const deliveryFee = 40;
    const total = subtotal + deliveryFee;
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    console.log('@/app/Checkout -> accessed');
    useEffect(() => {
        if (!isAuthenticated) router.replace({
            pathname: '/Login',
            params: {
                path: 'cart'
            }
        })
    }, [isAuthenticated]);
    const AddressCard = ({address, isSelected, onPress}) => (
        <TouchableOpacity
            style={[styles.addressCard, isSelected && styles.selectedCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.addressHeader}>
                <View style={styles.addressTypeContainer}>
                    <MapPin size={16} color="#0c831f"/>
                    <Text style={styles.addressType}>{address.title}</Text>
                </View>
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Check size={16} color="#fff"/>
                    </View>
                )}
            </View>
            <Text style={styles.addressText}>
                {address.houseNumber}, {address.aptNamePlot}
            </Text>
            <Text style={styles.addressText} numberOfLines={2}>
                {address.formattedAddress}
            </Text>

        </TouchableOpacity>
    );

    const ShopCard = ({shop, isSelected, onPress}) => (
        <TouchableOpacity
            style={[styles.addressCard, isSelected && styles.selectedCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.addressHeader}>
                <View style={styles.addressTypeContainer}>
                    <Store size={16} color="#0c831f"/>
                    <Text style={styles.shopName}>{shop.name}</Text>
                </View>
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Check size={16} color="#fff"/>
                    </View>
                )}
            </View>
            <Text style={styles.addressText}>
                {shop.houseNumber}, {shop.buildingAddress}
            </Text>
            <Text style={styles.addressText}>
                {shop.streetAddress}, {shop.city}
            </Text>
            <Text style={styles.addressText}>
                {shop.state} - {shop.pinCode}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color={theme.colors.textSecondary}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <CartBadgeIcon />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Delivery Address Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    {selectedAddress ? (
                        <AddressCard
                            address={selectedAddress}
                            isSelected={true}
                            onPress={() => setShowAddressModal(true)}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => setShowAddressModal(true)}
                            activeOpacity={0.7}
                        >
                            <MapPin size={20} color="#0c831f"/>
                            <Text style={styles.selectButtonText}>Select Delivery Address</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Shop Address Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pickup From</Text>
                    {selectedShop ? (
                        <ShopCard
                            shop={selectedShop}
                            isSelected={true}
                            onPress={() => setShowShopModal(true)}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => setShowShopModal(true)}
                            activeOpacity={0.7}
                        >
                            <Store size={20} color="#0c831f"/>
                            <Text style={styles.selectButtonText}>Select Shop Location</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Delivery Partner Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Partner</Text>
                    <View style={styles.deliveryPartnerCard}>
                        <View style={styles.deliveryPartnerIcon}>
                            <Package size={24} color="#0c831f"/>
                        </View>
                        <View style={styles.deliveryPartnerInfo}>
                            <Text style={styles.deliveryPartnerName}>FastTrack Delivery</Text>
                            <Text style={styles.deliveryPartnerTime}>Estimated: 30-45 mins</Text>
                        </View>
                    </View>
                </View>

                {/* Order Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Items ({itemCount})</Text>
                            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        {savings > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.savingsLabel}>Savings</Text>
                                <Text style={styles.savingsValue}>-₹{savings.toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={{height: 100}}/>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.checkoutButton,
                        (!selectedAddress || !selectedShop) && styles.checkoutButtonDisabled
                    ]}
                    activeOpacity={0.8}
                    disabled={!selectedAddress || !selectedShop}
                    onPress={() => {
                        const newOrder = placeOrder({
                            cartItems,
                            address: selectedAddress,
                            shop: selectedShop,
                            subtotal,
                            savings,
                            deliveryFee,
                            total,
                            paymentMethod: 'COD',
                        });
                        clearCart();
                        router.replace({
                            pathname: '/order-detail',
                            params: { order: JSON.stringify(newOrder) },
                        });
                    }}
                >
                    <Text style={[styles.checkoutButtonText, (!selectedAddress || !selectedShop) && {color: theme.colors.textMuted}]}>
                        Proceed to Payment • ₹{total.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Address Selection Modal */}
            <Modal
                visible={showAddressModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddressModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Delivery Address</Text>
                            <TouchableOpacity
                                onPress={() => setShowAddressModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {allAddresses.length === 0 && (
                            <ScrollView style={styles.modalScroll}>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => router.push('/Address')}
                                >
                                    <Plus size={20} color={'#fff'}/>
                                    <Text style={styles.addButtonText}>Add New</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                        <ScrollView style={styles.modalScroll}>
                            {allAddresses?.map((address) => (
                                <AddressCard
                                    key={address.id}
                                    address={address}
                                    isSelected={selectedAddress?.id === address.id}
                                    onPress={() => {
                                        setSelectedAddress(address);
                                        setShowAddressModal(false);
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Shop Selection Modal */}
            <Modal
                visible={showShopModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowShopModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Shop Location</Text>
                            <TouchableOpacity
                                onPress={() => setShowShopModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalScroll}>
                            {shopAddresses.map((shop) => (
                                <ShopCard
                                    key={shop.id}
                                    shop={shop}
                                    isSelected={selectedShop?.id === shop.id}
                                    onPress={() => {
                                        setSelectedShop(shop);
                                        setShowShopModal(false);
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
};

export default Checkout;

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 16,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },

    content: {
        flex: 1,
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        gap: 8,
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.accent,
    },
    addressCard: {
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 12,
    },
    selectedCard: {
        borderColor: theme.colors.border,
        borderWidth: 2,
        backgroundColor: theme.colors.background,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    addressType: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    shopName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    deliveryPartnerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: 12,
    },
    deliveryPartnerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deliveryPartnerInfo: {
        flex: 1,
    },
    deliveryPartnerName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    deliveryPartnerTime: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    summaryCard: {
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    savingsLabel: {
        fontSize: 14,
        color: theme.colors.accent,
        fontWeight: '600',
    },
    savingsValue: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.accent,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.accent,
    },
    footer: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    checkoutButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: theme.colors.accent,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutButtonDisabled: {
        backgroundColor: theme.colors.invertedMuted,
        shadowOpacity: 0,
        elevation: 0,
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.accentText,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xl,
        borderRadius: theme.radius.md,
        gap: theme.spacing.xs,
    },
    addButtonText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },
    modalScroll: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
});