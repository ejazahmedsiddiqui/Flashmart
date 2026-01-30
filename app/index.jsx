import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import {router} from "expo-router";
import ProductCard from "../components/ProductCard";
import {SearchIcon, ShoppingCart, ShoppingBag, Carrot, Apple, Milk, Beef, Croissant} from "lucide-react-native";

export default function Index() {
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [error, setError] = useState(false);
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
    }, [category])
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
            },
            {
                id: 5,
                name: 'Strawberries',
                brand: 'Berry Farm',
                price: 150,
                originalPrice: 180,
                discount: 17,
                weight: '250g',
                category: 'vegetables',
                image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
            },
            {
                id: 6,
                name: 'Starfruit',
                brand: 'Ignyter Farm',
                price: 400,
                originalPrice: 789,
                discount: 20,
                weight: '250g',
                category: 'vegetables',
                image: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/11_exotic_fruits_you_should_try_slideshow/1800ss_getty_rf_star_fruit_carambola.jpg?resize=750px:*&output-quality=75',
            }, {
                id: 7,
                name: 'Watermelon',
                brand: 'Berry Farm',
                price: 150,
                originalPrice: 180,
                discount: 17,
                weight: '250g',
                category: 'dairy',
                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
            }, {
                id: 8,
                name: 'Banana',
                brand: 'Unsplash Farm',
                price: 150,
                originalPrice: 180,
                discount: 17,
                weight: '250g',
                category: 'dairy',
                image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=200&h=200&fit=crop',
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
                <View>
                    <TouchableOpacity
                        onPress={() => router.push('/(pages)/home')}>
                        <Text style={styles.headerGreeting}>Hello Ji! 👋</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>FreshCart</Text>
                </View>
                <TouchableOpacity
                    style={styles.cartIconButton}
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
                    <Text style={styles.searchIcon}><SearchIcon size={16} color={'#1e1e1e'}/></Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for products..."
                        placeholderTextColor="#94a3b8"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
                <TouchableOpacity
                    onPress={() => router.push('/(pages)/product')}><Text style={styles.sectionTitle}>Categories</Text></TouchableOpacity>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map(cat => {
                        const IconComponent = cat.icon;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryChip,
                                    category === (cat.id === 'All' ? '' : cat.id) && styles.categoryChipActive
                                ]}
                                onPress={() => {
                                    setCategory(cat.id === 'all' ? '' : cat.id);
                                    setSearchTerm('');
                                }}
                                activeOpacity={0.7}
                            >
                                <IconComponent
                                    size={18}
                                    color={category === (cat.id === 'all' ? '' : cat.id) ? '#ffffff' : '#339a38'}
                                    style={styles.categoryIcon}
                                />
                                <Text style={[
                                    styles.categoryText,
                                    category === (cat.id === 'all' ? '' : cat.id) && styles.categoryTextActive
                                ]}>{cat.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Products Section */}
            <View style={styles.productsSection}>
                <Text style={styles.sectionTitle}>
                    {searchTerm.length > 2 ? 'Search Results' : 'Fresh Products'}
                </Text>

                {(isLoading || isSearching) && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0c831f"/>
                        <Text style={styles.loadingText}>Loading delicious items...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorEmoji}>😔</Text>
                        <Text style={styles.errorText}>Oops! Couldn&#39;t load products</Text>
                        <Text style={styles.errorSubtext}>Please try again later</Text>
                    </View>
                )}

                {displayProducts && !isLoading && !isSearching && (
                    <FlatList
                        data={displayProducts}
                        renderItem={({item}) => <ProductCard product={item}/>}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.productsList}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#171717',
    },
    headerGreeting: {
        fontSize: 14,
        color: '#26702A',
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#339a38',
    },
    cartIconButton: {
        position: 'relative',
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#151515',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#339a38',
        fontWeight: '500',
    },
    clearIcon: {
        fontSize: 18,
        color: '#94a3b8',
        paddingLeft: 8,
    },

    // Categories Styles
    categoriesSection: {
        backgroundColor: '#191919',
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#eaffea',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    categoriesContent: {
        paddingHorizontal: 16,
    },
    categoryChip: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    categoryChipActive: {
        backgroundColor: '#0c831f',
        borderColor: '#0c831f',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#339a38',
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
})