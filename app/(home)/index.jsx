import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator, Modal
} from 'react-native';
import {router} from "expo-router";
import ProductCard from "../../components/ProductCard";
import {ShoppingCart, ShoppingBag, Carrot, Apple, Milk, Beef, Croissant, MapPin, Navigation} from "lucide-react-native";
import AnimatedSearchBar from "../../components/AnimatedSearchBar";

export default function Index() {
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [error, setError] = useState(false);
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


    const [savedAddresses, setSavedAddresses] = useState([
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
    ])

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
        {id: 'all', label: 'All', icon: ShoppingBag},
        {id: 'vegetables', label: 'Vegetables', icon: Carrot},
        {id: 'fruits', label: 'Fruits', icon: Apple},
        {id: 'dairy', label: 'Dairy', icon: Milk},
        {id: 'meat', label: 'Meat', icon: Beef},
        {id: 'bakery', label: 'Bakery', icon: Croissant},
    ];
    const fetchProducts = async (category = '') => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const products = [
            {
                id: 2,
                name: 'Green Apples',
                brand: 'Fresh Farm',
                price: 120,
                originalPrice: 150,
                discount: 20,
                weight: '4 pcs',
                category: 'fruits',
                image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=200&h=200&fit=crop',
                rating: 4.5,
                reviews: 234,
                delivery: '10 mins',
                description: 'Crisp and refreshing green apples, handpicked from premium orchards. Perfect for snacking, baking, or adding a tangy crunch to your salads. Rich in fiber and antioxidants.',
            },
            {
                id: 3,
                name: 'Fresh Oranges',
                brand: 'Citrus Co',
                price: 80,
                originalPrice: 100,
                discount: 20,
                weight: '6 pcs',
                category: 'fruits',
                image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200&h=200&fit=crop',
                rating: 4.7,
                reviews: 189,
                delivery: '8 mins',
                description: 'Juicy and sweet oranges bursting with vitamin C. Sourced from sun-kissed groves to bring you the freshest citrus experience. Great for fresh juice or healthy snacking.',
            },
            {
                id: 4,
                name: 'Red Grapes',
                brand: 'Valley Fresh',
                price: 95,
                originalPrice: 120,
                discount: 21,
                weight: '500g',
                category: 'fruits',
                image: 'https://images.unsplash.com/photo-1571663716920-9fd87840c9ef?w=200&h=200&fit=crop',
                rating: 4.4,
                reviews: 156,
                delivery: '12 mins',
                description: 'Sweet and seedless red grapes, perfect for a healthy snack or dessert. Packed with natural sugars and antioxidants to boost your energy and health.',
            },
            {
                id: 5,
                name: 'Strawberries',
                brand: 'Berry Farm',
                price: 150,
                originalPrice: 180,
                discount: 17,
                weight: '250g',
                category: 'fruits',
                image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
                rating: 4.8,
                reviews: 312,
                delivery: '15 mins',
                description: 'Premium fresh strawberries with vibrant color and sweet flavor. Handpicked at peak ripeness to ensure maximum taste and nutrition. Perfect for desserts, smoothies, or eating fresh.',
            },
            {
                id: 6,
                name: 'Starfruit',
                brand: 'Ignyter Farm',
                price: 400,
                originalPrice: 789,
                discount: 49,
                weight: '250g',
                category: 'fruits',
                image: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/11_exotic_fruits_you_should_try_slideshow/1800ss_getty_rf_star_fruit_carambola.jpg?resize=750px:*&output-quality=75',
                rating: 4.2,
                reviews: 87,
                delivery: '20 mins',
                description: 'Exotic starfruit with a unique sweet-tart flavor and distinctive star shape. Rich in vitamin C and fiber, this tropical treat adds a special touch to fruit salads and garnishes.',
            },
            {
                id: 7,
                name: 'Watermelon',
                brand: 'Berry Farm',
                price: 150,
                originalPrice: 180,
                discount: 17,
                weight: '2 kg',
                category: 'fruits',
                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
                rating: 4.6,
                reviews: 278,
                delivery: '10 mins',
                description: 'Fresh and juicy watermelon, perfect for hot summer days. Sweet, hydrating, and packed with vitamins A and C. Great for refreshing snacks or making fresh juice.',
            },
            {
                id: 8,
                name: 'Banana',
                brand: 'Unsplash Farm',
                price: 150,
                originalPrice: 180,
                discount: 17,
                weight: '6 pcs',
                category: 'fruits',
                image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=200&h=200&fit=crop',
                rating: 4.5,
                reviews: 445,
                delivery: '8 mins',
                description: 'Fresh yellow bananas, nature\'s perfect snack. Rich in potassium, fiber, and natural energy. Ideal for breakfast, smoothies, or a quick energy boost throughout the day.',
            },
        ];
        return category
            ? products.filter(p => p.category === category)
            : products;
    }
    const itemCount = categories.length; //replace later with item count from Cart.

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{flex: 1, marginRight: 12}}>
                    <TouchableOpacity>
                        <Text style={styles.headerGreeting}>Hello Ji! 👋</Text>
                    </TouchableOpacity>
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
                                fontSize: 16,
                                fontWeight: '700',
                                lineHeight: 20,
                            }}
                        >{address?.type?.toUpperCase()} - </Text>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#f4f4f4',
                                fontSize: 16,
                                fontWeight: '300',
                                flexShrink: 1,
                            }}
                        >{fullAddress.split(',').slice(0, 3).join(',')}</Text>
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
                    <AnimatedSearchBar value={searchTerm} onChange={setSearchTerm} />
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
                <TouchableOpacity
                    key={'all'}
                    style={[
                        styles.categoryChip,
                        category === '' && styles.categoryChipActive
                    ]}
                    onPress={() => setCategory('')}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.categoryText,
                        category === '' && styles.categoryTextActive
                    ]}>
                        All
                    </Text>
                </TouchableOpacity>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryChip,
                                    category === cat.id && styles.categoryChipActive
                                ]}
                                onPress={() => setCategory(cat.id === category ? '' : cat.id)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    size={18}
                                    color={category === cat.id ? '#ffffff' : '#339a38'}
                                    style={{marginRight: 6}}
                                />
                                <Text style={[
                                    styles.categoryText,
                                    category === cat.id && styles.categoryTextActive
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
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorEmoji}>🥺</Text>
                        <Text style={styles.errorText}>Oops! Something went wrong</Text>
                        <Text style={styles.errorSubtext}>Please try again later</Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayProducts}
                        renderItem={({item}) => <ProductCard product={item}/>}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.productsList}
                        showsVerticalScrollIndicator={false}
                    />
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
    },

    // Header Styles
    header: {
        backgroundColor: '#191919',
        paddingHorizontal: 20,
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
        color: '#339a38',
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
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
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
        backgroundColor: '#191919',
        paddingVertical: 16,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#eaffea',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    categoriesContent: {
        paddingHorizontal: 0,
    },
    categoryChip: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 4,
        backgroundColor: '#252525',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    categoryChipActive: {
        backgroundColor: '#339a38',
        borderColor: '#339a38',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
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
        paddingHorizontal: 12,
        paddingBottom: 20,
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