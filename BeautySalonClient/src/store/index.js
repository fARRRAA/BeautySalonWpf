import { configureStore,combineReducers } from "@reduxjs/toolkit";
import  userReducer  from "./slices/userSlice";
import { reducer as cartReducer } from "./slices/cart.slice";

const reducers = combineReducers({
    cart: cartReducer,
    user: userReducer
})

export const store = configureStore({
    reducer: reducers
});
