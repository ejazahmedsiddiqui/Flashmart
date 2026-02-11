import {Stack, usePathname} from "expo-router";
import Footer from "../components/Footer"; // Adjust the path based on where you place the Footer component
import {View, StyleSheet, StatusBar} from "react-native";
import {UserProvider} from "../context/UserContext";

export default function RootLayout() {
    const pathname = usePathname();

    // Routes where footer should be hidden
    const hideFooterRoutes = ['/Checkout', '/Search', '/SubCategory'];
    const shouldShowFooter = !hideFooterRoutes.some(route => pathname.includes(route));

    return (
        <UserProvider>
            <StatusBar style={"auto"} />
            <View style={styles.container}>

                <Stack
                    screenOptions={{
                        headerShown: false,
                        // animation: 'none',
                        animation: 'fade',
                        animationDuration: 150,
                    }}>
                    <Stack.Screen name='(home)'/>
                    <Stack.Screen name='Cart'/>
                    <Stack.Screen name='(categories)'/>
                    <Stack.Screen name='(auth)'/>
                    <Stack.Screen name='(profile)'/>
                    <Stack.Screen name='Checkout'/>
                    <Stack.Screen name='Search'/>
                </Stack>
                {shouldShowFooter && <Footer/>}
            </View>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});