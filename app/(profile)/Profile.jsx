import {SafeAreaView} from "react-native-safe-area-context";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions, ActivityIndicator,
} from "react-native";
import {router} from "expo-router";
import React, {useEffect, useMemo} from "react";
import {
    ChevronRight,
    Home,
    User,
    Sun,
    Moon,
    PackageOpen,
    MapPinHouse,
    MessageCircleQuestionMark
} from "lucide-react-native";
import SuccessModal from "../../components/SuccessModal";
import AnimatedContainer from "../../components/AnimatedContainer";
import {useThemeStore} from "../../store/themeStore";
import {useUser} from "../../context/UserContext";
import CustomAlert from "../../components/CustomAlert";
import {useAlert} from "../../utilities/alertConfig";

const {height} = Dimensions.get("window");

const Profile = () => {
    const { isAuthenticated, isLoading, logout } = useUser();
    const { showAlert, hideAlert, alertConfig } = useAlert();
    const [showModal, setShowModal] = React.useState(false);

    const theme = useThemeStore((s) => s.theme);
    const mode = useThemeStore((s) => s.mode);
    const toggleMode = useThemeStore((s) => s.toggleMode);

    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        console.log ('Profile isAuthenticated', isAuthenticated);
        if(!isAuthenticated) router.replace('/Login')
    }, [isAuthenticated]);

    if(isLoading) {
        return (
            <AnimatedContainer>
                <SafeAreaView style={[styles.container]}>
                    <ActivityIndicator size={'large'} color={theme.colors.inverted} />
                    <Text style={{
                        color: theme.colors.text,
                        fontSize: theme.fontSize.lg,
                        fontWeigh: theme.fontWeight.bold
                    }}>
                        Loading...
                    </Text>
                </SafeAreaView>
            </AnimatedContainer>
        )
    }
    return (
        <AnimatedContainer>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.formCard}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.iconWrapper}>
                                    <User size={36} color={'#fff'}/>
                                </View>

                                <View style={styles.headerRow}>
                                    <Text style={styles.headerTitle}>Profile</Text>
                                </View>
                            </View>

                            {/* Info */}
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoLeft}>
                                        <View style={styles.infoIcon}>
                                            <User size={18} color={styles.iconAccent.color}/>
                                        </View>
                                        <View>
                                            <Text style={styles.infoLabel}>Phone Number</Text>
                                            <Text style={styles.infoValue}>
                                                +91 8452 1458 45
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={styles.actionCard}>
                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={() => router.push("/Orders")}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.actionLeft}>
                                        <PackageOpen size={18} color={styles.iconPrimary.color}/>
                                        <Text style={styles.actionText}>My Orders</Text>
                                    </View>
                                    <ChevronRight size={18} color={styles.iconMuted.color}/>
                                </TouchableOpacity>

                                <View style={styles.divider}/>

                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={() => router.push("/Address")}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.actionLeft}>
                                        <Home size={18} color={styles.iconPrimary.color}/>
                                        <Text style={styles.actionText}>Saved Addresses</Text>
                                    </View>
                                    <ChevronRight size={18} color={styles.iconMuted.color}/>
                                </TouchableOpacity>

                                <View style={styles.divider}/>

                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={() => router.push("/AddressSetter")}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.actionLeft}>
                                        <MapPinHouse size={18} color={styles.iconPrimary.color}/>
                                        <Text style={styles.actionText}>Add New Address</Text>
                                    </View>
                                    <ChevronRight size={18} color={styles.iconMuted.color}/>
                                </TouchableOpacity>
                                <View style={styles.divider}/>

                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={toggleMode}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.actionLeft}>
                                        {mode === "dark" ? (
                                            <Sun size={18} color={styles.iconSecondary.color}/>
                                        ) : (
                                            <Moon size={18} color={styles.iconSecondary.color}/>
                                        )}
                                        <Text style={styles.actionText}>Change Theme</Text>
                                    </View>
                                    <ChevronRight size={18} color={styles.iconMuted.color}/>
                                </TouchableOpacity>

                                <View style={styles.divider}/>

                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={() => router.push("/NeedHelp")}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.actionLeft}>
                                        <MessageCircleQuestionMark size={18} color={styles.iconPrimary.color}/>
                                        <Text style={styles.actionText}>Need Help?</Text>
                                    </View>
                                    <ChevronRight size={18} color={styles.iconMuted.color}/>
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* Logout */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() => {
                                    showAlert(
                                        'Logout?',
                                        'Are you sure you want to logout?',
                                        {
                                            onOk: () => setShowModal(true),
                                            showCancel: true,
                                        }
                                    )
                                }}
                            >
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <SuccessModal
                        visible={showModal || !isAuthenticated}
                        autoCloseDuration={1000}
                        onAnimationComplete={() => {
                            logout();
                            setShowModal(false);
                        }}
                        title={"Logged Out"}
                        subtitle={"Logged Out Successfully. Redirecting to Home..."}
                        progressBarColor={theme.colors.danger}
                        iconColor={theme.colors.warning}
                        iconBackgroundColor={theme.colors.danger}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
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
        </AnimatedContainer>
    );
};
export default Profile;

/* ================== STYLES ================== */

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },

        scrollContent: {
            padding: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },

        /* Header */
        header: {
            alignItems: "center",
            marginBottom: theme.spacing.lg,
        },

        headerRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },

        iconWrapper: {
            width: 72,
            height: 72,
            backgroundColor: theme.colors.accent,
            borderRadius: 36,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: theme.spacing.md,
        },

        headerTitle: {
            fontSize: theme.fontSize.xxxl,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
        },

        themeToggle: {
            marginLeft: theme.spacing.sm,
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        /* Cards */
        formCard: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        infoCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        infoRow: {
            flexDirection: "row",
            alignItems: "center",
        },

        infoLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },

        infoIcon: {
            width: 36,
            height: 36,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.colors.surface,
            justifyContent: "center",
            alignItems: "center",
        },

        infoLabel: {
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
        },

        infoValue: {
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
        },

        /* Actions */
        actionCard: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            marginTop: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        actionRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
        },

        actionLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
        },

        actionText: {
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.medium,
            color: theme.colors.textPrimary,
        },

        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginHorizontal: theme.spacing.lg,
        },

        /* Logout */
        buttonContainer: {
            marginBottom: theme.spacing.lg,
        },

        logoutButton: {
            backgroundColor: theme.colors.danger,
            borderRadius: theme.radius.md,
            paddingVertical: theme.spacing.md,
            alignItems: "center",
        },

        logoutText: {
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.accentText,
        },

        /* Icon color helpers */
        iconPrimary: {color: theme.colors.textPrimary},
        iconSecondary: {color: theme.colors.textSecondary},
        iconMuted: {color: theme.colors.textMuted},
        iconAccent: {color: theme.colors.accent},
    });
