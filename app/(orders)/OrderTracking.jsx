import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Linking,
    Dimensions,
} from "react-native";
import MapView, {
    Marker,
    Polyline,
    AnimatedRegion,
} from "react-native-maps";
import {SafeAreaView} from "react-native-safe-area-context";
import {Motorbike, User, MessageCircle, Phone, ArrowLeft, X} from "lucide-react-native";
import {useLocalSearchParams, router} from "expo-router";
import {useThemeStore} from "../../store/themeStore";

const {height} = Dimensions.get("window");

export default function OrderTracking() {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const mapRef = useRef(null);
    const params = useLocalSearchParams();
    const shopName = params?.shopName || "Your Shop"

    const userLocation = {
        latitude: 28.6129,
        longitude: 77.2295,
    };

    const routeCoordinates = [
        {latitude: 28.6200, longitude: 77.2100},
        {latitude: 28.6180, longitude: 77.2150},
        {latitude: 28.6160, longitude: 77.2200},
        {latitude: 28.6140, longitude: 77.2250},
        {latitude: 28.6129, longitude: 77.2295},
    ];

    const animatedDriver = useRef(
        new AnimatedRegion({
            latitude: routeCoordinates[0].latitude,
            longitude: routeCoordinates[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        })
    ).current;

    const [chatVisible, setChatVisible] = useState(false);
    const [status, setStatus] = useState("I am on my way");
    const [eta, setEta] = useState("12 mins");

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < routeCoordinates.length - 1) {
                index++;

                animatedDriver.timing({
                    latitude: routeCoordinates[index].latitude,
                    longitude: routeCoordinates[index].longitude,
                    duration: 2000,
                    useNativeDriver: false,
                }).start();

                mapRef.current?.animateCamera({
                    center: routeCoordinates[index],
                    zoom: 15,
                });

                if (index === routeCoordinates.length - 2) {
                    setStatus("I have reached your location");
                    setEta("Arriving");
                }
            } else {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const callDriver = () => {
        Linking.openURL(`tel:9876543210`);
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={theme.colors.textPrimary}/>
                </TouchableOpacity>

                <Text style={styles.shopName}>{shopName}</Text>

                <View style={{width: 30}}/>
            </SafeAreaView>

            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: routeCoordinates[0].latitude,
                    longitude: routeCoordinates[0].longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Polyline coordinates={routeCoordinates} strokeWidth={4}/>

                <Marker coordinate={userLocation}>
                    <View style={styles.userMarkerWrapper}>
                        <View style={styles.iconContainer}>
                            <User size={26} color={theme.colors.textPrimary}/>
                        </View>
                        <View style={styles.markerArrow}/>
                    </View>
                </Marker>

                <Marker.Animated coordinate={animatedDriver}>
                    <View style={styles.iconContainer}>
                        <Motorbike size={30} color={theme.colors.textPrimary}/>
                    </View>
                </Marker.Animated>
            </MapView>

            {/* BOTTOM PANEL */}
            <SafeAreaView style={styles.bottomCard}>
                {/* Top row: avatar + info + action icons */}
                <View style={styles.topRow}>
                    {/* Driver Avatar */}
                    <View style={styles.driverAvatarWrapper}>
                        <View style={styles.driverAvatar}>
                            <Motorbike size={26} color={"#fff"}/>
                        </View>
                    </View>

                    {/* Driver Info */}
                    <View style={{flex: 1, marginLeft: 12}}>
                        <Text style={styles.driverName}>Rahul Verma</Text>
                        <Text style={styles.driverSubtitle}>Delivered 500+ orders</Text>
                    </View>

                    {/* Action Icon Buttons */}
                    <View style={styles.iconActions}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => setChatVisible(true)}
                        >
                            <MessageCircle size={20} color={"#e23744"}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.iconBtn, {marginLeft: 10}]}
                            onPress={callDriver}
                        >
                            <Phone size={20} color={"#e23744"}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Status Pill */}
                <View style={styles.statusPill}>
                    <View style={styles.speechTailBorder} />
                    <View style={styles.speechTailFill} />
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </SafeAreaView>

            {/* CHAT MODAL */}
            <Modal visible={chatVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.chatBox}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                        }}>

                            <Text style={styles.chatTitle}>Chat with Driver</Text>
                            <TouchableOpacity
                                style={styles.chatTitle}
                                onPress={() => setChatVisible(false)}
                            >
                                <X size={20} color={'#000'}/>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="Type a message..."
                            style={styles.input}
                        />


                    </View>
                </View>
            </Modal>
        </View>
    )
        ;
}

const createStyles = (theme) => StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},

    header: {
        position: "absolute",
        top: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme.colors.background,
        zIndex: 10,
        elevation: 8,

    },

    backBtn: {
        padding: 6,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 50,
    },

    shopName: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
    },

    iconContainer: {
        backgroundColor: theme.colors.background,
        padding: 6,
        borderRadius: 50,
        elevation: 5,
    },
    bottomCard: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: theme.colors.background,
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    driverAvatarWrapper: {
        position: "relative",
    },

    driverAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#e23744",
        alignItems: "center",
        justifyContent: "center",
    },

    driverName: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.textPrimary,
    },

    driverSubtitle: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },

    iconActions: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff0f1",
        borderWidth: 1.5,
        borderColor: "#ffd0d4",
        alignItems: "center",
        justifyContent: "center",
    },

    statusPill: {
        marginTop: 14,
        backgroundColor: "#f0faf0",
        borderWidth: 1,
        borderColor: "#c3e6cb",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    speechTailBorder: {
        position: "absolute",
        top: -8,
        left: 20,
        width: 0,
        height: 0,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 8,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#c3e6cb",
    },

    speechTailFill: {
        position: "absolute",
        top: -6,
        left: 21,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 7,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#f0faf0",
    },
    statusText: {
        fontSize: 14,
        color: "#2d6a4f",
        fontWeight: "500",
    },

    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    chatBox: {
        height: height * 0.4,
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    chatTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 10,
    },

    closeBtn: {
        marginTop: 20,
        alignSelf: "flex-end",
    },
});