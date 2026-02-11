import {SafeAreaView} from "react-native-safe-area-context";
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StyleSheet, Alert, ActivityIndicator,
} from "react-native";
import React, {useState, useRef, useEffect, useMemo} from "react";
import {Phone, Lock} from "lucide-react-native";
import {router} from "expo-router";

import RenderFormField from "../../components/RenderFormField";
import SuccessModal from "../../components/SuccessModal";
import {useThemeStore} from "../../store/themeStore";
import {useUser} from "../../context/UserContext";

const SellerLogin = () => {
    const {isAuthenticated, isLoading, login} = useUser();

    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({phone: "", otp: ""});
    const [resendTimer, setResendTimer] = useState(0);


    useEffect(() => {
        console.log('Login isAuthenticated: ', isAuthenticated)
        if (isAuthenticated && !isLoading) {
            router.replace('/Profile')
        }
    }, [isAuthenticated, isLoading]);


    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendOTP = () => {
        setStep(2);
        setResendTimer(30);
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setErrors({...errors, otp: "Please enter a valid 6-digit OTP"});
            return;
        }

        try {
            if (otp === '123456') {
                const response = login(phone, 'ejwt72nma9787nnaouystb10357ss080e124n34n23423kj4bn23kj4234n23n42n42kj3n221nkjndasdjgfuxuiho1');
                if (response.success)
                    setShowSuccessModal(true);
            }
        } catch (error) {
            setErrors({...errors, otp: "Invalid phone number"});
            Alert.alert('Error', error);
        }
    };

    const handleResendOTP = () => {
        if (resendTimer > 0) return;
        setOtp("");
        setErrors({...errors, otp: ""});
        setResendTimer(30);
    };

    const disabled = phone.length !== 10;

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconWrapper}>
                            <Phone size={32} color={styles.iconAccent.color}/>
                        </View>
                        <Text style={styles.headerTitle}>
                            Welcome!
                        </Text>
                        <ActivityIndicator size={'large'} color={theme.colors.accent}/>
                        <Text style={styles.headerSubtitle}>
                            Loading...
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <Phone size={32} color={styles.iconAccent.color}/>
                    </View>
                    <Text style={styles.headerTitle}>
                        {step === 1 ? "Welcome!" : "Verify OTP"}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {step === 1
                            ? "Enter your phone number to continue"
                            : `We've sent a code to +91 ${phone}`}
                    </Text>
                </View>

                {/* Card */}
                <View style={styles.formCard}>
                    {step === 1 ? (
                        <>
                            <RenderFormField
                                label="Phone Number"
                                inputType="phone"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter 10-digit mobile number"
                                icon={<Phone size={20} color={styles.iconMuted.color}/>}
                                textColor={'#000'}
                                error={errors.phone}
                                maxLength={10}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    disabled && styles.buttonDisabled,
                                ]}
                                onPress={handleSendOTP}
                                disabled={disabled}
                            >
                                <Text style={styles.primaryButtonText}>Send OTP</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <RenderFormField
                                label="Enter OTP"
                                inputType="numeric"
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="6-digit code"
                                maxLength={6}
                                icon={<Lock size={20} color={styles.iconMuted.color}/>}
                                textColor={'#000'}
                                error={errors.otp}
                            />

                            <View style={styles.otpHint}>
                                <Text style={styles.otpHintText}>
                                    For demo, use OTP:{" "}
                                    <Text style={styles.otpHintBold}>123456</Text>
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    otp.length !== 6 && styles.buttonDisabled,
                                ]}
                                onPress={handleVerifyOTP}
                                disabled={otp.length !== 6}
                            >
                                <Text style={styles.primaryButtonText}>Verify OTP</Text>
                            </TouchableOpacity>

                            <View style={styles.otpActions}>
                                <TouchableOpacity
                                    onPress={handleResendOTP}
                                    disabled={resendTimer > 0}
                                >
                                    <Text
                                        style={[
                                            styles.resendLink,
                                            resendTimer > 0 && styles.resendDisabled,
                                        ]}
                                    >
                                        {resendTimer > 0
                                            ? `Resend in ${resendTimer}s`
                                            : "Resend OTP"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>

            <SuccessModal
                visible={showSuccessModal}
                onAnimationComplete={() => {
                    setShowSuccessModal(false);
                    router.replace("/Profile");
                }}
                title="Logged in"
                subtitle="Welcome Back! Redirecting to Home page..."
            />
        </SafeAreaView>
    );
};

export default SellerLogin;

/* ================= STYLES ================= */

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },

        content: {
            flex: 1,
            padding: theme.spacing.lg,
            justifyContent: "center",
        },

        header: {
            alignItems: "center",
            marginBottom: theme.spacing.xl,
        },

        iconWrapper: {
            width: 72,
            height: 72,
            backgroundColor: theme.colors.accent,
            borderRadius: 36,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
        },

        headerTitle: {
            fontSize: theme.fontSize.xxxl,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
        },

        headerSubtitle: {
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
            textAlign: "center",
            lineHeight: 20,
        },

        formCard: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.md,
            padding: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        primaryButton: {
            backgroundColor: theme.colors.accent,
            borderRadius: theme.radius.md,
            paddingVertical: theme.spacing.md,
            alignItems: "center",
            marginTop: theme.spacing.lg,
        },

        buttonDisabled: {
            backgroundColor: theme.colors.border,
        },

        primaryButtonText: {
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.accentText,
        },

        otpHint: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            marginTop: theme.spacing.sm,
            borderLeftWidth: 3,
            borderLeftColor: theme.colors.warning,
        },

        otpHintText: {
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
        },

        otpHintBold: {
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
        },

        otpActions: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: theme.spacing.md,
        },

        resendLink: {
            fontSize: theme.fontSize.sm,
            color: theme.colors.info,
            fontWeight: theme.fontWeight.medium,
        },

        resendDisabled: {
            color: theme.colors.textMuted,
        },

        /* Icon helpers */
        iconAccent: {color: theme.colors.accentText},
        iconMuted: {color: theme.colors.textMuted},
        inputText: {color: theme.colors.background},
    });
