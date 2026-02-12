import {SafeAreaView} from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList, Image, StatusBar,
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {ChevronLeft} from "lucide-react-native";
import React, {useEffect, useMemo, useState, useRef} from "react";
import ProductCard from "../../components/ProductCard";
import {products} from "../../utilities/products";
import Header from "../../components/Header";
import {useThemeStore} from "../../store/themeStore";

const BRAND_ITEM_HEIGHT = 72;

const SubCategory = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [cardWidth, setCardWidth] = useState(1);
    const brands = useMemo(() => {
        const brandMap = new Map();
        products.forEach(p => {
            if (!brandMap.has(p.brand)) {
                brandMap.set(p.brand, {
                    name: p.brand,
                    image: p.brandImage
                });
            }
        });
        return [
            {name: "All", image: null},
            ...Array.from(brandMap.values())
        ];
    }, []);

    const listRef = useRef(null);
    const sidebarRef = useRef(null);

    const [activeBrand, setActiveBrand] = useState("All");
    const params = useLocalSearchParams();

    const filteredProducts = useMemo(() => {
        if (activeBrand === "All") return products;
        return products.filter(p => p.brand === activeBrand);
    }, [activeBrand]);

    useEffect(() => {
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });
    }, [activeBrand]);


    const renderBrand = React.useCallback(
        ({item, index}) => {
            const isActive = item.name === activeBrand;

            return (
                <TouchableOpacity
                    onPress={() => handleBrandPress(item.name, index)}
                    style={[
                        styles.brandItem,
                        isActive && styles.brandItemActive,
                    ]}
                >
                    {item.image && (
                        <Image
                            source={{uri: item.image}}
                            style={styles.brandImage}
                        />
                    )}
                    <Text
                        style={[
                            styles.brandText,
                            isActive && styles.brandTextActive,
                        ]}
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            );
        },
        [activeBrand, styles]
    );


    const handleBrandPress = (brandName, index) => {
        setActiveBrand(brandName);
        sidebarRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
        });
    };

    return (
        <>
            <StatusBar backgroundColor={theme.colors.inverted}/>
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        paddingTop: 12,
                        paddingBottom: 0,
                        paddingHorizontal: 12,
                    }}>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <ChevronLeft size={16} color={theme.colors.inverted}/>
                        <Text style={styles.headerTitle}>{params?.subLabel}</Text>
                    </TouchableOpacity>
                    <Header showHeaderTitle={false} showCart={true} showSearchBar={false}/>
                </View>


                {/* Body */}
                <View style={styles.body}>
                    {/* Left Brand Sidebar */}
                    <View style={styles.sidebar}>
                        <FlatList
                            ref={sidebarRef}
                            data={brands}
                            keyExtractor={(item) => item.name}
                            getItemLayout={(_, index) => ({
                                length: BRAND_ITEM_HEIGHT,
                                offset: BRAND_ITEM_HEIGHT * index,
                                index,
                            })}
                            initialNumToRender={6}
                            maxToRenderPerBatch={4}
                            windowSize={3}
                            removeClippedSubviews={true}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderBrand}
                        />

                    </View>

                    {/* Product Grid */}
                    <FlatList
                        onLayout={(event) => {
                            const containerWidth = event.nativeEvent.layout.width;
                            setCardWidth(containerWidth);
                        }}
                        ref={listRef}
                        data={filteredProducts}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.productList}
                        renderItem={({item}) => (
                            <ProductCard product={item} width={cardWidth}/>
                        )}
                        initialNumToRender={6}
                        maxToRenderPerBatch={6}
                        windowSize={5}
                        removeClippedSubviews
                        style={{paddingTop: 12,}}

                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default SubCategory;

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
    },
    headerTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginLeft: 4,
    },
    body: {
        flex: 1,
        flexDirection: "row",
    },

    /* Sidebar */
    sidebar: {
        width: 70,
        backgroundColor: theme.colors.surface,
        borderRightWidth: 1,
        borderColor: theme.colors.border,
        borderTopRightRadius: 15,
    },
    brandItem: {
        paddingVertical: 20,
        paddingHorizontal: theme.spacing.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    brandItemActive: {
        backgroundColor: theme.colors.background,
        borderLeftWidth: 8,
        borderLeftColor: theme.colors.accent,
    },
    brandImage: {
        width: 40,
        height: 40,
        borderRadius: 22,
        marginBottom: 4,
        resizeMode: 'contain',
    },
    brandText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        textAlign: "center",
    },
    brandTextActive: {
        color: theme.colors.success,
        fontWeight: theme.fontWeight.bold,
    },

    /* Product Grid */
    productList: {
        paddingHorizontal: 6,
        paddingBottom: theme.spacing.xl,
    },
});