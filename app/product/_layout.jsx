import {Stack} from "expo-router";

const ProductLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name='[product]'
                options={{
                    title: 'Product Details',
                }}
                />
        </Stack>
    )
};
export default ProductLayout;