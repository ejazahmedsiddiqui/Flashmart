import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { router } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import React, {useEffect, useMemo, useState, useRef} from "react";
import ProductCard from "../../components/ProductCard";

/**
 * MOCK DATA SHAPE EXPECTED:
 * product = {
 *   id,
 *   name,
 *   brand,
 *   image,
 *   variants: [{ sku, label, price, originalPrice }]
 * }
 */
import { products } from "../../utilities/products";

const SubCategory = () => {
    const brands = useMemo(() => {
        const unique = new Set(products.map(p => p.brand));
        return ["All", ...Array.from(unique)];
    }, []);
    const listRef = useRef(null);

    const [activeBrand, setActiveBrand] = useState("All");

    const filteredProducts = useMemo(() => {
        if (activeBrand === "All") return products;
        return products.filter(p => p.brand === activeBrand );
    }, [activeBrand]);
    useEffect(() => {
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });
    }, [activeBrand]);



    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MoveLeft size={22} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sub Category</Text>
            </View>

            {/* Body */}
            <View style={styles.body}>
                {/* Left Brand Sidebar */}
                <View style={styles.sidebar}>
                    <FlatList
                        data={brands}
                        keyExtractor={item => item}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const isActive = item === activeBrand;
                            return (
                                <TouchableOpacity
                                    onPress={() => setActiveBrand(item)}
                                    style={[
                                        styles.brandItem,
                                        isActive && styles.brandItemActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.brandText,
                                            isActive && styles.brandTextActive,
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
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
                    renderItem={({ item }) => (
                        <ProductCard product={item} />
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default SubCategory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 12,
    },
    body: {
        flex: 1,
        flexDirection: "row",
    },

    /* Sidebar */
    sidebar: {
        width: 90,
        backgroundColor: "#f8f8f8",
        borderRightWidth: 1,
        borderColor: "#eee",
    },
    brandItem: {
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    brandItemActive: {
        backgroundColor: "#ffffff",
        borderLeftWidth: 3,
        borderLeftColor: "#26702A",
    },
    brandText: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    brandTextActive: {
        color: "#26702A",
        fontWeight: "700",
    },

    /* Product Grid */
    productList: {
        paddingHorizontal: 6,
        paddingBottom: 24,
    },
});
