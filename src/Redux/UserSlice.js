import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload.username;
        },
        clearUser: (state, action) => {
            state.username = ''
        }
    },
});

export const { setUsername, clearUser } = userSlice.actions;

export default userSlice.reducer;
