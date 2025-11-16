import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../index.store'
import type { Attendance } from './attendance.slice'
import { apiGetAttendanceHistory } from '../../api/attendance'

type HistoryState = {
  items: Attendance[]
  loading: boolean
  error?: string | null
}

const initialState: HistoryState = {
  items: [],
  loading: false,
  error: null,
}

export const loadAttendanceHistoryThunk = createAsyncThunk<Attendance[], { limit?: number; start?: string; end?: string } | void, { state: RootState }>(
  'attendanceHistory/load',
  async (params, { getState }) => {
    const token = getState().auth.token
    if (!token) throw new Error('No token')
    const json = await apiGetAttendanceHistory(token, params || { limit: 50 })
    return (json?.items ?? []) as Attendance[]
  }
)

const slice = createSlice({
  name: 'attendanceHistory',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(loadAttendanceHistoryThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(loadAttendanceHistoryThunk.fulfilled, (s, a) => {
        s.loading = false
        s.items = a.payload
      })
      .addCase(loadAttendanceHistoryThunk.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message || 'Failed to load attendance history'
      })
  },
})

export const attendanceHistoryReducer = slice.reducer
export const selectAttendanceHistory = (s: RootState) => s.attendanceHistory