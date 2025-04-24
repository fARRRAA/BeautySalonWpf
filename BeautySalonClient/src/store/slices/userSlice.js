import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    email: null,
    phone: null,
    role: null,
    isEmailConfirmed:null,
    isAuth:false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, {payload}) => {
            state.id = payload.id;
            state.email = payload.email;
            state.phone = payload.phone;
            state.role = payload.role;
            state.isEmailConfirmed=payload.isEmailConfirmed;
            state.isAuth=true;
        },
    
        removeUser: (state) => {
            state.email = null;
            state.phone = null;
            state.id = null;
            state.role = null;
            state.isEmailConfirmed=null;
            state.isAuth=false;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
