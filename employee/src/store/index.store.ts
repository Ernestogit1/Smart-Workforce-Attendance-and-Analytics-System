import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import { attendanceReducer } from './slices/attendance.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer, // added
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch