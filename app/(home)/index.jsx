import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Modal,
    Dimensions
} from 'react-native';
import {router} from "expo-router";
import ProductCard from "../../components/ProductCard";
import {
    ShoppingCart,
    Headphones,
    Carrot,
    Apple,
    Milk,
    Beef,
    Croissant,
    MapPin,
    Navigation,
    ChevronDown,
    HomeIcon,
    Pizza,
    Coffee,
    Fish,
    Candy,
    Wheat,
    SprayCan,
    Baby,
    HeartPulse,
    Shirt,
    PawPrint, Pickaxe, PackageX
} from "lucide-react-native";
import AnimatedSearchBar from "../../components/AnimatedSearchBar";
import {products} from "../../utilities/products";
import {useCartCount} from "../../hooks/useCartCount";

export default function Index() {
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [isSearching, setIsSearching] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [error, setError] = useState(false);
    const scrollViewRef = useRef(null);
    const [categoryLayouts, setCategoryLayouts] = useState({});
    const [address, setAddress] = useState({
        type: 'Home',
        pinCode: '',
        houseNumber: '',
        buildingAddress: '',
        streetAddress: '',
        city: '',
        state: '',
    });
    const [fullAddress, setFullAddress] = useState('')
    const [showModal, setShowModal] = useState({
        addressModalVisible: false,
    })
    const savedAddresses = [
        {
            id: 1,
            type: 'Home',
            pinCode: '201007',
            houseNumber: 'A-1909',
            buildingAddress: `Manager's Tropics`,
            streetAddress: 'Rajnagar Extension',
            city: 'Solapur',
            state: 'Uttar Pradesh'
        },
        {
            id: 2,
            type: 'Work',
            pinCode: '110001',
            houseNumber: 'B-305',
            buildingAddress: 'Tech Tower',
            streetAddress: 'Connaught Place',
            city: 'New Delhi',
            state: 'Delhi'
        },
        {
            id: 3,
            type: 'Other',
            pinCode: '400001',
            houseNumber: 'C-12',
            buildingAddress: 'Sea View Apartments',
            streetAddress: 'Marine Drive',
            city: 'Mumbai',
            state: 'Maharashtra'
        },
        {
            id: 4,
            type: 'Home',
            pinCode: '560001',
            houseNumber: 'D-45',
            buildingAddress: 'Garden Residency',
            streetAddress: 'MG Road',
            city: 'Bangalore',
            state: 'Karnataka'
        }
    ];

    useEffect(() => {
        if (savedAddresses.length > 0) {
            setAddress(savedAddresses[0]);
        }
    }, []);
    useEffect(() => {
        setFullAddress(address.houseNumber + ', ' + address.buildingAddress + ', ' + address.streetAddress + ', ' + address.city);
    }, [address])

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            setError(false);
            try {
                const result = await fetchProducts(category);
                setDisplayProducts(result);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false)
            }
        }
        loadProducts();
    }, [category]);

    const categories = [
        {id: '', label: 'Home', icon: HomeIcon},
        {id: 'vegetables', label: 'Vegetables', icon: Carrot},
        {id: 'mine', label: 'Mining Supplies', icon: Pickaxe},
        {id: 'fruits', label: 'Fruits', icon: Apple},
        {id: 'dairy', label: 'Dairy', icon: Milk},
        {id: 'meat', label: 'Meat', icon: Beef},
        {id: 'bakery', label: 'Bakery', icon: Croissant},
        {id: 'electronics', label: 'Electronics', icon: Headphones},
        {id: 'snacks', label: 'Snacks', icon: Candy},
        {id: 'beverages', label: 'Beverages', icon: Coffee},
        {id: 'seafood', label: 'Seafood', icon: Fish},
        {id: 'frozen', label: 'Frozen Food', icon: Pizza},
        {id: 'grains', label: 'Grains & Rice', icon: Wheat},
        {id: 'household', label: 'Household', icon: SprayCan},
        {id: 'baby', label: 'Baby Care', icon: Baby},
        {id: 'health', label: 'Health', icon: HeartPulse},
        {id: 'fashion', label: 'Fashion', icon: Shirt},
        {id: 'pets', label: 'Pet Supplies', icon: PawPrint},
    ];
    const fetchProducts = async (category = '') => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const allProducts = products;

        return category
            ? allProducts.filter(p => p.category === category)
            : allProducts;
    }

    const handleCategoryPress = (catId, index) => {
        setCategory(catId);

        // Calculate scroll position to center the selected category
        if (scrollViewRef.current && categoryLayouts[catId]) {
            const screenWidth = Dimensions.get('window').width;
            const layout = categoryLayouts[catId];
            const scrollX = layout.x - (screenWidth / 2) + (layout.width / 2);

            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollX),
                animated: true
            });
        }
    };

    const handleCategoryLayout = (catId, event) => {
        const {x, width} = event.nativeEvent.layout;
        setCategoryLayouts(prev => ({
            ...prev,
            [catId]: {x, width}
        }));
    };

    const itemCount = useCartCount();
    const renderProduct = useCallback(
        ({ item }) => <ProductCard product={item} />,
        []
    );


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{flex: 1, marginRight: 12}}>
                    <Text style={styles.headerTitle}>FreshCart</Text>
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
                    </TouchableOpacity>
                </View>
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
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <AnimatedSearchBar value={searchTerm} onChange={setSearchTerm}/>
                    {searchTerm.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchTerm('')}
                            style={styles.clearButton}
                        >
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                    decelerationRate="fast"
                >
                    {categories.map((cat, index) => {
                        const Icon = cat.icon;
                        const isActive = category === cat.id;

                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryChip,
                                    isActive && styles.categoryChipActive
                                ]}
                                onPress={() => handleCategoryPress(cat.id, index)}
                                onLayout={(event) => handleCategoryLayout(cat.id, event)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    size={18}
                                    color={isActive ? '#ffffff' : 'rgba(241,241,241,0.6)'}
                                    fill={isActive ? 'rgba(51,154,56,0.98)' : 'rgba(0,0,0,0)'}
                                />

                                <Text style={[
                                    styles.categoryText,
                                    isActive && styles.categoryTextActive
                                ]}>
                                    {cat.label}
                                </Text>

                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Products List */}
            <View style={styles.productsSection}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#339a38"/>
                        <Text style={styles.loadingText}>Loading fresh products...</Text>
                    </View>
                ) : displayProducts.length !== 0 ? (error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorEmoji}>🥺</Text>
                        <Text style={styles.errorText}>Oops! Something went wrong</Text>
                        <Text style={styles.errorSubtext}>Please try again later</Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayProducts}
                        renderItem={renderProduct}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.productsList}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={6}
                        maxToRenderPerBatch={6}
                        windowSize={5}
                        removeClippedSubviews
                    />

                )) : (
                    <View style={styles.errorContainer}>
                        <View style={styles.iconWrapper}>
                            <PackageX size={42} color="#196500"/>
                        </View>

                        <Text style={styles.title}>{'No products available'}</Text>
                        <Text style={styles.subtitle}>{'Please come back later'}</Text>
                    </View>
                )}
            </View>

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
        paddingHorizontal: 20,
    },

    // Header Styles
    header: {
        backgroundColor: '#191919',
        paddingTop: 8,
        paddingBottom: 16,
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
        backgroundColor: '#191919',
        paddingBottom: 16,
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
    clearIcon: {
        fontSize: 18,
        color: '#64748b',
        fontWeight: '600',
    },

    // Categories Styles
    categoriesSection: {
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#eaffea',
        marginBottom: 12,
    },
    categoriesContent: {},
    categoryChip: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 4,
    },
    categoryChipActive: {
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 2,

    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(241,241,241,0.6)',
    },
    categoryTextActive: {
        color: '#ffffff',
    },

    // Products Section
    productsSection: {
        flex: 1,
        paddingTop: 16,
    },
    productsList: {
        paddingBottom: 20,
        alignItems: 'center'
    },
    // Loading & Error States
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#339a38',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    errorEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#004c05',
        marginBottom: 4,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#94a3b8',
    },
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#E9F5E9",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 6,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },

    // Modal Styles
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