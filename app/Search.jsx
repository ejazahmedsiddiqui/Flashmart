import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState, useMemo, useCallback, useEffect} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import {Search as SearchIcon, X, TrendingUp, Clock, Package, ChevronLeft} from "lucide-react-native";
import {products} from "../utilities/products";
import ProductCard from "../components/ProductCard";
import {useThemeStore} from "../store/themeStore";
import AnimatedContainer from "../components/AnimatedContainer";
import {router} from "expo-router";

const Search = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [cardWidth, setCardWidth] = useState(0);

    // Trending/Popular searches
    const trendingSearches = useMemo(() => [
        "Organic Vegetables",
        "Fresh",
        "Dairy",
        "Bakery",
        "Beverages",
        "Snacks",
    ], []);

    // Search function
    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const lowercaseQuery = query.toLowerCase();
        const results = products.filter(product =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.brand?.toLowerCase().includes(lowercaseQuery) ||
            product.category?.toLowerCase().includes(lowercaseQuery)
        );

        setSearchResults(results);
        setIsSearching(false);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    // Handle search submission
    const handleSearch = useCallback((query) => {
        if (query.trim()) {
            // Add to recent searches (avoiding duplicates)
            setRecentSearches(prev => {
                const filtered = prev.filter(s => s !== query);
                return [query, ...filtered].slice(0, 5);
            });
        }
        performSearch(query);
        Keyboard.dismiss();
    }, [performSearch]);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setSearchResults([]);
    }, []);

    // Remove recent search
    const removeRecentSearch = useCallback((searchTerm) => {
        setRecentSearches(prev => prev.filter(s => s !== searchTerm));
    }, []);

    // Handle trending/recent search tap
    const handleQuickSearch = useCallback((query) => {
        setSearchQuery(query);
        handleSearch(query);
    }, [handleSearch]);

    // Render product card
    const renderProduct = useCallback(
        ({item}) => <ProductCard product={item} width={cardWidth}/>,
        [cardWidth]
    );

    // Render recent search item
    const renderRecentSearch = useCallback(({item}) => (
        <View style={styles.quickSearchItem}>

            <TouchableOpacity
                style={styles.quickSearchButton}
                onPress={() => handleQuickSearch(item)}
            >
                <Clock size={18} color={theme.colors.textMuted} />
                <Text style={styles.quickSearchText}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeRecentSearch(item)}
            >
                <X size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
        </View>
    ), [handleQuickSearch, removeRecentSearch, theme.colors.textMuted, styles]);

    // Render trending search item
    const renderTrendingSearch = useCallback(({item}) => (
        <TouchableOpacity
            style={styles.quickSearchItem}
            onPress={() => handleQuickSearch(item)}
        >
            <TrendingUp size={18} color={theme.colors.accent} />
            <Text style={styles.quickSearchText}>{item}</Text>
        </TouchableOpacity>
    ), [handleQuickSearch, theme.colors.accent, styles]);

    return (
        <AnimatedContainer>
            <SafeAreaView style={styles.container}>
                {/* Search Header */}
                <View style={styles.searchHeader}>
                    <TouchableOpacity onPress={router.back}>
                        <ChevronLeft size={20} color={theme.colors.textSecondary}/>
                    </TouchableOpacity>
                    <View style={styles.searchBarContainer}>
                        <SearchIcon size={20} color={theme.colors.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for products..."
                            placeholderTextColor={theme.colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => handleSearch(searchQuery)}
                            returnKeyType="search"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={clearSearch}>
                                <X size={20} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Search Results or Suggestions */}
                {searchQuery.trim() === "" ? (
                    <View style={styles.suggestionsContainer}>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Recent Searches</Text>
                                <FlatList
                                    data={recentSearches}
                                    renderItem={renderRecentSearch}
                                    keyExtractor={(item, index) => `recent-${index}`}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}

                        {/* Trending Searches */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Trending Searches</Text>
                            <FlatList
                                data={trendingSearches}
                                renderItem={renderTrendingSearch}
                                keyExtractor={(item, index) => `trending-${index}`}
                                scrollEnabled={false}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.resultsContainer}>
                        {isSearching ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.accent} />
                                <Text style={styles.loadingText}>Searching...</Text>
                            </View>
                        ) : searchResults.length > 0 ? (
                            <>
                                <Text style={styles.resultsCount}>
                                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                                </Text>
                                <FlatList
                                    onLayout={(event) => {
                                        const containerWidth = event.nativeEvent.layout.width;
                                        setCardWidth(containerWidth);
                                    }}
                                    data={searchResults}
                                    renderItem={renderProduct}
                                    keyExtractor={item => item.id.toString()}
                                    numColumns={2}
                                    contentContainerStyle={styles.productsList}
                                    showsVerticalScrollIndicator={false}
                                />
                            </>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconWrapper}>
                                    <Package size={48} color={theme.colors.textMuted} />
                                </View>
                                <Text style={styles.emptyTitle}>No products found</Text>
                                <Text style={styles.emptySubtitle}>
                                    Try searching for something else
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </SafeAreaView>
        </AnimatedContainer>
    );
};

export default Search;

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    searchHeader: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.textPrimary,
        paddingVertical: 0,
    },
    suggestionsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    quickSearchItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 4,
        gap: 12,
    },
    quickSearchButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    quickSearchText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    removeButton: {
        padding: 4,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    resultsCount: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    productsList: {
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.medium,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
    },
    emptyIconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: theme.colors.surface,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textPrimary,
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: "center",
        lineHeight: 20,
    },
});