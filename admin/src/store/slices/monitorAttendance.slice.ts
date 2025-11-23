import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import type { RootState } from '../../store/index.store'
import { fetchAttendanceRange } from '../../api/monitorAttendance'
import type { RawAttendance } from '../../api/monitorAttendance'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AttendanceLog {
  id: string
  employeeName: string
  date: string
  timeIn?: string | null
  timeOut?: string | null
  status: 'Present' | 'Late' | 'Absent'
  hoursWorked?: string | null
}

export interface MonitorAttendanceState {
  startDate: string | null
  endDate: string | null
  rows: AttendanceLog[]
  loading: boolean
  error: string | null
}

const startDefault = dayjs().startOf('month').format('YYYY-MM-DD')
const endDefault = dayjs().format('YYYY-MM-DD')

const initialState: MonitorAttendanceState = {
  startDate: startDefault,
  endDate: endDefault,
  rows: [],
  loading: false,
  error: null,
}

function normalize(item: RawAttendance, idx: number): AttendanceLog {
  const full =
    item.employeeName ||
    item.employee?.fullName ||
    [item.employee?.firstName, item.employee?.lastName].filter(Boolean).join(' ')
  const statusRaw = (item.status || '').toString()
  let status: 'Present' | 'Late' | 'Absent' = 'Absent'
  if (statusRaw === 'Present' || statusRaw === 'Late') status = statusRaw
  else if (item.timeIn) status = 'Present'
  return {
    id: item.id || `${item.employeeId || 'emp'}-${item.date || idx}`,
    employeeName: full || '—',
    date: item.date || '',
    timeIn: item.timeIn ?? null,
    timeOut: item.timeOut ?? null,
    status,
    hoursWorked: item.hoursWorked ?? '00:00:00',
  }
}

export const loadAttendanceThunk = createAsyncThunk<
  AttendanceLog[],
  void,
  { state: RootState }
>('monitorAttendance/load', async (_, { getState, rejectWithValue }) => {
  const { startDate, endDate } = getState().monitorAttendance
  if (!startDate || !endDate) return rejectWithValue('Missing date range') as any
  const s = dayjs(startDate)
  const e = dayjs(endDate)
  if (e.isBefore(s)) return rejectWithValue('End date cannot be before start date') as any
  try {
    const rawData = await fetchAttendanceRange(startDate, endDate)
    if (!Array.isArray(rawData)) throw new Error('Unexpected response format')
    return rawData.map(normalize)
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.detail || err?.message || 'Failed to fetch attendance'
    ) as any
  }
})

const slice = createSlice({
  name: 'monitorAttendance',
  initialState,
  reducers: {
    setStartDate(state, action: PayloadAction<string | null>) {
      state.startDate = action.payload
    },
    setEndDate(state, action: PayloadAction<string | null>) {
      state.endDate = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: b => {
    b
      .addCase(loadAttendanceThunk.pending, s => {
        s.loading = true
        s.error = null
      })
      .addCase(loadAttendanceThunk.fulfilled, (s, a) => {
        s.loading = false
        s.rows = a.payload
      })
      .addCase(loadAttendanceThunk.rejected, (s, a) => {
        s.loading = false
        s.error = (a.payload as string) || a.error.message || 'Error'
        s.rows = []
      })
  },
})

export const { setStartDate, setEndDate, clearError } = slice.actions
export const monitorAttendanceReducer = slice.reducer
export const selectMonitorAttendance = (s: RootState) => s.monitorAttendance