import {Stack} from "expo-router";

const BannerLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name='[banner]'
                options={{
                    title: 'Banner Details',
                }}
            />
        </Stack>
    )
};
export default BannerLayout;