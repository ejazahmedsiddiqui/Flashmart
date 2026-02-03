import {Tabs} from "expo-router";
import {HomeIcon, ShoppingCart} from "lucide-react-native";
import {useCartCount} from "../store/cartStore";

export default function RootLayout() {
    const itemCount = useCartCount()
    return <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#f5f5f5',
            tabBarActiveTintColor: '#0c831f',
            tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: 'Georgia',
                fontWeight: 300,
            },
        }}>
        <Tabs.Screen
            name='(home)'
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
                tabBarBadge: itemCount,
            }}/>
    </Tabs>;
}