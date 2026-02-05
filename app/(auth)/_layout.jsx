import {Stack} from "expo-router";

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Login"
                options={{
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name="Register"
                options={{
                    title: 'Register',
                }}
            />
        </Stack>
    );
}