import React, { useMemo, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { router } from "expo-router";
import { Banners } from "../utilities/banners";

const { width } = Dimensions.get("window");

const BANNER_HEIGHT = 220;
const BANNER_MARGIN = 4;
const ITEM_WIDTH = width - BANNER_MARGIN * 2;

const Banner = () => {

    const activeBanners = useMemo(() => {
        const now = new Date();

        return Banners.filter((banner) => {
            if (!banner.isActive) return false;

            const start = banner.startDate ? new Date(banner.startDate) : null;
            const end = banner.endDate ? new Date(banner.endDate) : null;

            if (start && now < start) return false;
            return !(end && now > end);


        }).sort((a, b) => a.priority - b.priority);
    }, []);

    const handleBannerPress = useCallback((banner) => {
        router.push({
            pathname: `/Banner/${banner.id}`,
            params: {
                campaign: banner.campaign,
                bannerId: banner.id,
            },
        });
    }, []);

    if (activeBanners.length === 0) return null;

    const renderItem = ({ item: banner }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleBannerPress(banner)}
                style={[
                    styles.bannerContainer,
                    { backgroundColor: banner.backgroundColor || "#F5F5F5" },
                ]}
            >
                {banner.image && (
                    <Image
                        source={{ uri: banner.image }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.overlay} />

                <View style={styles.contentContainer}>
                    {banner.type && (
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{banner.type.toUpperCase()}</Text>
                        </View>
                    )}

                    <Text
                        numberOfLines={2}
                        style={[
                            styles.title,
                            { color: banner.textColor || "#FFF" },
                        ]}
                    >
                        {banner.title}
                    </Text>

                    {banner.subtitle && (
                        <Text
                            numberOfLines={2}
                            style={[
                                styles.subtitle,
                                { color: banner.textColor || "#FFF" },
                            ]}
                        >
                            {banner.subtitle}
                        </Text>
                    )}

                    <View style={styles.ctaContainer}>
                        <Text
                            style={[
                                styles.ctaText,
                                { color: banner.textColor || "#FFF" },
                            ]}
                        >
                            Shop Now →
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Carousel
                width={ITEM_WIDTH}
                height={BANNER_HEIGHT}
                data={activeBanners}
                renderItem={renderItem}
                loop
                autoPlay
                autoPlayInterval={3000}
                scrollAnimationDuration={700}
                style={{ alignSelf: "center"}}
                horizontal
                vertical={false}
                mode={'parallax'}
            />
        </View>
    );
};

export default Banner;

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },

    bannerContainer: {
        width: ITEM_WIDTH,
        height: BANNER_HEIGHT,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: '1px 4px 8px rgba(0, 0, 0, 0.5)',
    },

    bannerImage: {
        ...StyleSheet.absoluteFillObject,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },

    typeBadge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    typeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FFF",
        letterSpacing: 1,
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        lineHeight: 32,
    },

    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 4,
    },

    ctaContainer: {
        marginTop: 8,
    },

    ctaText: {
        fontSize: 14,
        fontWeight: "700",
    },

    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 4,
        gap: 8,
    },

    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#D1D5DB",
    },

    paginationDotActive: {
        width: 24,
        backgroundColor: "#374151",
    },
});
