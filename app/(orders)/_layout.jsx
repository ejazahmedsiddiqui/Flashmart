import {Stack} from "expo-router";

export default function OrdersLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Orders"
                options={{
                    title: 'Orders',
                }}
            />
            <Stack.Screen
                name="order-detail"
                options={{
                    title: 'Order Details',
                }}
            />
        </Stack>
    );
}