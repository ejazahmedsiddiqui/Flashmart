// hooks/useCart.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';

export const useCartSync = () => {
    const queryClient = useQueryClient();

    // Fetch cart from server
    const { data: serverCart } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCartFromServer,
        // Sync server cart with local on mount
        onSuccess: (data) => {
            useCartStore.setState({ items: data.items });
        },
    });

    // Sync local changes to server
    const syncMutation = useMutation({
        mutationFn: syncCartToServer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return { serverCart, syncMutation };
};