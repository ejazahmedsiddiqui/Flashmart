import { SafeAreaView } from "react-native-safe-area-context";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from "react-native";
import { router } from "expo-router";
import Header from "../../components/Header";
import { categories } from "../../utilities/categories";
import { subCategories } from "../../utilities/subCategoryList";
import React, {useMemo} from "react";
import { useThemeStore } from "../../store/themeStore";

const Categories = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const Icon = category.icon;

                    const filteredSubCategories = subCategories.filter(
                        (sub) => sub.categoryId === category.id
                    );

                    return (
                        <View key={category.id} style={styles.categoryBlock}>
                            {/* Category Header */}
                            <View style={styles.categoryHeader}>
                                <Icon size={22} color={theme.colors.textSecondary} />
                                <Text style={styles.categoryTitle}>{category.label}</Text>
                            </View>

                            {/* Sub Categories */}
                            <View style={styles.subCategoryGrid}>
                                {filteredSubCategories.map((sub) => {
                                    return (
                                    <TouchableOpacity
                                        key={sub.id}
                                        style={styles.subCategoryCard}
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/SubCategory",
                                                params: { subCategoryId: sub.id, subLabel: sub.label,
                                                subImage: sub.image},
                                            })
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri: sub.image,
                                            }}
                                            style={styles.subCategoryImage}
                                            resizeMode="cover"
                                        />
                                        <Text style={styles.subCategoryLabel}>
                                            {sub.label}
                                        </Text>
                                    </TouchableOpacity>
                                )})}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Categories;

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        paddingTop: 0
    },

    scrollContent: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },

    categoryBlock: {
        marginBottom: theme.spacing.xl,
    },

    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },

    categoryTitle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },

    subCategoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.md,
    },

    subCategoryCard: {
        width: "30%",
        alignItems: "center",
    },

    subCategoryImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.xs,
        backgroundColor: theme.colors.card,
    },

    subCategoryLabel: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.md,
        textAlign: "center",
    },
});
