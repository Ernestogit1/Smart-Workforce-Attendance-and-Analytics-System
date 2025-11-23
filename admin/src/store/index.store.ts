import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import employeeAccMakerReducer from './slices/employeeAccMaker.slice'
import employeeDataTableReducer from './slices/employeeDataTable.slice'
import employeeUpdateReducer from './slices/employeeUpdate.slice'
import { monitorAttendanceReducer } from './slices/monitorAttendance.slice'
import leavRequeastReducer from './slices/leavRequeast.slice' // add

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employeeAccMaker: employeeAccMakerReducer,
    employeeDataTable: employeeDataTableReducer,
    employeeUpdate: employeeUpdateReducer,
    monitorAttendance: monitorAttendanceReducer,
    leavRequeast: leavRequeastReducer, // add
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch