import { useSelector } from "react-redux";

export const useCart = () => {
    const cart = useSelector(state => state.cart);
    
    const totalItems = cart.items.reduce((acc, item) => acc + item.count, 0);
    const totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.count), 0);
    
    return {
        cart,
        items: cart.items,
        cartId: cart.cartId,
        totalItems,
        totalPrice,
        loading: cart.status === 'loading',
        error: cart.error
    };
}