import {SafeAreaView} from "react-native-safe-area-context";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View, KeyboardAvoidingView, Platform, ScrollView, Dimensions,
} from "react-native";
import {router} from "expo-router";
import React from "react";
import {
    ChevronRight, Home, User
} from "lucide-react-native";
import SuccessModal from "../../components/SuccessModal";

const {height} = Dimensions.get('window');
const Profile = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formCard}>
                        <View style={styles.header}>
                            <View style={styles.iconWrapper}>
                                <User size={36} color="#fff"/>
                            </View>
                            <Text style={styles.headerTitle}>Profile</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoLeft}>
                                    <View style={styles.infoIcon}>
                                        <User size={18} color="#93BD57"/>
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
                        <View style={styles.actionCard}>
                            <TouchableOpacity
                                style={styles.actionRow}
                                onPress={() => router.push("/Orders")}
                                activeOpacity={0.8}
                            >
                                <View style={styles.actionLeft}>
                                    <Home size={18} color="#0F172A"/>
                                    <Text style={styles.actionText}>My Orders</Text>
                                </View>
                                <ChevronRight size={18} color="#94A3B8"/>
                            </TouchableOpacity>

                            <View style={styles.divider}/>

                            <TouchableOpacity
                                style={styles.actionRow}
                                onPress={() => router.push("/Address")}
                                activeOpacity={0.8}
                            >
                                <View style={styles.actionLeft}>
                                    <Home size={18} color="#0F172A"/>
                                    <Text style={styles.actionText}>Saved Addresses</Text>
                                </View>
                                <ChevronRight size={18} color="#94A3B8"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                            ]}
                            onPress={() => setShowModal(true)}
                        >
                            <Text style={styles.nextButtonText}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <SuccessModal
                visible={showModal}
                autoCloseDuration={3000}
                onAnimationComplete={() => {
                    setShowModal(false)
                    router.push('/Profile')
                }}
                title={'Logged Out'} progressBarColor={'#CA0B00'}
                iconColor={'#880700'}
                iconBackgroundColor={'#ff655e'}
                subtitle={'Logged Out Successfully. Redirecting to Home...'}
            />
        </SafeAreaView>
    );
};

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 8,
    },
    iconWrapper: {
        width: 72,
        height: 72,
        backgroundColor: '#93BD57',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#93BD57',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTitle: {
        fontFamily: 'Montserrat',
        fontSize: 26,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '400',
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },
    formSection: {
        width: '100%',
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(156,156,156,0.2)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(156,156,156,0.2)',
    },
    sectionTitle: {
        fontFamily: 'Montserrat',
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    sectionSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '400',
        color: '#64748B',
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#CA0B00',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 2px rgba(202, 11, 0, 0.5)'
    },

    nextButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 32,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalBody: {
        gap: 16,
        marginBottom: 24,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    modalSaveButton: {
        flex: 1,
        backgroundColor: '#93BD57',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalSaveText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    /* ===== Profile Info ===== */
    infoCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(147,189,87,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    infoLabel: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        color: '#64748B',
    },

    infoValue: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 2,
    },

    /* ===== Actions ===== */
    actionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginTop: 20,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },

    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    actionText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },

    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 20,
    },

    /* ===== Logout ===== */
    logoutWrapper: {
        marginTop: 28,
    },

    logoutButton: {
        backgroundColor: '#FEE2E2',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },

    logoutText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#B91C1C',
    },

});