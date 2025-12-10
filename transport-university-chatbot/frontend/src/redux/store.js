import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slide/counterSlide.js'
import userReducer from './slide/userSlide.js'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
})