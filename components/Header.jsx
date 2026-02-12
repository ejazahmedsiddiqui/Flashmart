import React, {useMemo, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
} from 'react-native';
import {router} from "expo-router";
import {
    ShoppingCart,
    ChevronDown,
    Navigation,
    MapPin,
} from "lucide-react-native";
import AnimatedSearchBar from "../components/AnimatedSearchBar";
import {useCartCount} from "../hooks/useCartCount";
import {useThemeStore} from "../store/themeStore";
import {useAddress} from "../context/AddressContext";

const Header = ({
                    showAddress = true,
                    showHeaderTitle = true,
                    showCart = true,
                    showSearchBar = true,
                }) => {
    const [showModal, setShowModal] = useState({
        addressModalVisible: false,
    });

    const {allAddresses, currentAddress, currentAddressIndex, setCurrentAddress, isLoading} = useAddress();
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const itemCount = useCartCount();

    const handleAddressSelect = (index) => {
        setCurrentAddress(index);
        setShowModal(prev => ({...prev, addressModalVisible: false}));
    };

    const getShortAddress = () => {
        if (!currentAddress) return 'Add an address';

        const parts = [];
        if (currentAddress.houseNumber) parts.push(currentAddress.houseNumber);
        if (currentAddress.apartmentNameAndPlot) parts.push(currentAddress.apartmentNameAndPlot);

        const addressText = currentAddress.tempAddress || currentAddress.formattedAddress || '';
        const addressParts = addressText.split(',').slice(0, 2);

        return [...parts, ...addressParts].join(', ');
    };

    return (
        <>
            <View style={styles.header}>
                <View style={{flex: 1, marginRight: 12}}>
                    {showHeaderTitle &&
                        <Text style={styles.headerTitle}>FreshCart</Text>
                    }
                    {showAddress &&
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={() => setShowModal(prev => ({...prev, addressModalVisible: true}))}
                        >
                            <Text
                                style={{
                                    color: theme.colors.textPrimary,
                                    fontSize: theme.fontSize.sm,
                                    fontWeight: theme.fontWeight.bold,
                                }}
                            >
                                {currentAddress?.title?.toUpperCase() || 'ADDRESS'} -
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: theme.colors.textSecondary,
                                    fontSize: theme.fontSize.sm,
                                    fontWeight: theme.fontWeight.regular,
                                    flexShrink: 1,
                                }}
                            >
                                {getShortAddress()}
                            </Text>
                            <ChevronDown size={24} color={theme.colors.textSecondary}/>
                        </TouchableOpacity>
                    }
                </View>
                {showCart &&
                    <TouchableOpacity
                        style={[styles.cartIconButton, {flexShrink: 0}]}
                        onPress={() => router.push('/Cart')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cartIcon}>
                            <ShoppingCart size={20} color={'#fff'}/>
                        </View>
                        {itemCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{itemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                }
            </View>

            {/* Search Bar */}
            {showSearchBar &&
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <AnimatedSearchBar/>
                    </View>
                </View>
            }

            {/* Address Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal.addressModalVisible}
                onRequestClose={() => setShowModal(prev => ({...prev, addressModalVisible: false}))}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Delivery Address</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowModal(prev => ({...prev, addressModalVisible: false}))}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.addressList}>
                            {/* Current Location Option */}
                            <TouchableOpacity
                                style={styles.currentLocationButton}
                                onPress={() => router.push('/AddressSetter')}
                            >
                                <View style={styles.currentLocationIcon}>
                                    <Navigation size={24} color="#339a38"/>
                                </View>
                                <View style={styles.currentLocationTextContainer}>
                                    <Text style={styles.currentLocationTitle}>Add New Address</Text>
                                    <Text style={styles.currentLocationSubtitle}>
                                        Use current location or enter manually
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Show Saved Addresses only if available */}
                            {allAddresses.length > 0 && (
                                <>
                                    {/* Divider */}
                                    <View style={styles.divider}>
                                        <View style={styles.dividerLine}/>
                                        <Text style={styles.dividerText}>SAVED ADDRESSES</Text>
                                        <View style={styles.dividerLine}/>
                                    </View>

                                    {/* Saved Addresses */}
                                    {allAddresses.map((addr, index) => (
                                        <TouchableOpacity
                                            key={addr.id}
                                            style={[
                                                styles.addressCard,
                                                index === currentAddressIndex && styles.addressCardSelected
                                            ]}
                                            onPress={() => handleAddressSelect(index)}
                                        >
                                            <View style={styles.addressIconContainer}>
                                                <MapPin size={20} color="#339a38"/>
                                            </View>
                                            <View style={styles.addressInfo}>
                                                <View style={styles.addressTypeRow}>
                                                    <Text
                                                        style={[
                                                            styles.addressType,
                                                            index === currentAddressIndex && styles.addressTypeSelected
                                                        ]}
                                                    >
                                                        {addr.title}
                                                    </Text>
                                                    {index === currentAddressIndex && (
                                                        <View style={styles.selectedBadge}>
                                                            <Text style={styles.selectedBadgeText}>SELECTED</Text>
                                                        </View>
                                                    )}
                                                </View>

                                                {addr.houseNumber && (
                                                    <Text style={styles.addressText}>
                                                        {addr.houseNumber}
                                                        {addr.apartmentNameAndPlot ? `, ${addr.apartmentNameAndPlot}` : ''}
                                                    </Text>
                                                )}

                                                <Text style={styles.addressText} numberOfLines={2}>
                                                    {addr.tempAddress || addr.formattedAddress}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}

                            {/* Empty State */}
                            {allAddresses.length === 0 && (
                                <View style={styles.emptyState}>
                                    <MapPin size={48} color={theme.colors.textMuted} />
                                    <Text style={styles.emptyStateText}>No saved addresses</Text>
                                    <Text style={styles.emptyStateSubtext}>
                                        Tap "Add New Address" to get started
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default Header;

const createStyles = (theme) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerGreeting: {
        fontSize: theme.fontSize.md,
        fontWeight: '400',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    headerTitle: {
        fontSize: theme.fontSize.xxxxl,
        fontWeight: '900',
        color: 'rgba(51,154,56,0.98)',
        marginBottom: 2,
    },
    cartIconButton: {
        width: 48,
        height: 48,
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        fontSize: theme.fontSize.xxl,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.danger,
        borderRadius: theme.radius.md,
        minWidth: theme.spacing.xl,
        height: theme.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    cartBadgeText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
    },

    // Search Styles
    searchSection: {
        backgroundColor: 'transparent',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 12,
    },
    searchIcon: {
        marginRight: 12,
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },

    //Modal Overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    addressList: {
        paddingHorizontal: 20,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#339a38',
    },
    currentLocationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    currentLocationTextContainer: {
        flex: 1,
    },
    currentLocationTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: '700',
        color: theme.colors.accent,
        marginBottom: 4,
    },
    currentLocationSubtitle: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        paddingHorizontal: 12,
        letterSpacing: 0.5,
    },
    addressCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    addressCardSelected: {
        backgroundColor: theme.colors.surface,
        borderColor: '#339a38',
    },
    addressIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addressInfo: {
        flex: 1,
    },
    addressTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    addressType: {
        fontSize: theme.fontSize.md,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    addressTypeSelected: {
        color: theme.colors.accent,
    },
    selectedBadge: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    selectedBadgeText: {
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
        color: theme.colors.accentText,
    },
    addressText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: 4,
    },
    addressPinCode: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: theme.fontSize.lg,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.md,
    },
    emptyStateSubtext: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
});