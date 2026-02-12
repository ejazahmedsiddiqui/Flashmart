import {StyleSheet, Text, TouchableOpacity, View, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {useAddress} from "../../context/AddressContext";
import AnimatedContainer from "../../components/AnimatedContainer";
import {useThemeStore} from "../../store/themeStore";
import {useMemo} from "react";
import {Trash2, MapPin, Plus} from "lucide-react-native";
import {useAlert} from "../../utilities/alertConfig";
import CustomAlert from "../../components/CustomAlert";

const Address = () => {
    const {allAddresses, currentAddressIndex, removeAddress, setCurrentAddress} = useAddress();
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const {showAlert, hideAlert, alertConfig} = useAlert()
    const handleRemoveAddress = (index) => {
        showAlert(
            'Remove Address?',
            'Are you sure you want to remove this address?',
            {
                onOk: () => removeAddress(index),
                okText: 'Remove',
                cancelText: 'Cancel',
                showCancel: true,
            }
        )
    };

    const handleSelectAddress = (index) => {
        if (index !== currentAddressIndex) {
            setCurrentAddress(index);
        }
    };

    const renderAddressItem = ({item, index}) => {
        const isCurrent = index === currentAddressIndex;

        return (
            <TouchableOpacity
                style={[styles.addressCard, isCurrent && styles.currentAddressCard]}
                onPress={() => handleSelectAddress(index)}
                activeOpacity={0.7}
            >
                <View style={styles.addressContent}>
                    <View style={styles.iconContainer}>
                        <MapPin
                            size={20}
                            color={isCurrent ? theme.colors.accent : theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.addressDetails}>
                        <Text style={[styles.addressTitle, isCurrent && styles.currentText]}>
                            {item.title}
                        </Text>

                        {item.houseNumber && (
                            <Text style={styles.addressSubtext}>
                                {item.houseNumber}
                                {item.apartmentNameAndPlot ? `, ${item.apartmentNameAndPlot}` : ''}
                            </Text>
                        )}

                        <Text style={styles.addressSubtext} numberOfLines={2}>
                            {item.tempAddress || item.formattedAddress}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleRemoveAddress(index)}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    >
                        <Trash2 size={20} color={theme.colors.danger}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <MapPin size={64} color={theme.colors.textMuted}/>
            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
            <Text style={styles.emptySubtitle}>
                Add your first address to get started
            </Text>
        </View>
    );

    return (
        <AnimatedContainer>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Addresses</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/AddressSetter')}
                    >
                        <Plus size={20} color={theme.colors.accentText}/>
                        <Text style={styles.addButtonText}>Add New</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={allAddresses}
                    renderItem={renderAddressItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[
                        styles.listContainer,
                        allAddresses.length === 0 && styles.emptyListContainer
                    ]}
                    ListEmptyComponent={<EmptyState/>}
                    showsVerticalScrollIndicator={false}
                />
                <CustomAlert
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onOk={alertConfig.onOk}
                    onCancel={alertConfig.onCancel}
                    showCancel={alertConfig.showCancel}
                    okText={alertConfig.okText}
                    cancelText={alertConfig.cancelText}
                    onClose={hideAlert}
                />
            </SafeAreaView>

        </AnimatedContainer>
    );
};

export default Address;

const createStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radius.md,
        gap: theme.spacing.xs,
    },
    addButtonText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },
    listContainer: {
        padding: theme.spacing.lg,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    currentAddressCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.accent,
        borderWidth: 2,
    },
    addressContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: theme.spacing.sm,
        marginTop: 2,
    },
    addressDetails: {
        flex: 1,
        gap: theme.spacing.xs,
    },
    addressTitle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },
    currentText: {
        color: theme.colors.accent,
    },
    addressSubtext: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
        lineHeight: theme.fontSize.sm * 1.4,
    },
    deleteButton: {
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl * 2,
    },
    emptyTitle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        marginTop: theme.spacing.lg,
    },
    emptySubtitle: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.md,
        marginTop: theme.spacing.xs,
    },
});