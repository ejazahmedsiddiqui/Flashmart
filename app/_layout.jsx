import {Stack, usePathname} from "expo-router";
import Footer from "../components/Footer"; // Adjust the path based on where you place the Footer component
import {View, StyleSheet, StatusBar, ActivityIndicator, Text} from "react-native";
import {UserProvider} from "../context/UserContext";
import {useThemeStore} from "../store/themeStore";
import {SafeAreaView} from "react-native-safe-area-context";
import {AddressProvider} from "../context/AddressContext";

export default function RootLayout() {
    const pathname = usePathname();
    const hasHydrated = useThemeStore((s) => s._hasHydrated);

    const hideFooterRoutes = ['/Checkout', '/Search', '/SubCategory'];
    const shouldShowFooter = !hideFooterRoutes.some(route => pathname.includes(route));

    if (!hasHydrated) {
        return (
            <SafeAreaView style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#fff'
            }}>
                <ActivityIndicator size="large" color={'blue'}/>
                <Text style={{
                    color: '#1e1e1e'
                }}>
                    Loading...
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <UserProvider>
            <AddressProvider>
                <StatusBar style={"auto"}/>
                <View style={styles.container}>

                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: 'fade',
                            animationDuration: 150,
                        }}>
                        <Stack.Screen name='(home)'/>
                        <Stack.Screen name='Cart'/>
                        <Stack.Screen name='(categories)'/>
                        <Stack.Screen name='(auth)'/>
                        <Stack.Screen name='(profile)'/>
                        <Stack.Screen name='(orders)'/>
                        <Stack.Screen name='Checkout'/>
                        <Stack.Screen name='product'/>
                        <Stack.Screen name='Banner'/>
                        <Stack.Screen name='Search'/>
                    </Stack>
                    {shouldShowFooter && <Footer/>}
                </View>
            </AddressProvider>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});