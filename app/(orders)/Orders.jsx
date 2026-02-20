import React, {useMemo} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
} from 'react-native';
import {Package, Eye, ChevronLeft, RefreshCw, UserPlusIcon} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {useThemeStore} from '../../store/themeStore';
import {useOrderStore} from '../../store/orderStore';
import {useCartStore} from '../../store/cartStore';
import CartBadgeIcon from '../../components/CartBadgeIcon';
import {useUser} from "../../context/UserContext";

const Orders = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const orders = useOrderStore((s) => s.orders);
    const addItem = useCartStore((s) => s.addItem);
    const router = useRouter();
    const {isAuthenticated} = useUser();
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#c15a00';
            case 'confirmed':
                return '#0073d3';
            case 'preparing':
                return '#7C3AED';
            case 'out_for_delivery':
                return '#0073d3';
            case 'delivered':
                return theme.colors.accent;
            case 'cancelled':
                return '#DC2626';
            default:
                return '#6B7280';
        }
    };

    const handleViewDetails = (order) => {
        router.push({
            pathname: '/order-detail',
            params: {order: JSON.stringify(order), orderId: order.id },
        });
    };

    const handleReorder = (order) => {
        if (!Array.isArray(order.items)) return;
        order.items.forEach((item) => {
            // addItem increments if already in cart, so call once per unit
            for (let i = 0; i < item.quantity; i++) {
                addItem({
                    id: item.id,
                    variantSku: item.variantSku,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    name: item.name,
                    image: item.image,
                    brand: item.brand,
                    weight: item.weight,
                });
            }
        });
        router.push('/Cart');
    };

    const renderOrder = ({item: order}) => {
        const itemCount = Array.isArray(order.items)
            ? order.items.reduce((sum, i) => sum + i.quantity, 0)
            : (order.items ?? 0);

        const amountDisplay = order.total != null
            ? `₹${order.total.toFixed(2)}`
            : (order.amount ?? '—');

        // Up to 3 product image thumbnails
        const previewImages = Array.isArray(order.items)
            ? order.items.slice(0, 3).map((i) => i.image).filter(Boolean)
            : [];

        const extraCount = Array.isArray(order.items) && order.items.length > 3
            ? order.items.length - 3
            : 0;

        return (
            <View style={styles.card}>
                {/* ── Header: order ID, date, status ── */}
                <View style={styles.cardHeader}>
                    <View style={styles.iconWrap}>
                        <Package size={18} color={theme.colors.info}/>
                    </View>
                    <View style={styles.cardHeaderInfo}>
                        <Text style={styles.orderId}>{order.id}</Text>
                        <Text style={styles.orderDate}>{order.date}</Text>
                    </View>
                    <View style={[styles.statusBadge, {backgroundColor: getStatusColor(order.orderStatus)}]}>
                        <Text style={styles.statusText}>
                            {order.orderStatus.replace(/_/g, ' ')}
                        </Text>
                    </View>
                </View>

                {/* ── Overview: thumbnails + price summary ── */}
                <View style={styles.overviewRow}>
                    {previewImages.length > 0 && (
                        <View style={styles.imageStrip}>
                            {previewImages.map((uri, idx) => (
                                <Image
                                    key={idx}
                                    source={{uri}}
                                    style={[
                                        styles.previewImage,
                                        idx > 0 && {marginLeft: -10},
                                        {zIndex: previewImages.length - idx},
                                    ]}
                                />
                            ))}
                            {extraCount > 0 && (
                                <View style={[styles.previewImage, styles.moreChip, {marginLeft: -10}]}>
                                    <Text style={styles.moreChipText}>+{extraCount}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryItems}>
                            {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </Text>
                        <Text style={styles.summaryAmount}>{amountDisplay}</Text>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentMethod}>
                                {order.paymentMethod ?? order.payment ?? 'COD'}
                            </Text>
                            <View style={styles.paymentStatusBadge}>
                                <Text style={styles.paymentStatusText}>{order.paymentStatus}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── Delivery address snippet ── */}
                {order.address && (
                    <Text style={styles.addressSnippet} numberOfLines={1}>
                        📍 {order.address.houseNumber}, {order.address.aptNamePlot}
                    </Text>
                )}

                {/* ── Action buttons ── */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.reorderBtn}
                        activeOpacity={0.75}
                        onPress={() => handleReorder(order)}
                    >
                        <RefreshCw size={14} color={theme.colors.accent}/>
                        <Text style={styles.reorderBtnText}>Re-order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.viewBtn}
                        activeOpacity={0.75}
                        onPress={() => handleViewDetails(order)}
                    >
                        <Eye size={14} color={theme.colors.accentText}/>
                        <Text style={styles.viewBtnText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {router.canGoBack() && (
                    <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                        <ChevronLeft size={24} color={theme.colors.textPrimary}/>
                    </TouchableOpacity>
                )}
                <Text style={styles.pageTitle}>My Orders</Text>
                <CartBadgeIcon/>
            </View>
            {!isAuthenticated ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconWrap}>
                        <UserPlusIcon size={48} color={theme.colors.textMuted}/>
                    </View>
                    <Text style={styles.emptyTitle}>Not Logged-in</Text>
                    <Text style={styles.emptySubtitle}>Please Login to see your orders</Text>
                    <TouchableOpacity
                        style={styles.shopNowBtn}
                        onPress={() => router.replace('/Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.shopNowText}>Log in Now</Text>
                    </TouchableOpacity>
                </View>
            ) : orders.length > 0 ? (
                    <FlatList
                        data={orders}
                        renderItem={renderOrder}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) :
                (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrap}>
                            <Package size={48} color={theme.colors.textMuted}/>
                        </View>
                        <Text style={styles.emptyTitle}>No orders yet</Text>
                        <Text style={styles.emptySubtitle}>Your placed orders will appear here</Text>
                        <TouchableOpacity
                            style={styles.shopNowBtn}
                            onPress={() => router.replace('/')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.shopNowText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
        </SafeAreaView>
    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },

    // Header
    header: {
        marginTop: 4,
        marginBottom: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },

    // Card
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },

    // Card header
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeaderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    orderDate: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.radius.md,
    },
    statusText: {
        fontSize: 11,
        fontWeight: theme.fontWeight.medium,
        color: '#fff',
        textTransform: 'capitalize',
    },

    // Overview row
    overviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    imageStrip: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewImage: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.sm,
        borderWidth: 2,
        borderColor: theme.colors.card,
        backgroundColor: theme.colors.surface,
    },
    moreChip: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreChipText: {
        fontSize: 10,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textSecondary,
    },
    summaryInfo: {
        flex: 1,
        gap: 3,
    },
    summaryItems: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    summaryAmount: {
        fontSize: 17,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paymentMethod: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    paymentStatusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: theme.radius.sm,
    },
    paymentStatusText: {
        color: '#D97706',
        fontSize: 10,
        fontWeight: theme.fontWeight.medium,
        textTransform: 'capitalize',
    },

    // Address
    addressSnippet: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 2,
        marginBottom: theme.spacing.md,
    },

    // Action buttons
    actions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    reorderBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: theme.radius.sm,
        borderWidth: 1.5,
        borderColor: theme.colors.accent,
        backgroundColor: 'transparent',
    },
    reorderBtnText: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },
    viewBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.accent,
    },
    viewBtnText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },

    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    shopNowBtn: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
    },
    shopNowText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
    },
});

export default Orders;