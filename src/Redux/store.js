import { configureStore } from '@reduxjs/toolkit'
import authReducer from './AuthSlice'
import userReducer from './UserSlice'
import chatReducer from './ChatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, 
    chat: chatReducer,
  },
})