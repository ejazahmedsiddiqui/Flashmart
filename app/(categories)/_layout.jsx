import {Stack} from "expo-router";

export default function CategoriesLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Categories"
                options={{
                    title: 'Categories',
                }}
            />
            <Stack.Screen
                name="SubCategory"
                options={{
                    title: 'Sub Category',
                    presentation: 'card',
                }}
            />
        </Stack>
    );
}