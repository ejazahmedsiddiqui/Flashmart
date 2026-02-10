import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Home, LayoutDashboardIcon, LucideShoppingCart, User} from "lucide-react-native";
import {router, usePathname} from "expo-router";
import {useCartCount} from "../hooks/useCartCount"; // Adjust path as needed

const Footer = () => {
    const pathname = usePathname();
    const itemCount = useCartCount();

    const linking = [
        {
            id: 'home',
            label: 'Home',
            icon: Home,
            route: '/(home)'
        },{
            id: 'cart',
            label: 'Cart',
            icon: LucideShoppingCart,
            route: '/Cart',
            badge: itemCount
        },{
            id: 'categories',
            label: 'Categories',
            icon: LayoutDashboardIcon,
            route: '/Categories'
        },{
            id: 'profile',
            label: 'Profile',
            icon: User,
            route: '/(profile)/Profile'
        },
    ];

    const isActive = (route) => {
        if (route === '/(home)') {
            return pathname === '/' || pathname.startsWith('/(home)');
        }
        if (route.startsWith('/(profile)')) {
            return pathname.startsWith('/Profile');
        }
        if (route.startsWith('/Categories')) {
            return pathname.startsWith('/Categories');
        }
        return pathname.includes(route);
    };

    const handleNavigation = (route) => {
        router.replace(route);
    };

    return (
        <View style={styles.footerContainer}>
            {linking.map((item) => {
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
                                color={active ? '#0c831f' : '#494949'}
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

const styles = StyleSheet.create({
    footerContainer: {
        height: 'auto',
        paddingVertical: 12,
        justifyContent: 'space-evenly',
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    activeItem: {
        backgroundColor: '#f0f0f0',
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -8,
        top: -4,
        backgroundColor: '#0c831f',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    label: {
        color: '#494949',
        fontSize: 12,
        marginTop: 4,
    },
    activeLabel: {
        color: '#0c831f',
        fontWeight: '600',
    }
})