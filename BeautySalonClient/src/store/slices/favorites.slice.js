import { createSlice } from "@reduxjs/toolkit";

const initialState =[]

export const cartSlice= createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart:(state,{payload:recipe})=>{
            const isExists = state.some(r=>r.id===recipe.id);
            if(isExists){
                const index = state.findIndex(item=> item.id === recipe.id);
                if(index!== -1){
                    state.splice(index,1)
                }
            }else{
                state.push(recipe)
            }
        },
        removeCart:(state)=>{
        state.splice(0,state.length)
    }}
})
export const {actions,reducer,toggleCart,removeCart} = cartSlice;