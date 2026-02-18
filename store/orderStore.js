import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const useOrderStore = create(
    persist(
        (set, get) => ({
            orders: [],

            /**
             * Place a new order from the current cart snapshot.
             *
             * @param {Object} params
             * @param {Array}  params.cartItems      - array of cart item objects
             * @param {Object} params.address        - selected delivery address
             * @param {Object} params.shop           - selected shop
             * @param {number} params.subtotal
             * @param {number} params.savings
             * @param {number} params.deliveryFee
             * @param {number} params.total
             * @param {string} [params.paymentMethod='COD']
             * @returns {Object} the newly created order
             */
            placeOrder: ({ cartItems, address, shop, subtotal, savings, deliveryFee, total, paymentMethod = 'COD' }) => {
                const now = new Date();
                const id = `ORD-${now.getTime()}`;

                const newOrder = {
                    id,
                    date: formatDate(now),
                    orderStatus: 'pending',
                    paymentMethod,
                    paymentStatus: 'pending',
                    deliveryPartner: 'pending',
                    subtotal,
                    savings,
                    deliveryFee,
                    total,
                    address,
                    shop,
                    items: cartItems.map(item => ({ ...item })), // snapshot
                };

                set(state => ({
                    orders: [newOrder, ...state.orders], // newest first
                }));

                return newOrder;
            },

            getOrderById: (id) => get().orders.find(o => o.id === id) ?? null,

            updateOrderStatus: (id, orderStatus) => {
                set(state => ({
                    orders: state.orders.map(o =>
                        o.id === id ? { ...o, orderStatus } : o
                    ),
                }));
            },

            updatePaymentStatus: (id, paymentStatus) => {
                set(state => ({
                    orders: state.orders.map(o =>
                        o.id === id ? { ...o, paymentStatus } : o
                    ),
                }));
            },

            assignDeliveryPartner: (id, deliveryPartner) => {
                set(state => ({
                    orders: state.orders.map(o =>
                        o.id === id ? { ...o, deliveryPartner } : o
                    ),
                }));
            },

            clearOrders: () => set({ orders: [] }),
        }),
        {
            name: 'order-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);