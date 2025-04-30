import { bindActionCreators } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { clearCart, fetchUserCart, addToCart, increaseProductCount, decreaseProductCount } from '../store/slices/cart.slice';

const rootActions = {
    clearCart,
    fetchUserCart,
    addToCart,
    increaseProductCount,
    decreaseProductCount
}

export const useCartActions = () => {
    const dispatch = useDispatch();
    return useMemo(() =>
        bindActionCreators(rootActions, dispatch)
    , [dispatch])
}
