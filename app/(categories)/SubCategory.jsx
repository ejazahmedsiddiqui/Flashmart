import {SafeAreaView} from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList, Image,
} from "react-native";
import {router} from "expo-router";
import {MoveLeft} from "lucide-react-native";
import React, {useEffect, useMemo, useState, useRef} from "react";
import ProductCard from "../../components/ProductCard";
import {products} from "../../utilities/products";
import Header from "../../components/Header";
const BRAND_ITEM_HEIGHT = 72;

const SubCategory = () => {
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
            { name: "All", image: null },
            ...Array.from(brandMap.values())
        ];
    }, []);

    const listRef = useRef(null);
    const sidebarRef = useRef(null);

    const [activeBrand, setActiveBrand] = useState("All");

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
        ({ item, index }) => {
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
                        <Image source={{ uri: item.image }} style={styles.brandImage} />
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
        [activeBrand]
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MoveLeft size={22} color={'#b3b3b3'}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sub Category</Text>
            </View>
            <View style={{paddingHorizontal: 20, backgroundColor: '#1f1f1f', paddingBottom: 12,}}>
                <Header showHeaderTitle={false} showCart={true} showSearchBar={false} />
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
                    ref={listRef}
                    data={filteredProducts}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    renderItem={({item}) => (
                        <ProductCard product={item}/>
                    )}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    windowSize={5}
                    removeClippedSubviews
                />
            </View>
        </SafeAreaView>
    );
};

export default SubCategory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#191919",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1f1f1f'
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 12,
        color: '#eee'
    },
    body: {
        flex: 1,
        flexDirection: "row",
    },

    /* Sidebar */
    sidebar: {
        width: 90,
        backgroundColor: "#272727",
        borderRightWidth: 1,
        borderColor: "#1e1e1e",
        borderTopRightRadius: 15,
    },
    brandItem: {
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    brandItemActive: {
        backgroundColor: "#191919",
        borderLeftWidth: 4,
        borderLeftColor: "#26702A",
    },
    brandImage: {
        width: 40,
        height: 40,
        borderRadius: 22,
        marginBottom: 4,
        resizeMode: 'contain',
    },
    brandText: {
        fontSize: 12,
        color: "#b5b5b5",
        textAlign: "center",
    },
    brandTextActive: {
        color: "#16b910",
        fontWeight: "700",
    },

    /* Product Grid */
    productList: {
        paddingHorizontal: 6,
        paddingBottom: 24,
    },
});
