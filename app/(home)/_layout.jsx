import {Stack} from "expo-router";

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Stack.Screen
                name="[product]"
                options={{
                    title: 'Product Details',
                    presentation: 'card', // Makes it feel like a proper stack navigation
                }}
            />
        </Stack>
    );
}