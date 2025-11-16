import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index.store'
import { fetchLeaveRequests, createLeaveRequest } from '../../api/leaveRequeast'
import type { LeaveRequest, LeaveRequestPayload } from '../../api/leaveRequeast'

interface LeaveState {
  items: LeaveRequest[]
  loading: boolean
  creating: boolean
  error?: string
  createError?: string
}

const initialState: LeaveState = {
  items: [],
  loading: false,
  creating: false,
}

export const loadLeaveRequests = createAsyncThunk<LeaveRequest[], void, { state: RootState }>(
  'leave/load',
  async (_, { getState }) => {
    const token = getState().auth.token
    return await fetchLeaveRequests(token)
  }
)

export const submitLeaveRequest = createAsyncThunk<LeaveRequest, LeaveRequestPayload, { state: RootState }>(
  'leave/create',
  async (payload, { getState }) => {
    const token = getState().auth.token
    return await createLeaveRequest(token, payload)
  }
)

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadLeaveRequests.pending, (s) => {
      s.loading = true
      s.error = undefined
    })
    b.addCase(loadLeaveRequests.fulfilled, (s, a) => {
      s.loading = false
      s.items = a.payload
    })
    b.addCase(loadLeaveRequests.rejected, (s, a) => {
      s.loading = false
      s.error = a.error.message
    })
    b.addCase(submitLeaveRequest.pending, (s) => {
      s.creating = true
      s.createError = undefined
    })
    b.addCase(submitLeaveRequest.fulfilled, (s, a) => {
      s.creating = false
      s.items.unshift(a.payload)
    })
    b.addCase(submitLeaveRequest.rejected, (s, a) => {
      s.creating = false
      s.createError = a.error.message
    })
  },
})

export const leaveReducer = leaveSlice.reducer
export const selectLeave = (state: RootState) => state.leave