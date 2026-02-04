import {useCartStore} from "../store/cartStore";

export const useCartCount = () =>
    useCartStore(state => Object.keys(state.itemsByKey).length);
