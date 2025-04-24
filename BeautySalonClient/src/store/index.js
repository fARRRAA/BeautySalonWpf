import { configureStore,combineReducers } from "@reduxjs/toolkit";
import  userReducer  from "./slices/userSlice";
import { reducer as favoriteReducer } from "./slices/favorites.slice";

const reducers = combineReducers({
    favorites: favoriteReducer,
    user: userReducer
})

export const store = configureStore({
    reducer: reducers
});
