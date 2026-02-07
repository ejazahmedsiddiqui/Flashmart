import {ShoppingBasket, Home, Heart, Coffee, Package} from 'lucide-react-native'
export const categories = [
    {
        id: "groceries_kitchen",
        label: "Groceries & Kitchen",
        icon: ShoppingBasket,
        active: true,
    },
    {
        id: "household_essentials",
        label: "Household Essentials",
        icon: Home,
        active: true,
    },
    {
        id: "personal_care",
        label: "Personal Care",
        icon: Heart,
        active: true,
    },
    {
        id: "beverages",
        label: "Beverages",
        icon: Coffee,
        active: false,
    },
    {
        id: "snacks_packaged",
        label: "Snacks & Packaged Food",
        icon: Package,
        active: true,
    },
];
