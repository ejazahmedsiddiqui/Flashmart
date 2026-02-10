import {Stack} from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                }}
            />
            <Stack.Screen
                name="Address"
                options={{
                    title: 'Address',
                }}
            />
            <Stack.Screen
                name="AddressSetter"
                options={{
                    title: 'Set Address',
                }}
            />
        </Stack>
    );
}