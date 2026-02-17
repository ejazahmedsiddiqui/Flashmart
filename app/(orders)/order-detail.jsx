import React, { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,

} from 'react-native';
import {
    ArrowLeft,
    Package,
    User,
    CreditCard,
    Calendar,
    Truck,
    CheckCircle,
    Phone,

} from 'lucide-react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from 'expo-router';
import {useThemeStore} from "../../store/themeStore";

const OrderDetail = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const params = useLocalSearchParams();
    const router = useRouter();

    // Parse the order data from params
    const order = params.order ? JSON.parse(params.order) : null;

    const currentStatus = order?.orderStatus
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#FEE2E2';
            case 'confirmed':
                return '#DBEAFE';
            case 'preparing':
                return '#FED7AA';
            case 'out_for_delivery':
                return '#EDE9FE';
            case 'delivered':
                return '#D1FAE5';
            case 'cancelled':
                return '#FEE2E2';
            default:
                return '#F3F4F6';
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'pending':
                return '#DC2626';
            case 'confirmed':
                return '#2563EB';
            case 'preparing':
                return '#D97706';
            case 'out_for_delivery':
                return '#7C3AED';
            case 'delivered':
                return '#059669';
            case 'cancelled':
                return '#DC2626';
            default:
                return '#6B7280';
        }
    };


    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Order not found</Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.primaryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
    console.log('@/app/seller/order-details accessed.');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>Order Details</Text>
                    <Text style={styles.headerSubtext}>{order.id}</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Order Status Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Package size={20} color={theme.colors.info} />
                                <Text style={styles.cardTitle}>Order Status</Text>
                            </View>
                        </View>

                        <View style={[
                            styles.statusBadgeLarge,
                            { backgroundColor: getStatusColor(currentStatus) }
                        ]}>
                            <CheckCircle
                                size={20}
                                color={getStatusTextColor(currentStatus)}
                            />
                            <Text style={[
                                styles.statusTextLarge,
                                { color: getStatusTextColor(currentStatus) }
                            ]}>
                                {currentStatus.replace(/_/g, ' ')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Calendar size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.infoText}>{order.date}</Text>
                        </View>
                    </View>

                    {/* Customer Information */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <User size={20} color={theme.colors.info} />
                                <Text style={styles.cardTitle}>Customer Information</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Phone</Text>
                            <View style={styles.phoneContainer}>
                                <Text style={styles.detailValue}>{order.customer}</Text>
                                <TouchableOpacity style={styles.phoneButton}>
                                    <Phone size={16} color={theme.colors.success} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Delivery Partner */}
                    {order.delivery !== 'pending' && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardHeaderLeft}>
                                    <Truck size={20} color={theme.colors.info} />
                                    <Text style={styles.cardTitle}>Delivery Partner</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Name</Text>
                                <Text style={styles.detailValue}>{order.delivery}</Text>
                            </View>
                        </View>
                    )}

                    {/* Order Items */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Package size={20} color={theme.colors.info} />
                                <Text style={styles.cardTitle}>Order Items</Text>
                            </View>
                        </View>

                        <View style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>Order Items</Text>
                                <Text style={styles.itemQuantity}>Qty: {order.items}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>{order.amount}</Text>
                        </View>
                    </View>

                    {/* Payment Information */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <CreditCard size={20} color={theme.colors.info} />
                                <Text style={styles.cardTitle}>Payment Information</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Method</Text>
                            <Text style={styles.detailValue}>{order.payment}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Status</Text>
                            <View style={styles.paymentStatusBadge}>
                                <Text style={styles.paymentStatusText}>
                                    {order.paymentStatus}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.back()}
                        >
                            <ArrowLeft size={16} color={theme.colors.info} />
                            <Text style={styles.secondaryButtonText}>Back to Orders</Text>
                        </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    headerTitle: {
        flex: 1,
    },
    headerText: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    headerSubtext: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    cardTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    editButton: {
        padding: 4,
    },
    statusBadgeLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.md,
    },
    statusTextLarge: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        textTransform: 'capitalize',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    infoText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    detailRow: {
        marginBottom: theme.spacing.md,
    },
    detailLabel: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 6,
    },
    detailValue: {
        fontSize: 15,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    phoneButton: {
        backgroundColor: '#D1FAE5',
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
    },
    totalLabel: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    totalAmount: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
    paymentStatusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.radius.sm,
        alignSelf: 'flex-start',
    },
    paymentStatusText: {
        color: '#D97706',
        fontSize: 13,
        fontWeight: theme.fontWeight.medium,
        textTransform: 'capitalize',
    },
    actionButtons: {
        gap: theme.spacing.md,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    primaryButton: {
        backgroundColor: theme.colors.info,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },
    secondaryButton: {
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    },
    secondaryButtonText: {
        color: theme.colors.info,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        padding: theme.spacing.xl,
    },
    modalTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.lg,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
    },
    statusOptionActive: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.info,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusOptionText: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.textPrimary,
    },
    modalCloseButton: {
        marginTop: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    errorText: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
});

export default OrderDetail;