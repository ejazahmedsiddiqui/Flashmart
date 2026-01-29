import {Stack, Tabs} from "expo-router";
import {HomeIcon, ShoppingCart} from "lucide-react-native";

export default function RootLayout() {
    return <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#f5f5f5',
            tabBarActiveTintColor: '#ff03c1',
            tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: 'Georgia',
                fontWeight: 300,
            },

        }}>
        <Tabs.Screen
            name='index'
            options={{
                title: 'Home',
                tabBarLabel: 'Home',
                tabBarIcon: ({color, size}) => (
                    <HomeIcon color={color} size={size}/>
                )
            }}/>
        <Tabs.Screen
            name='Cart'
            options={{
                title: 'Cart',
                tabBarLabel: 'Cart',
                tabBarIcon: ({color, size}) => (
                    <ShoppingCart color={color} size={size}/>
                ),
                tabBarBadge: 3,
            }}/>
    </Tabs>;
}
