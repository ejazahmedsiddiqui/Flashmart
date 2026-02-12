import React, {useState, useMemo} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native';
import {
    Package,
    Search,
    Eye,
    ChevronDown
} from 'lucide-react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import {useThemeStore} from "../../store/themeStore";


const Orders = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const orders = [
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#FEE2E2';
            case 'delivered':
                return '#D1FAE5';
            case 'out_for_delivery':
                return '#FEE2E2';
            default:
                return '#F3F4F6';
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'pending':
                return '#DC2626';
            case 'delivered':
                return '#059669';
            case 'out_for_delivery':
                return '#DC2626';
            default:
                return '#6B7280';
        }
    };

    const handleViewDetails = (order) => {
        // Navigate to order detail page with order data
        router.push({
            pathname: '/order-detail',
            params: {
                order: JSON.stringify(order)
            }
        });
    };
    console.log('@/app/seller/Orders accessed.');

    return (
        <SafeAreaView  style={styles.container}>

            <ScrollView>
                <View style={styles.content}>
                    <Text style={styles.pageTitle}>Orders Management</Text>
                    <Text style={styles.pageSubtitle}>
                        Manage customer orders, payments, and delivery status
                    </Text>

                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Search size={20} color={theme.colors.textMuted}/>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by order ID..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={theme.colors.textMuted}
                            />
                        </View>

                        <View style={styles.filtersRow}>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>All Order Status</Text>
                                <ChevronDown size={16} color={theme.colors.textSecondary}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>All Payment</Text>
                                <ChevronDown size={16} color={theme.colors.textSecondary}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.totalOrders}>Total: 4 orders</Text>
                    </View>

                    <View style={styles.ordersSection}>
                        <View style={styles.sectionHeader}>
                            <Package size={20} color={theme.colors.textPrimary}/>
                            <Text style={styles.sectionTitle}>All Orders</Text>
                        </View>

                        {orders.map((order, index) => (
                            <View key={index} style={styles.orderCard}>
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
                                            {color: getStatusTextColor(order.orderStatus)}
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
                                    <Eye size={16} color={theme.colors.success}/>
                                    <Text style={styles.viewButtonText}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    content: {
        padding: theme.spacing.lg,
    },
    pageTitle: {
        fontSize: theme.fontSize.xxxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterButtonText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    totalOrders: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'right',
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
        backgroundColor: '#D1FAE5',
        borderRadius: theme.radius.sm,
    },
    viewButtonText: {
        color: theme.colors.success,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },
});

export default Orders;