import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import employeeAccMakerReducer from './slices/employeeAccMaker.slice'
import employeeDataTableReducer from './slices/employeeDataTable.slice'
import employeeUpdateReducer from './slices/employeeUpdate.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employeeAccMaker: employeeAccMakerReducer,
    employeeDataTable: employeeDataTableReducer,
    employeeUpdate: employeeUpdateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch