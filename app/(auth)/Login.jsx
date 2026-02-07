import {SafeAreaView} from "react-native-safe-area-context";
import {Text, StyleSheet, View, TouchableOpacity, Animated, Modal} from "react-native";
import React, {useState, useRef, useEffect} from "react";
import {Phone, Lock, CheckCircle2, LucideMail} from 'lucide-react-native';
import {router} from "expo-router";
import RenderFormField from "../../components/RenderFormField";
import SuccessModal from "../../components/SuccessModal";
import Footer from "../../components/Footer";

const SellerLogin = () => {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({phone: "", otp: ""});
    const [isPhone, setIsPhone] = useState(true);
    const [resendTimer, setResendTimer] = useState(0);

    // Animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const checkScaleAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('@/app/auth/Login -> Login Page Accessed');
    }, []);


    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);


    const validateLogin = () => {
        if (isPhone && phone.length !== 10) {
            setErrors({...errors, phone: "Please enter a valid 10-digit phone number"});
            return false;
        }
        if (!isPhone && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors({...errors, email: "Please enter a valid email address"});
            return false;
        }
        setErrors({...errors, phone: ""});
        return true;
    };

    const handleSendOTP = () => {
        if (validateLogin()) {
            console.log("Sending OTP to:", phone || email);
            setStep(2);
            setResendTimer(30); // Start timer
        }
    };

    const handleVerifyOTP = () => {
        // Simulate OTP verification (accept any 6 digit OTP for demo)
        if (otp.length !== 6) {
            setErrors({...errors, otp: "Please enter a valid 6-digit OTP"});
            return;
        }

        // For demo: accept "123456" as correct OTP
        if (otp === "123456") {
            setErrors({...errors, otp: ""});
            showSuccessAnimation();
        } else {
            setErrors({...errors, otp: "Invalid OTP. Try again or resend to " + `${isPhone ? phone : email}`});
        }
    };

    const showSuccessAnimation = () => {
        setShowSuccessModal(true);

        // Modal fade in and scale
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Checkmark animation
            Animated.spring(checkScaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start(() => {
                // Start progress bar animation
                Animated.timing(progressAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false,
                }).start(() => {
                    // Navigate to index after 3 seconds
                    router.replace('/'); // Change 'Index' to your actual route name
                });
            });
        });
    };

    const handleResendOTP = () => {
        if (resendTimer > 0) return;

        setOtp("");
        setErrors({...errors, otp: ""});
        console.log("Resending OTP to:", phone || email);
        setResendTimer(30);
    };

    const handleChangeNumber = () => {
        setStep(1);
        setOtp("");
        setErrors({phone: "", otp: ""});
    };

    const disabled = isPhone ? phone.length !== 10 : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconWrapper}>
                            <Phone size={32} color="#fff" strokeWidth={2.5}/>
                        </View>
                        <Text style={styles.headerTitle}>
                            {step === 1 ? "Welcome Back!" : "Verify OTP"}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {step === 1
                                ? "Enter your phone number to continue"
                                : `We've sent a code to ${isPhone ? '+91 ' + phone : email}`}
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {step === 1 ? (
                            <>
                                {isPhone ? <RenderFormField
                                        label="Phone Number"
                                        inputType="phone"
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="Enter 10-digit mobile number"
                                        icon={<Phone size={20} color="#9CA3AF"/>}
                                        textColor="#1F2937"
                                        error={errors.phone}
                                        maxLength={10}
                                    /> :
                                    <RenderFormField
                                        label="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        icon={<LucideMail size={20} color="#9CA3AF"/>}
                                        textColor="#1F2937"
                                        error={errors.phone}
                                    />}

                                <TouchableOpacity
                                    style={[
                                        styles.primaryButton,
                                        disabled && styles.buttonDisabled]}
                                    onPress={handleSendOTP}
                                    disabled={disabled}
                                >
                                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                                </TouchableOpacity>

                                <View style={styles.divider}>
                                    <View style={styles.dividerLine}/>
                                    <Text style={styles.dividerText}>OR</Text>
                                    <View style={styles.dividerLine}/>
                                </View>

                                <TouchableOpacity style={styles.secondaryButton}
                                                  onPress={() => setIsPhone(!isPhone)}>
                                    {isPhone ? <Text style={styles.secondaryButtonText}>
                                            Continue with Email
                                        </Text> :
                                        <Text style={styles.secondaryButtonText}>
                                            Continue with Phone
                                        </Text>}
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
                                    icon={<Lock size={20} color="#9CA3AF"/>}
                                    textColor="#1F2937"
                                    error={errors.otp}
                                />

                                <View style={styles.otpHint}>
                                    <Text style={styles.otpHintText}>
                                        For demo, use OTP: <Text style={styles.otpHintBold}>123456</Text>
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.primaryButton, otp.length !== 6 && styles.buttonDisabled]}
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
                                        <Text style={[
                                            styles.resendLink,
                                            resendTimer > 0 && styles.resendDisabled // Derive style
                                        ]}>
                                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleChangeNumber}>
                                        <Text style={styles.linkText}>Change Number</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don&apos;t have an account?{" "}
                            <Text style={styles.footerLink} onPress={() => router.push('/Register')}>Register Now</Text>
                        </Text>
                    </View>
                </View>

                {/* Success Modal */}
                <SuccessModal
                    visible={showSuccessModal}
                    onAnimationComplete={() => {
                        setShowSuccessModal(false)
                        router.replace('/');
                    }}
                    subtitle={'Welcome Back! Redirecting to Dashboard...'}
                    title={'Logged in'}
                />
            </SafeAreaView>
        </>
    );
};

export default SellerLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrapper: {
        width: 72,
        height: 72,
        backgroundColor: '#93BD57',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#93BD57',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTitle: {
        fontFamily: 'Montserrat',
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '400',
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    primaryButton: {
        backgroundColor: '#93BD57',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        shadowColor: '#93BD57',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        marginHorizontal: 12,
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    secondaryButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    otpHint: {
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#F59E0B',
    },
    otpHintText: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        fontWeight: '500',
        color: '#92400E',
    },
    otpHintBold: {
        fontWeight: '700',
        color: '#78350F',
    },
    otpActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    resendLink: {
        fontSize: 14,
        color: '#5B5FED',
        fontWeight: '600',
        fontFamily: 'Montserrat',
    },
    resendDisabled: {
        color: '#ccc',
    },
    linkText: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '600',
        color: '#93BD57',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '400',
        color: '#6B7280',
    },
    footerLink: {
        fontWeight: '700',
        color: '#93BD57',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    checkmarkContainer: {
        marginBottom: 24,
    },
    checkmarkCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontFamily: 'Montserrat',
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    successSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '400',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    progressBarContainer: {
        width: '100%',
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#93BD57',
        borderRadius: 2,
    },
});