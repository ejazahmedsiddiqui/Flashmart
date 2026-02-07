import {Stack, usePathname} from "expo-router";
import Footer from "../components/Footer"; // Adjust the path based on where you place the Footer component
import {View, StyleSheet} from "react-native";

export default function RootLayout() {
    const pathname = usePathname();

    // Routes where footer should be hidden
    const hideFooterRoutes = ['/Checkout', '/Search', '/SubCategory'];
    const shouldShowFooter = !hideFooterRoutes.some(route => pathname.includes(route));

    return (
        <View style={styles.container}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    // animation: 'none',
                    animation: 'fade',
                    animationDuration: 150,
                }}>
                <Stack.Screen name='(home)' />
                <Stack.Screen name='Cart' />
                <Stack.Screen name='(categories)' />
                <Stack.Screen name='(auth)' />
                <Stack.Screen name='Checkout' />
                <Stack.Screen name='Search' />
            </Stack>
            {shouldShowFooter && <Footer />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});