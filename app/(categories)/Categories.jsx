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

const Categories = () => {
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
                                <Icon size={22} color="#fff" />
                                <Text style={styles.categoryTitle}>{category.label}</Text>
                            </View>

                            {/* Sub Categories */}
                            <View style={styles.subCategoryGrid}>
                                {filteredSubCategories.map((sub) => {
                                    console.log(sub.image)
                                    return (
                                    <TouchableOpacity
                                        key={sub.id}
                                        style={styles.subCategoryCard}
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/SubCategory",
                                                params: { subCategoryId: sub.id },
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#191919",
        padding: 12,
        paddingTop: 0
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    categoryBlock: {
        marginBottom: 28,
    },

    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
    },

    categoryTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },

    subCategoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    subCategoryCard: {
        width: "30%",
        alignItems: "center",
    },

    subCategoryImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 12,
        marginBottom: 6,
        backgroundColor: "#333", // Add this to see if the space is there
    },

    subCategoryLabel: {
        color: "#ddd",
        fontSize: 12,
        textAlign: "center",
    },
});
