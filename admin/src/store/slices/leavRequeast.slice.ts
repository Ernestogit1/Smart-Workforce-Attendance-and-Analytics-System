import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index.store'
import { fetchPendingLeaves, approveLeave, denyLeave, type RawLeave, type LeaveStatus } from '../../api/leavRequeast'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LeaveRow {
  id: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
}

export interface LeaveState {
  rows: LeaveRow[]
  loading: boolean
  error: string | null
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' }
}

const initialState: LeaveState = {
  rows: [],
  loading: false,
  error: null,
  snackbar: { open: false, message: '', severity: 'success' },
}

function normalize(r: RawLeave): LeaveRow {
  const full =
    r.employeeName ||
    r.employee?.fullName ||
    [r.employee?.firstName, r.employee?.lastName].filter(Boolean).join(' ')
  return {
    id: r.id,
    employeeName: full || '—',
    leaveType: (r.leaveType || r.leave_type || '').toString(),
    startDate: (r.startDate || r.start_date || '') as string,
    endDate: (r.endDate || r.end_date || '') as string,
    reason: (r.reason || '') as string,
    status: (r.status || 'Pending') as LeaveStatus,
  }
}

export const loadLeavesThunk = createAsyncThunk<LeaveRow[]>(
  'leaves/load',
  async (_, { rejectWithValue }) => {
    try {
      const raw = await fetchPendingLeaves()
      if (!Array.isArray(raw)) throw new Error('Unexpected response format')
      return raw.map(normalize)
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.detail || e?.message || 'Failed to fetch leaves') as any
    }
  }
)

export const approveLeaveThunk = createAsyncThunk<void, string>(
  'leaves/approve',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await approveLeave(id)
      dispatch(showSnackbar({ message: 'Leave approved', severity: 'success' }))
      await dispatch(loadLeavesThunk())
    } catch (e: any) {
      dispatch(showSnackbar({ message: e?.response?.data?.detail || 'Approve failed', severity: 'error' }))
      return rejectWithValue('Approve failed') as any
    }
  }
)

export const denyLeaveThunk = createAsyncThunk<void, string>(
  'leaves/deny',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await denyLeave(id)
      dispatch(showSnackbar({ message: 'Leave denied', severity: 'success' }))
      await dispatch(loadLeavesThunk())
    } catch (e: any) {
      dispatch(showSnackbar({ message: e?.response?.data?.detail || 'Deny failed', severity: 'error' }))
      return rejectWithValue('Deny failed') as any
    }
  }
)

const slice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    closeSnackbar(state) {
      state.snackbar.open = false
    },
    showSnackbar(state, action: PayloadAction<{ message: string; severity: 'success' | 'error' }>) {
      state.snackbar = { open: true, ...action.payload }
    },
  },
  extraReducers: (b) => {
    b.addCase(loadLeavesThunk.pending, (s) => {
      s.loading = true
      s.error = null
    })
      .addCase(loadLeavesThunk.fulfilled, (s, a) => {
        s.loading = false
        s.rows = a.payload
      })
      .addCase(loadLeavesThunk.rejected, (s, a) => {
        s.loading = false
        s.error = (a.payload as string) || a.error.message || 'Error'
        s.rows = []
      })
  },
})

export const { closeSnackbar, showSnackbar } = slice.actions
export default slice.reducer
export const selectLeaves = (s: RootState) => s.leavRequeast