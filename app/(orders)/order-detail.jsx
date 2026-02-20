import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image, Modal
} from 'react-native';
import {
    ArrowLeft,
    Package,
    User,
    CreditCard,
    Calendar,
    Truck,
    CheckCircle,
    Phone, Map,

} from 'lucide-react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useThemeStore} from "../../store/themeStore";
import {useOrderStore} from "../../store/orderStore";
import {LayoutChangeEvent } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Star } from "lucide-react-native";

const STAR_SIZE = 40;
const TOTAL_STARS = 5;

const OrderDetail = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const params = useLocalSearchParams();
    const router = useRouter();
    //Scroll ref to put the page on top on status change
    const scrollRef = useRef(null);

    // Parse the order data from params
    const orderId = params.orderId || null;
    const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);
    const order = useOrderStore(state => state.orders.find(o => o.id === orderId) ?? null);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    useEffect(() => {
        if (!statusModalVisible) {
            scrollRef.current?.scrollTo({y: 0, animated: true})
        }
    }, [statusModalVisible]);
    const currentStatus = order?.orderStatus;
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

    const status = [
        'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
    ]
    console.log(order)
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

    const shopAddress = () => {
        if (!order.shop) {
            console.log('Order shop not found');
            return null
        }
        return order.shop.houseNumber
            + ', '
            + order.shop.name
            + ', '
            + order.shop.buildingAddress
            + ', '
            + order.shop.city
            + ', '
            + order.shop.state
            + ', '
            + order.shop.pinCode
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={theme.colors.textPrimary}/>
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>Order Details</Text>
                    <Text style={styles.headerSubtext}>{order.id}</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} ref={scrollRef}>
                <View style={styles.content}>
                    {/* Order Status Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Package size={20} color={theme.colors.info}/>
                                <Text style={styles.cardTitle}>Order Status</Text>
                            </View>
                        </View>

                        <View style={[
                            styles.statusBadgeLarge,
                            {backgroundColor: getStatusColor(currentStatus)}
                        ]}>
                            <CheckCircle
                                size={20}
                                color={getStatusTextColor(currentStatus)}
                            />
                            <Text style={[
                                styles.statusTextLarge,
                                {color: getStatusTextColor(currentStatus)}
                            ]}>
                                {currentStatus.replace(/_/g, ' ')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Calendar size={16} color={theme.colors.textSecondary}/>
                            <Text style={styles.infoText}>{order.date}</Text>
                        </View>
                    </View>
                    {(order.orderStatus === 'out_for_delivery' || order.orderStatus === 'preparing') && (
                        <TouchableOpacity style={[styles.primaryButton, {
                            backgroundColor: theme.colors.accent,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 12,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            boxShadow: `2px 4px 8px ${theme.colors.boxShadow}`
                        }]} onPress={() => router.push({
                            pathname: '/OrderTracking',
                            params: {
                                shopName: order.shop.name
                            }
                        })}>
                            <Map size={theme.fontSize.xl} color={theme.colors.accentText}/>
                            <Text style={styles.primaryButtonText}>Track Order</Text>
                        </TouchableOpacity>
                    )}
                    {/* Customer Information */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <User size={20} color={theme.colors.info}/>
                                <Text style={styles.cardTitle}>Customer Information</Text>
                            </View>
                        </View>

                        {order.address ? (
                            <>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Address</Text>
                                    <Text style={styles.detailValue}>
                                        {order.address.houseNumber}, {order.address.aptNamePlot}
                                    </Text>
                                    <Text style={[styles.detailValue, {fontWeight: '400', fontSize: 13}]}>
                                        {order.address.formattedAddress}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phone</Text>
                                <View style={styles.phoneContainer}>
                                    <Text style={styles.detailValue}>{order.customer}</Text>
                                    <TouchableOpacity style={styles.phoneButton}>
                                        <Phone size={16} color={theme.colors.success}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {order.shop &&
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Shop Address</Text>
                                <Text style={styles.detailValue}>
                                    {order.shop.name}
                                </Text>
                                <Text style={[styles.detailValue, {fontWeight: '400', fontSize: 13}]}>
                                    {shopAddress()}
                                </Text>
                            </View>
                        }
                    </View>

                    {/* Delivery Partner */}
                    {(order.deliveryPartner ?? order.delivery) !== 'pending' && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardHeaderLeft}>
                                    <Truck size={20} color={theme.colors.info}/>
                                    <Text style={styles.cardTitle}>Delivery Partner</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Name</Text>
                                <Text style={styles.detailValue}>{order.deliveryPartner ?? order.delivery}</Text>
                            </View>
                        </View>
                    )}
                    {/*Rating*/}
                    {order.orderStatus === 'delivered' && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardHeaderLeft}>
                                    <Text style={styles.cardTitle}>Give your order a rating</Text>

                                </View>
                            </View>
                        </View>
                    )}
                    {/* Order Items */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <Package size={20} color={theme.colors.info}/>
                                <Text style={styles.cardTitle}>Order Items</Text>
                            </View>
                        </View>

                        {Array.isArray(order.items) ? order.items.map((item, index) => (
                            <View key={item.cartKey ?? index}>
                                <View style={styles.itemRow}>
                                    {item.image ? (
                                        <Image
                                            source={{uri: item.image}}
                                            style={styles.itemImage}
                                        />
                                    ) : null}
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        {item.brand ? (
                                            <Text style={styles.itemBrand}>{item.brand}</Text>
                                        ) : null}
                                        {item.variantSku ? (
                                            <Text style={styles.itemVariant}>SKU: {item.variantSku}</Text>
                                        ) : null}
                                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                                </View>
                                {index < order.items.length - 1 && <View style={styles.divider}/>}
                            </View>
                        )) : (
                            <View style={styles.itemRow}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>Order Items</Text>
                                    <Text style={styles.itemQuantity}>Qty: {order.items}</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.divider}/>

                        {order.savings > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={styles.savingsLabel}>You saved</Text>
                                <Text style={styles.savingsValue}>-₹{order.savings.toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.totalRow}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValue}>₹{(order.deliveryFee ?? 40).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalRow, {marginTop: 8}]}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>
                                {order.total != null ? `₹${order.total.toFixed(2)}` : order.amount}
                            </Text>
                        </View>
                    </View>

                    {/* Payment Information */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <CreditCard size={20} color={theme.colors.info}/>
                                <Text style={styles.cardTitle}>Payment Information</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Method</Text>
                            <Text style={styles.detailValue}>{order.paymentMethod ?? order.payment}</Text>
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
                            style={styles.primaryButton}
                            onPress={() => setStatusModalVisible(true)}
                        >
                            <Text style={styles.primaryButtonText}>Change Status</Text>
                        </TouchableOpacity>

                        {router.canGoBack() && (
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => router.back()}
                            >
                                <ArrowLeft size={16} color={theme.colors.info}/>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={statusModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setStatusModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setStatusModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Order Status</Text>
                        {status.map((statusOption) => {
                            const isActive = currentStatus === statusOption;
                            return (
                                <TouchableOpacity
                                    key={statusOption}
                                    style={[styles.statusOption, isActive && styles.statusOptionActive]}
                                    onPress={() => {
                                        updateOrderStatus(order.id, statusOption);
                                        setStatusModalVisible(false);
                                    }}
                                >
                                    <View style={[
                                        styles.statusDot,
                                        {backgroundColor: getStatusTextColor(statusOption)}
                                    ]}/>
                                    <Text style={[
                                        styles.statusOptionText,
                                        isActive && {color: theme.colors.info}
                                    ]}>
                                        {statusOption.replace(/_/g, ' ')}
                                    </Text>
                                    {isActive && (
                                        <CheckCircle
                                            size={16}
                                            color={theme.colors.info}
                                            style={{marginLeft: 'auto'}}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setStatusModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
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
        shadowOffset: {width: 0, height: 1},
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
    itemImage: {
        width: 56,
        height: 56,
        borderRadius: theme.radius.sm,
        marginRight: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        minWidth: 70,
        textAlign: 'right',
    },
    itemBrand: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    itemVariant: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    savingsLabel: {
        fontSize: theme.fontSize.md,
        color: '#0c831f',
        fontWeight: '600',
    },
    savingsValue: {
        fontSize: theme.fontSize.md,
        fontWeight: '700',
        color: '#0c831f',
    },
    summaryLabel: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    summaryValue: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
});

export default OrderDetail;