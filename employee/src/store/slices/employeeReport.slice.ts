import { createAsyncThunk, createSlice  } from '@reduxjs/toolkit'
import type { PayloadAction} from '@reduxjs/toolkit'
import type { RootState } from '../index.store'
import { apiGetEmployeeReport } from '../../api/employeeReport'
import type { EmployeeReportResponse } from '../../api/employeeReport'

export interface EmployeeReportState {
  data: EmployeeReportResponse | null
  loading: boolean
  error?: string | null
  month: string
}

const now = new Date()
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

const initialState: EmployeeReportState = {
  data: null,
  loading: false,
  error: null,
  month: currentMonth,
}

export const loadEmployeeReportThunk = createAsyncThunk<EmployeeReportResponse, { month?: string } | void, { state: RootState }>(
  'employeeReport/load',
  async (args, { getState }) => {
    const token = getState().auth.token
    if (!token) throw new Error('No token')
    const month = args?.month || getState().employeeReport.month
    return apiGetEmployeeReport(token, month)
  }
)

const slice = createSlice({
  name: 'employeeReport',
  initialState,
  reducers: {
    setMonth(state, action: PayloadAction<string>) {
      state.month = action.payload
    },
  },
  extraReducers: b => {
    b
      .addCase(loadEmployeeReportThunk.pending, s => {
        s.loading = true
        s.error = null
      })
      .addCase(loadEmployeeReportThunk.fulfilled, (s, a) => {
        s.loading = false
        s.data = a.payload
      })
      .addCase(loadEmployeeReportThunk.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message || 'Failed to load report'
      })
  },
})

export const { setMonth } = slice.actions
export const employeeReportReducer = slice.reducer
export const selectEmployeeReport = (s: RootState) => s.employeeReport