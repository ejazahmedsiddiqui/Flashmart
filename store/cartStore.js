import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCartStore = create(
    persist(
        (set, get) => ({
            itemsByKey: {},

            getCartKey: (productId, variantSku) =>
                `${productId}-${variantSku}`,

            addItem: ({ id, variantSku, price, originalPrice, name, image, brand, weight }) => {
                const cartKey = `${id}-${variantSku}`;

                set(state => ({
                    itemsByKey: {
                        ...state.itemsByKey,
                        [cartKey]: {
                            cartKey,          // ✅ REQUIRED
                            id,
                            variantSku,
                            name,
                            image,
                            brand,
                            weight,
                            price,
                            originalPrice,
                            quantity: (state.itemsByKey[cartKey]?.quantity ?? 0) + 1,
                        },
                    },
                }));
            },


            incrementQuantity: key => {
                const item = get().itemsByKey[key];
                if (!item) return;

                set(state => ({
                    itemsByKey: {
                        ...state.itemsByKey,
                        [key]: { ...item, quantity: item.quantity + 1 },
                    },
                }));
            },

            decrementQuantity: key => {
                const item = get().itemsByKey[key];
                if (!item) return;

                if (item.quantity === 1) {
                    const { [key]: _, ...rest } = get().itemsByKey;
                    set({ itemsByKey: rest });
                } else {
                    set(state => ({
                        itemsByKey: {
                            ...state.itemsByKey,
                            [key]: { ...item, quantity: item.quantity - 1 },
                        },
                    }));
                }
            },

            removeItem: key =>
                set(state => {
                    const { [key]: _, ...rest } = state.itemsByKey;
                    return { itemsByKey: rest };
                }),

            clearCart: () => set({ itemsByKey: {} }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
