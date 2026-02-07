import {Tabs} from "expo-router";
import {HomeIcon, ShoppingCart, BaggageClaim, User, LucideLayoutDashboard} from "lucide-react-native";
import {useCartCount} from "../hooks/useCartCount";

export default function RootLayout() {
    const itemCount = useCartCount()
    return <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveBackgroundColor: '#f5f5f5',
            tabBarActiveTintColor: '#0c831f',
            tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: 'Georgnpx expia',
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

        <Tabs.Screen
            name='Categories'
            options={{
                title: 'Categories',
                tabBarLabel: 'Categories',
                tabBarIcon: ({color, size}) => (
                    <LucideLayoutDashboard size={size} color={color}/>
                )
            }}
            />
        <Tabs.Screen
            name='(auth)'
            options={{
                title: 'Auth',
                tabBarLabel: 'Auth',
                tabBarIcon: ({color, size}) => (
                    <User color={color} size={size}/>
                )
            }}/>

    {/*    NULL / EMPTY PAGES*/}
        <Tabs.Screen
            name='Checkout'
            options={{
                href: null
            }}/>
        <Tabs.Screen
            name='Search'
            options={{
                href: null
            }}/>
    </Tabs>;
}