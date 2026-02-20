import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions, StatusBar
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
    PawPrint, Pickaxe, TriangleAlert, ChevronUp
} from "lucide-react-native";
import {products} from "../../utilities/products";
import Header from "../../components/Header";
import {useThemeStore} from "../../store/themeStore";
import AnimatedContainer from "../../components/AnimatedContainer";
import Banner from "../../components/Banner";

const CONTENT_OFFSET_THRESHOLD = 300

export default function Index() {
    //theme:
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    //states:
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [error, setError] = useState(false);
    const [categoryLayouts, setCategoryLayouts] = useState({});
    const [showScrollTop, setShowScrollTop] = useState(false);

    //references for scrolls
    const offsetRef = useRef(0);
    const isScrollingToTop = useRef(false);
    const scrollViewRef = useRef(null);
    const flatListRef = useRef(null);

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
        //hide go to top button on category reset
        offsetRef.current = 0;
        setShowScrollTop(false);

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
        ({item}) => <ProductCard product={item}/>,
        []
    );
    const handleScroll = (event) => {
        if (isScrollingToTop.current) return; // ignore scroll events during programmatic scroll

        const y = event.nativeEvent.contentOffset.y;
        offsetRef.current = y;

        if (y > CONTENT_OFFSET_THRESHOLD && !showScrollTop) {
            setShowScrollTop(true);
        }

        if (y <= CONTENT_OFFSET_THRESHOLD && showScrollTop) {
            setShowScrollTop(false);
        }
    };

    const scrollToTop = useCallback(() => {
        if (flatListRef.current) {
            isScrollingToTop.current = true;
            setShowScrollTop(false);
            flatListRef.current.scrollToOffset({
                offset: 0,
                animated: true,
            });
            // Clear the flag after animation finishes (~500ms is safe for most cases)
            setTimeout(() => {
                isScrollingToTop.current = false;
            }, 600);
        }
    }, []);


    return (
        <AnimatedContainer>
            <StatusBar backgroundColor={theme.colors.background}  />
            <SafeAreaView style={styles.container}>
                <View style={{paddingHorizontal: 12,}}>
                    <Header/>
                </View>
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
                                        color={isActive ? theme.colors.textSecondary : theme.colors.textMuted}
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
                    {showScrollTop && (
                        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
                            <ChevronUp size={16} color={theme.colors.textPrimary}/>
                            <Text style={styles.buttonText}>Go back to top</Text>
                        </TouchableOpacity>
                    )}
                    {isLoading ?
                        (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={"#339a38"}/>
                                <Text style={styles.loadingText}>Loading fresh products...</Text>
                            </View>
                        ) :
                        error ?
                            (
                                <View style={styles.errorContainer}>
                                    <TriangleAlert size={48} color={'yellow'} style={{marginBottom: 12}}/>
                                    <Text style={styles.errorText}>Oops! Something went wrong</Text>
                                    <Text style={styles.errorSubtext}>Please try again later</Text>
                                </View>
                            ) :
                            displayProducts.length !== 0 ? (
                                <FlatList
                                    ListHeaderComponent={Banner}
                                    ref={flatListRef}
                                    keyExtractor={item => item.id.toString()}
                                    data={displayProducts}
                                    renderItem={renderProduct}
                                    numColumns={2}
                                    initialNumToRender={6}
                                    maxToRenderPerBatch={6}
                                    windowSize={5}
                                    onScroll={handleScroll}
                                    scrollEventThrottle={32}
                                    showsVerticalScrollIndicator={false}
                                    removeClippedSubviews
                                    columnWrapperStyle={styles.columnWrapper}  // Add this
                                    contentContainerStyle={styles.productsList}
                                />
                            ) : (
                                <View style={styles.errorContainer}>
                                    <View style={styles.iconWrapper}>
                                        <PackageX size={42} color={"#196500"}/>
                                    </View>

                                    <Text style={styles.title}>{'No products available'}</Text>
                                    <Text style={styles.subtitle}>{'Please come back later'}</Text>
                                </View>
                            )
                    }
                </View>

            </SafeAreaView>
        </AnimatedContainer>
    )
        ;
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
    },
    // Categories Styles
    categoriesSection: {
        paddingVertical: 2,
        paddingHorizontal: 12,
    },
    categoryChip: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 4,
    },
    categoryChipActive: {
        borderBottomColor: theme.colors.invertedMuted,
        borderBottomWidth: 2,

    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    categoryTextActive: {
        color: theme.colors.textPrimary,
    },
    scrollTopButton: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 4,
        alignItems: 'center',
        top: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 30,
        zIndex: 1000,
        alignSelf: 'center',

    },
    buttonText: {
        color: theme.colors.textPrimary,
        fontSize: 12,
    },
    productsSection: {
        flex: 1,
        paddingHorizontal: 12,
    },
    productsList: {},
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 4,
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
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.danger,
        marginBottom: 4,
    },
    errorSubtext: {
        fontSize: 14,
        color: theme.colors.textPrimary,
    },
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        color: theme.colors.textPrimary,
        marginBottom: 6,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },
})