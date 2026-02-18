import {StyleSheet, Text, TouchableOpacity, View, Linking} from 'react-native'
import React, {useMemo} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Phone, MailPlus, ChevronLeft, HandHelping} from "lucide-react-native";
import {router} from "expo-router";
import {useThemeStore} from "../../store/themeStore";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const UserHelp = () => {
    const phoneNumber = '+91 9718925775';
    const emailAddress = 'support@example.com';
    const whatsappNumber = '+91 9718925775';
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const handlePhonePress = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${emailAddress}`);
    };

    const handleWhatsAppPress = () => {
        // Remove any non-numeric characters except the leading +
        const formattedNumber = whatsappNumber.replace(/[^0-9+]/g, '');
        Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.backHeader}>
                {router.canGoBack() && <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        router.back();
                    }}>
                    <ChevronLeft size={24} color={theme.colors.textPrimary}/>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginHorizontal: 5,
                        color: theme.colors.textPrimary,
                    }}>Back</Text>
                </TouchableOpacity>}
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <HandHelping size={36} color={'#fff'}/>
                    </View>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Need Help?</Text>
                    </View>
                </View>
                <View
                    style={{
                        justifyContent: 'space-between',
                        gap: 12,
                    }}>


                    <TouchableOpacity style={styles.infoCard}
                                      onPress={handlePhonePress}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <View style={styles.infoIcon}>
                                    <Phone size={18} color={theme.colors.accent}/>
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Call us at</Text>
                                    <Text style={styles.infoValue}>
                                        +91 8452 1458 45
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoCard}
                                      onPress={handleEmailPress}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <View style={styles.infoIcon}>
                                    <MailPlus size={18} color={theme.colors.accent}/>
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Email to us at: </Text>
                                    <Text style={styles.infoValue}>
                                        example.email@gmail.com
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoCard}
                                      onPress={handleWhatsAppPress}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <View style={styles.infoIcon}>
                                    <FontAwesome name="whatsapp" size={24} color={theme.colors.accent}/>
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Message us on WhatsApp</Text>
                                    <Text style={styles.infoValue}>
                                        +91 8452 1458 45
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default UserHelp

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 12,
    },
    backHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        backgroundColor: theme.colors.background,
    },
    backButton: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 24,
        gap: 8,
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.textPrimary,
    },
    content: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
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
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        fontFamily: 'Montserrat',
        marginBottom: 8,
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        fontFamily: 'Montserrat',
        marginBottom: 24,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderWidth: 2,
        borderColor: theme.colors.border,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    whatsappIconContainer: {
        backgroundColor: theme.colors.card,
    },
    textContainer: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: 'Montserrat',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        fontFamily: 'Montserrat',
    },
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
})