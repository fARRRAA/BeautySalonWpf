import { useSelector } from "react-redux";
import { useMemo } from "react";

export const useCart = () => {
    const cart = useSelector(state => state.cart);
    
    const items = useMemo(() => cart.items || [], [cart.items]);
    
    const totalItems = useMemo(() => 
        items.reduce((acc, item) => acc + item.count, 0), 
        [items]
    );
    
    const totalPrice = useMemo(() => 
        items.reduce((acc, item) => acc + (item.price * item.count), 0), 
        [items]
    );
    
    const loading = useMemo(() => cart.status === 'loading', [cart.status]);
    const error = useMemo(() => cart.error, [cart.error]);
    
    return {
        cart,
        items,
        userId: cart.userId,
        totalItems,
        totalPrice,
        loading,
        error,
        status: cart.status,
    };
}