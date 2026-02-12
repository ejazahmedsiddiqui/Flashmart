import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {useCartCount} from "../hooks/useCartCount";
import {ShoppingCart} from "lucide-react-native";
import React, {useMemo} from "react";
import {useThemeStore} from "../store/themeStore";

const CartBadgeIcon = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const itemCount = useCartCount(state => state.itemCount);
    return (
        <TouchableOpacity
            style={[styles.cartIconButton, {flexShrink: 0}]}
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
    )
};

export default CartBadgeIcon;

const createStyles = (theme) => StyleSheet.create({
    cartIconButton: {
        width: 48,
        height: 48,
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        fontSize: theme.fontSize.xxl,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.danger,
        borderRadius: theme.radius.md,
        minWidth: theme.spacing.xl,
        height: theme.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    cartBadgeText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.sm,
        fontWeight: '700',
    },
})