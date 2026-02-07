import React, {useEffect, useState} from 'react';
import {
    View,
    Text,

    TouchableOpacity,
    StyleSheet, Modal, ScrollView,

} from 'react-native';
import {router} from "expo-router";
import {
    ShoppingCart,
    ChevronDown, Navigation, MapPin,
} from "lucide-react-native";
import AnimatedSearchBar from "../components/AnimatedSearchBar";
import {useCartCount} from "../hooks/useCartCount";
import {addresses} from "../utilities/address";

const Header = ({
                    showAddress = true,
                    showHeaderTitle = true,
                    showCart = true,
                    showSearchBar = true,
                }) => {
    const [address, setAddress] = useState({
        type: 'Home',
        pinCode: '',
        houseNumber: '',
        buildingAddress: '',
        streetAddress: '',
        city: '',
        state: '',
    });
    const [showModal, setShowModal] = useState({
        addressModalVisible: false,
    });
    const [fullAddress, setFullAddress] = useState('')

    const savedAddresses = addresses;
    useEffect(() => {
        if (savedAddresses.length > 0) {
            setAddress(savedAddresses[0]);
        }
    }, []);
    useEffect(() => {
        setFullAddress(address.houseNumber + ', ' + address.buildingAddress + ', ' + address.streetAddress + ', ' + address.city);
    }, [address])
    const itemCount = useCartCount();

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
                            marginTop: 5,
                        }}
                        onPress={() => setShowModal(prev => ({...prev, addressModalVisible: true}))}
                    >
                        <Text
                            style={{
                                color: '#f4f4f4',
                                fontSize: 12,
                                fontWeight: '700',
                            }}
                        >{address?.type?.toUpperCase()} - </Text>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#f4f4f4',
                                fontSize: 12,
                                fontWeight: '400',
                                flexShrink: 1,
                            }}
                        >{fullAddress.split(',').slice(0, 3).join(',')}</Text>
                        <ChevronDown size={24} color={'#f4f4f4'}/>
                    </TouchableOpacity>}
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
                </TouchableOpacity>}
            </View>

            {/* Search Bar */}
            {showSearchBar &&
                <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <AnimatedSearchBar/>
                </View>
            </View>}
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
                            <TouchableOpacity style={styles.currentLocationButton}>
                                <View style={styles.currentLocationIcon}>
                                    <Navigation size={24} color="#339a38"/>
                                </View>
                                <View style={styles.currentLocationTextContainer}>
                                    <Text style={styles.currentLocationTitle}>Use Current Location</Text>
                                    <Text style={styles.currentLocationSubtitle}>
                                        Enable location to find stores near you
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine}/>
                                <Text style={styles.dividerText}>SAVED ADDRESSES</Text>
                                <View style={styles.dividerLine}/>
                            </View>

                            {/* Saved Addresses */}
                            {savedAddresses.map((addr) => (
                                <TouchableOpacity
                                    key={addr.id}
                                    style={[
                                        styles.addressCard,
                                        address.id === addr.id && styles.addressCardSelected
                                    ]}
                                    onPress={() => {
                                        setAddress(addr);
                                        setShowModal(prev => ({...prev, addressModalVisible: false}));
                                    }}
                                >
                                    <View style={styles.addressIconContainer}>
                                        <MapPin size={20} color="#339a38"/>
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <View style={styles.addressTypeRow}>
                                            <Text
                                                style={[
                                                    styles.addressType,
                                                    address.id === addr.id && styles.addressTypeSelected
                                                ]}
                                            >
                                                {addr.type}
                                            </Text>
                                            {address.id === addr.id && (
                                                <View style={styles.selectedBadge}>
                                                    <Text style={styles.selectedBadgeText}>SELECTED</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.addressText}>
                                            {addr.houseNumber}, {addr.buildingAddress}
                                        </Text>
                                        <Text style={styles.addressText}>
                                            {addr.streetAddress}, {addr.city}
                                        </Text>
                                        <Text style={styles.addressPinCode}>PIN: {addr.pinCode}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default Header;
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#191919',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerGreeting: {
        fontSize: 14,
        fontWeight: '400',
        color: '#c9c9c9',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: 'rgba(51,154,56,0.98)',
        marginBottom: 2,
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
        backgroundColor: '#1e1e1e',
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
        borderBottomColor: '#2a2a2a',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#94a3b8',
        fontWeight: '600',
    },
    addressList: {
        paddingHorizontal: 20,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252525',
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
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    currentLocationTextContainer: {
        flex: 1,
    },
    currentLocationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#339a38',
        marginBottom: 4,
    },
    currentLocationSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2a2a2a',
    },
    dividerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        paddingHorizontal: 12,
        letterSpacing: 0.5,
    },
    addressCard: {
        flexDirection: 'row',
        backgroundColor: '#252525',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    addressCardSelected: {
        backgroundColor: '#1a2e1b',
        borderColor: '#339a38',
    },
    addressIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2a2a2a',
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
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
    addressTypeSelected: {
        color: '#339a38',
    },
    selectedBadge: {
        backgroundColor: '#339a38',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    selectedBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#ffffff',
    },
    addressText: {
        fontSize: 14,
        color: '#cbd5e1',
        lineHeight: 20,
        marginBottom: 4,
    },
    addressPinCode: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
})