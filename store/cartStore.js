// Using Zustand with React Query for cart management
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            // Helper to create unique cart key
            getCartKey: (productId, variantSku) => `${productId}-${variantSku}`,

            addItem: (product) => {
                const items = get().items;
                const cartKey = get().getCartKey(product.id, product.variantSku);
                const existingItem = items.find(item => item.cartKey === cartKey);

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.cartKey === cartKey
                                ? {...item, quantity: item.quantity + 1}
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [...items, {...product, cartKey, quantity: 1}],
                    });
                }
            },

            removeItem: (cartKey) => {
                set({items: get().items.filter(item => item.cartKey !== cartKey)});
            },

            updateQuantity: (cartKey, quantity) => {
                if (quantity < 1) {
                    get().removeItem(cartKey);
                    return;
                }
                set({
                    items: get().items.map(item =>
                        item.cartKey === cartKey ? {...item, quantity} : item
                    ),
                });
            },

            incrementQuantity: (cartKey) => {
                set({
                    items: get().items.map(item =>
                        item.cartKey === cartKey ? {...item, quantity: item.quantity + 1} : item
                    ),
                });
            },

            decrementQuantity: (cartKey) => {
                const item = get().items.find(item => item.cartKey === cartKey);
                if (item && item.quantity > 1) {
                    set({
                        items: get().items.map(item =>
                            item.cartKey === cartKey ? {...item, quantity: item.quantity - 1} : item
                        ),
                    });
                } else {
                    get().removeItem(cartKey);
                }
            },

            clearCart: () => set({items: []}),

            getItemQuantity: (productId, variantSku) => {
                const cartKey = get().getCartKey(productId, variantSku);
                const item = get().items.find(item => item.cartKey === cartKey);
                return item ? item.quantity : 0;
            },

            getItemByCartKey: (cartKey) =>
                get().items.find(item => item.cartKey === cartKey),

        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Selector hooks for computed values
export const useCartItems = () => useCartStore(state => state.items);
export const useCartCount = () => useCartStore(state => state.items.length);
export const useCartSubtotal = () => useCartStore(state =>
    state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);