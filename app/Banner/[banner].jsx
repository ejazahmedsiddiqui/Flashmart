import React, {useMemo, useCallback} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams, router} from "expo-router";
import {ArrowLeft, Tag, Zap, Sparkles, PackageX} from "lucide-react-native";
import {Banners} from "../../utilities/banners";
import {products} from "../../utilities/products";
import ProductCard from "../../components/ProductCard";
import {useThemeStore} from "../../store/themeStore";

const {width} = Dimensions.get("window");
const HERO_HEIGHT = 240;


const resolveBannerProducts = (banner, allProducts) => {
    if (!banner) return [];

    switch (banner.type) {
        case "offer":
            return allProducts.filter((p) => {
                const v = p.variants?.[0];
                return v?.originalPrice && v.originalPrice > v.price;
            });

        case "category": {
            const slug = banner.targetId?.replace(/^cat_/, "") ?? "";
            const filtered = allProducts.filter((p) => p.category === slug);
            return filtered.length > 0 ? filtered : allProducts;
        }

        case "product":
            // New arrivals — return first 12 products as a sample
            return allProducts.slice(0, 12);

        default:
            return allProducts;
    }
};

const TYPE_META = {
    offer: {label: "Special Offer", Icon: Tag},
    category: {label: "Category", Icon: Sparkles},
    product: {label: "New Arrivals", Icon: Zap},
};



export default function BannerScreen() {
    const {bannerId, campaign} = useLocalSearchParams();

    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    // Resolve banner from params — prefer bannerId, fall back to campaign
    const banner = useMemo(
        () =>
            Banners.find((b) => b.id === bannerId) ??
            Banners.find((b) => b.campaign === campaign) ??
            null,
        [bannerId, campaign]
    );

    const resolvedProducts = useMemo(
        () => resolveBannerProducts(banner, products),
        [banner]
    );

    const meta = TYPE_META[banner?.type] ?? TYPE_META.offer;
    const {Icon} = meta;

    // ── Handlers ──
    const handleBack = useCallback(() => router.back(), []);

    // ── List header: hero image + section label ──
    const ListHeader = useMemo(() => (
        <View>
            {/* Hero */}
            <View style={styles.heroWrapper}>
                {banner?.image ? (
                    <Image
                        source={{uri: banner.image}}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.heroImage, {backgroundColor: banner?.backgroundColor ?? "#333"}]}/>
                )}

                {/* Tinted overlay using banner's own colour */}
                <View
                    style={[
                        styles.heroOverlay,
                        {backgroundColor: (banner?.backgroundColor ?? "#000") + "BB"},
                    ]}
                />

                <View style={styles.heroContent}>
                    {/* Type pill */}
                    <View style={styles.typePill}>
                        <Icon size={12} color="#FFF"/>
                        <Text style={styles.typePillText}>{meta.label.toUpperCase()}</Text>
                    </View>

                    <Text
                        style={[styles.heroTitle, {color: banner?.textColor ?? "#FFF"}]}
                        numberOfLines={2}
                    >
                        {banner?.title}
                    </Text>

                    {banner?.subtitle && (
                        <Text
                            style={[styles.heroSubtitle, {color: banner?.textColor ?? "#FFF"}]}
                            numberOfLines={2}
                        >
                            {banner.subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {/* Section label */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {banner?.type === "offer"
                        ? "Deals in this offer"
                        : banner?.type === "category"
                            ? "Products in this category"
                            : "Featured products"}
                </Text>
                <Text style={styles.sectionCount}>{resolvedProducts.length} items</Text>
            </View>
        </View>
    ), [banner, resolvedProducts.length, styles, meta, Icon]);

    // ── Empty state ──
    const ListEmpty = (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
                <PackageX size={40} color={theme.colors.textMuted}/>
            </View>
            <Text style={styles.emptyTitle}>No products here yet</Text>
            <Text style={styles.emptySubtitle}>Check back soon</Text>
        </View>
    );

    // ── Render ──
    const renderProduct = useCallback(({item}) => <ProductCard product={item}/>, []);

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            {/* Floating back button — sits above the hero */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
                <ArrowLeft size={20} color={theme.colors.textPrimary}/>
            </TouchableOpacity>

            {!banner ? (
                <View style={styles.notFoundContainer}>
                    <PackageX size={48} color={theme.colors.textMuted}/>
                    <Text style={styles.notFoundText}>Banner not found</Text>
                    <TouchableOpacity style={styles.goBackBtn} onPress={handleBack}>
                        <Text style={styles.goBackBtnText}>Go back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={resolvedProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={ListHeader}
                    ListEmptyComponent={ListEmpty}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    windowSize={5}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews
                />
            )}
        </SafeAreaView>
    );
}

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },

        // ── Back button ──
        backButton: {
            position: "absolute",
            top: 52,
            left: 16,
            zIndex: 10,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: {width: 0, height: 2},
            elevation: 4,
        },

        // ── Hero ──
        heroWrapper: {
            width,
            height: HERO_HEIGHT,
            overflow: "hidden",
        },
        heroImage: {
            ...StyleSheet.absoluteFillObject,
            width: "100%",
            height: "100%",
        },
        heroOverlay: {
            ...StyleSheet.absoluteFillObject,
        },
        heroContent: {
            flex: 1,
            padding: 20,
            paddingTop: 48,
            justifyContent: "flex-end",
        },
        typePill: {
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            alignSelf: "flex-start",
            backgroundColor: "rgba(255,255,255,0.2)",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            marginBottom: 10,
        },
        typePillText: {
            fontSize: 11,
            fontWeight: "700",
            color: "#FFF",
            letterSpacing: 0.8,
        },
        heroTitle: {
            fontSize: 28,
            fontWeight: "800",
            lineHeight: 34,
            marginBottom: 6,
        },
        heroSubtitle: {
            fontSize: 15,
            fontWeight: "500",
            opacity: 0.9,
        },

        // ── Section label ──
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 14,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.colors.textPrimary,
        },
        sectionCount: {
            fontSize: 13,
            color: theme.colors.textMuted,
            fontWeight: "500",
        },

        // ── Product grid ──
        listContent: {
            paddingBottom: 24,
        },
        columnWrapper: {
            justifyContent: "space-between",
            paddingHorizontal: 4,
        },

        // ── Empty state ──
        emptyContainer: {
            alignItems: "center",
            paddingTop: 60,
        },
        emptyIconWrapper: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 17,
            fontWeight: "600",
            color: theme.colors.textPrimary,
            marginBottom: 4,
        },
        emptySubtitle: {
            fontSize: 14,
            color: theme.colors.textMuted,
        },

        // ── Not found ──
        notFoundContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
        },
        notFoundText: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.textPrimary,
        },
        goBackBtn: {
            marginTop: 4,
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: theme.colors.accent,
        },
        goBackBtnText: {
            color: theme.colors.accentText,
            fontWeight: "700",
            fontSize: 14,
        },
    });