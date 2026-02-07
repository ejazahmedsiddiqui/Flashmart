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
    Dimensions
} from 'react-native';
import ProductCard from "../../components/ProductCard";
import {
    PackageX,
    Headphones,
    Carrot,
    Apple,
    Milk,
    Beef,
    Croissant,
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
    PawPrint, Pickaxe
} from "lucide-react-native";
import {products} from "../../utilities/products";
import categoryList from "../../utilities/categories";
import Header from "../../components/Header";

export default function Index() {
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [error, setError] = useState(false);
    const scrollViewRef = useRef(null);
    const [categoryLayouts, setCategoryLayouts] = useState({});

    const categoryHeaderList = [
        {id: '', label: 'Home', icon: HomeIcon},
        {id: 'vegetables', label: 'Vegetables', icon: Carrot, title: 'Grocery & Kitchen'},
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

    const renderProduct = useCallback(
        ({ item }) => <ProductCard product={item} />,
        []
    );


    return (
        <SafeAreaView style={styles.container}>
            <Header />
            {/* Categories */}
            <View style={styles.categoriesSection}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryHeaderListContent}
                    decelerationRate="fast"
                >
                    {categoryHeaderList.map((cat, index) => {
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

    // Categories Styles
    categoriesSection: {
        paddingVertical: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#eaffea',
        marginBottom: 12,
    },
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

})