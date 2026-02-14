import React, {useState, useMemo, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, ActivityIndicator, FlatList
} from 'react-native';
import {
    Package,
    Eye,
    ChevronLeft
} from 'lucide-react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useRouter} from 'expo-router';
import {useThemeStore} from "../../store/themeStore";
import CartBadgeIcon from "../../components/CartBadgeIcon";
import {Dropdown} from 'react-native-element-dropdown';

const ORDERS_DATA = [
    {
        id: '#1',
        items: 1,
        customer: '8210958314',
        orderStatus: 'pending',
        payment: 'COD',
        paymentStatus: 'pending',
        amount: '₹50',
        date: 'Jan 8, 2026, 05:21 PM',
        delivery: 'pending'
    },
    {
        id: '#2',
        items: 2,
        customer: '8210958314',
        orderStatus: 'delivered',
        payment: 'COD',
        paymentStatus: 'pending',
        amount: '₹230',
        date: 'Jan 8, 2026, 04:37 PM',
        delivery: 'naitik singh'
    },
    {
        id: '#3',
        items: 1,
        customer: '8210958314',
        orderStatus: 'out_for_delivery',
        payment: 'COD',
        paymentStatus: 'pending',
        amount: '₹120',
        date: 'Jan 7, 2026, 11:22 AM',
        delivery: 'naitik singh'
    },
    {
        id: '#4',
        items: 1,
        customer: '8210958314',
        orderStatus: 'out_for_delivery',
        payment: 'COD',
        paymentStatus: 'pending',
        amount: '₹199',
        date: 'Jan 6, 2026, 10:36 PM',
        delivery: 'naitik singh'
    }
];

const Orders = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [orderStatusSearch, setOrderStatusSearch] = useState(ORDERS_DATA);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const router = useRouter();

    // Filter orders when status changes
    useEffect(() => {
        const filterOrders = async () => {
            setIsSearching(true);

            if (!selectedStatus || selectedStatus === '') {
                setOrderStatusSearch(ORDERS_DATA);
                setIsSearching(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            const lowercaseQuery = selectedStatus.toLowerCase();
            const results = ORDERS_DATA.filter(order =>
                order.orderStatus.toLowerCase().includes(lowercaseQuery)
            );

            setOrderStatusSearch(results);
            setIsSearching(false);
        };

        filterOrders();
    }, [selectedStatus]);
    const dropdownData = [
        {label: 'Pending', value: 'pending'},
        {label: 'Delivered', value: 'delivered'},
        {label: 'Out for Delivery', value: 'out_for_delivery'},
        {label: 'All Orders', value: ''},
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#c15a00';
            case 'delivered':
                return theme.colors.accent;
            case 'out_for_delivery':
                return '#0073d3';
            default:
                return '#F3F4F6';
        }
    };
    const handleViewDetails = (order) => {
        router.push({
            pathname: '/order-detail',
            params: {
                order: JSON.stringify(order)
            }
        });
    };
    console.log('@/app/seller/Orders accessed.');

    const renderOrder = ({item: order}) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderIconContainer}>
                    <Package size={20} color={theme.colors.info}/>
                </View>
                <View style={styles.orderHeaderInfo}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderItems}>{order.items} items</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(order.orderStatus)}
                ]}>
                    <Text style={[
                        styles.statusText,
                        {color: '#fff'}
                    ]}>
                        {order.orderStatus.replace('_', ' ')}
                    </Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderLabel}>Customer:</Text>
                    <Text style={styles.orderValue}>{order.customer}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderLabel}>Payment:</Text>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.orderValue}>{order.payment}</Text>
                        <View style={styles.paymentStatusBadge}>
                            <Text style={styles.paymentStatusText}>{order.paymentStatus}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderLabel}>Amount:</Text>
                    <Text style={styles.orderAmount}>{order.amount}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderLabel}>Date:</Text>
                    <Text style={styles.orderValue}>{order.date}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderLabel}>Delivery Partner:</Text>
                    <Text style={styles.orderValue}>{order.delivery}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewDetails(order)}
            >
                <Eye size={16} color={theme.colors.accentText}/>
                <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {router.canGoBack() && (
                    <ChevronLeft size={24} color={theme.colors.textPrimary} onPress={() => router.back()}/>
                )}
                <Text style={styles.pageTitle}>Order Management</Text>
                <CartBadgeIcon/>
            </View>
            <View style={styles.content}>
                <Dropdown
                    data={dropdownData}
                    labelField="label"
                    valueField="value"
                    value={selectedStatus}
                    onChange={(item) => setSelectedStatus(item.value)}
                    style={styles.filterButton}
                    maxHeight={300}
                    placeholderStyle={{color: "#888"}}
                    selectedTextStyle={{color: theme.colors.textPrimary, fontSize: 13}}
                />
            </View>

            {isSearching ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.accent}/>
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            ) : orderStatusSearch.length > 0 ? (
                <FlatList
                    data={orderStatusSearch}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <>
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <Package size={48} color={theme.colors.textMuted}/>
                        </View>
                        <Text style={styles.emptyTitle}>No orders found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try selecting a different status
                        </Text>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    header: {
        marginTop: 4,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        padding: theme.spacing.lg,
    },
    pageTitle: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginVertical: theme.spacing.lg,
    },
    searchSection: {
        marginBottom: theme.spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchInput: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.textPrimary,
    },
    filtersRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    filterButton: {
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 20,
    },
    totalOrders: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'right',
    },
    flatListContent: {
        paddingHorizontal: theme.spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    resultsCount: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
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
    },
    ordersSection: {
        gap: theme.spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    orderCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    orderIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderHeaderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    orderItems: {
        fontSize: theme.fontSize.sm,
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
        textTransform: 'capitalize',
    },
    orderDetails: {
        gap: 10,
        marginBottom: theme.spacing.md,
    },
    orderDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderLabel: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    orderValue: {
        fontSize: 13,
        color: theme.colors.textPrimary,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        flex: 1,
        justifyContent: 'flex-end',
    },
    paymentStatusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.radius.sm,
    },
    paymentStatusText: {
        color: '#D97706',
        fontSize: 10,
        fontWeight: theme.fontWeight.medium,
    },
    orderAmount: {
        fontSize: 15,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        flex: 1,
        textAlign: 'right',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
    },
    viewButtonText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },
});

export default Orders;