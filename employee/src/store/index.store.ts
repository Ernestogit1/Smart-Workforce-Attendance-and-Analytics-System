import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import { attendanceReducer } from './slices/attendance.slice'
import { leaveReducer } from './slices/leaveRequeast.slice'
import { attendanceHistoryReducer } from './slices/attendanceHistory.slice'
import { employeeReportReducer } from './slices/employeeReport.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    attendanceHistory: attendanceHistoryReducer,
    employeeReport: employeeReportReducer, // added
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch