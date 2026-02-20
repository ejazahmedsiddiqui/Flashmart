import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BoxIcon, Home, LayoutDashboardIcon, LucideShoppingCart, User, UserPlusIcon} from "lucide-react-native";
import {router, usePathname} from "expo-router";
import {useCartCount} from "../hooks/useCartCount"; // Adjust path as needed
import { useThemeStore } from "../store/themeStore";
import {useMemo} from "react";
import {useUser} from "../context/UserContext";

const Footer = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const pathname = usePathname();
    const itemCount = useCartCount();
    const {isAuthenticated, isLoading} = useUser();

    const linking = [
        {
            id: 'home',
            label: 'Home',
            icon: Home,
            route: '/(home)'
        },
        {
            id: 'cart',
            label: 'Cart',
            icon: LucideShoppingCart,
            route: '/Cart',
            badge: itemCount
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: LayoutDashboardIcon,
            route: '/Categories'
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: BoxIcon,
            route: '/(orders)/Orders'
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            route: '/(profile)/Profile'
        },
        {
            id: 'login',
            label: 'Login',
            icon: UserPlusIcon,
            route: '/(auth)/Login'
        },
    ];

    const isActive = (route) => {
        if (route === '/(home)') {
            return pathname === '/' || pathname.startsWith('/(home)');
        }
        if (route.startsWith('/(orders)')) {
            return pathname.startsWith('/Orders');
        }
        if (route.startsWith('/(profile)')) {
            return pathname.startsWith('/Profile');
        }
        if (route.startsWith('/Categories')) {
            return pathname.startsWith('/Categories');
        }
        if(route.startsWith('/(auth)')) {
            return pathname.startsWith('/Login');
        }
        return pathname.includes(route);
    };

    const handleNavigation = (route) => {
        router.replace(route);
    };
    const visibleLinks = linking.filter((item) => {
        if (item.id === 'login') return !isAuthenticated;
        if (item.id === 'profile') return isAuthenticated;
        return true;
    });
    if(isLoading) {
        return <View style={styles.footerContainer}>
            <ActivityIndicator size="large" />
        </View>
    }
    return (
        <View style={styles.footerContainer}>
            {visibleLinks.map((item) => {
                const active = isActive(item.route);
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.6}
                        style={[
                            styles.item,
                            active && styles.activeItem
                        ]}
                    >
                        <View style={styles.iconContainer}>
                            <item.icon
                                size={24}
                                color={active ? theme.colors.accent : theme.colors.inverted}
                            />
                            {item.badge > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[
                            styles.label,
                            active && styles.activeLabel
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
};

export default Footer;

const createStyles = (theme) => StyleSheet.create({
    footerContainer: {
        height: 'auto',
        maxHeight: '10%',
        paddingVertical: theme.spacing.sm,
        justifyContent: 'space-evenly',
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        flex: 1,
    },
    item: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.sm
    },
    activeItem: {
        backgroundColor: theme.colors.invertedExtraMuted,
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -8,
        top: -4,
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.md,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
    },
    badgeText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
    },
    label: {
        color: theme.colors.inverted,
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xs,
    },
    activeLabel: {
        color: theme.colors.accent,
        fontWeight: theme.fontWeight.bold,
    }
})