import { bindActionCreators } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { clearCart, fetchUserCart, addToCart, increaseProductCount, decreaseProductCount, removeFromCart, clearUserCart } from '../store/slices/cart.slice';

const rootActions = {
    clearCart,
    fetchUserCart,
    addToCart,
    increaseProductCount,
    decreaseProductCount,
    removeFromCart,
    clearUserCart
}

export const useCartActions = () => {
    const dispatch = useDispatch();
    return useMemo(() =>
        bindActionCreators(rootActions, dispatch)
    , [dispatch])
}
