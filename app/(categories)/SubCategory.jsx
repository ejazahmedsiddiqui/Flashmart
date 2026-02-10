import {SafeAreaView} from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList, Image, StatusBar,
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {ArrowLeft} from "lucide-react-native";
import React, {useEffect, useMemo, useState, useRef} from "react";
import ProductCard from "../../components/ProductCard";
import {products} from "../../utilities/products";
import Header from "../../components/Header";
import {ImageBackground} from "expo-image";

const BRAND_ITEM_HEIGHT = 72;

const SubCategory = () => {
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
        <>
            <StatusBar backgroundColor={'#fff'}/>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    style={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        height: 100,
                        paddingTop: 12,
                        paddingBottom: 0,
                        paddingHorizontal: 12,
                    }}
                    source={{uri: params?.subImage}}
                    imageStyle={{
                        opacity: 0.2,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                justifyContent: 'center'
                            }}
                        >
                            <ArrowLeft size={22} color={'#fff'}/>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{params?.subLabel}</Text>
                    </View>
                    <Header showHeaderTitle={false} showCart={true} showSearchBar={false}/>
                </ImageBackground>


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
                        style={{ paddingTop: 12,}}

                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default SubCategory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#191919",
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    headerTitle: {
        fontSize: 24,
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
        paddingVertical: 20,
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
