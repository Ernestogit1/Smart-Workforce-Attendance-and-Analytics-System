import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../index.store'
import { apiGetTodayAttendance, apiTimeIn, apiTimeOut } from '../../api/attendance'

export type Attendance = {
  id: string
  employeeId: string
  date: string
  timeIn: string | null
  timeOut: string | null
  status: 'Present' | 'Late'
  hoursWorked: string
} | null

type State = {
  data: Attendance
  loading: boolean
  error?: string | null
}

const initialState: State = {
  data: null,
  loading: false,
  error: null,
}

export const getTodayAttendanceThunk = createAsyncThunk<Attendance, void, { state: RootState }>(
  'attendance/getToday',
  async (_, { getState }) => {
    const token = getState().auth.token
    if (!token) throw new Error('No token')
    const json = await apiGetTodayAttendance(token)
    return (json?.attendance ?? null) as Attendance
  }
)

export const timeInThunk = createAsyncThunk<Attendance, void, { state: RootState }>(
  'attendance/timeIn',
  async (_, { getState }) => {
    const token = getState().auth.token
    if (!token) throw new Error('No token')
    const json = await apiTimeIn(token)
    return (json?.attendance ?? null) as Attendance
  }
)

export const timeOutThunk = createAsyncThunk<Attendance, void, { state: RootState }>(
  'attendance/timeOut',
  async (_, { getState }) => {
    const token = getState().auth.token
    if (!token) throw new Error('No token')
    const json = await apiTimeOut(token)
    return (json?.attendance ?? null) as Attendance
  }
)

const slice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get today
      .addCase(getTodayAttendanceThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(getTodayAttendanceThunk.fulfilled, (s, a) => {
        s.loading = false
        s.data = a.payload
      })
      .addCase(getTodayAttendanceThunk.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message || 'Failed to load attendance'
      })
      // time in
      .addCase(timeInThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(timeInThunk.fulfilled, (s, a) => {
        s.loading = false
        s.data = a.payload
      })
      .addCase(timeInThunk.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message || 'Failed to time in'
      })
      // time out
      .addCase(timeOutThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(timeOutThunk.fulfilled, (s, a) => {
        s.loading = false
        s.data = a.payload
      })
      .addCase(timeOutThunk.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message || 'Failed to time out'
      })
  },
})

export const attendanceReducer = slice.reducer