import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    access: null,
    refresh: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        clearAuth: (state) => {
            state.access = null;
            state.refresh = null;
        }
    },
});

// Action creators are generated for each case reducer function
export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
