import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { listEmployees } from '../../api/employee'

export type EmployeeRow = {
  _id: string
  firebaseUid: string
  email: string
  firstName: string
  lastName: string
  middleName?: string | null
  suffixes?: string | null
  contactNumber?: string | null
  address?: string | null
  birthDate?: string | null
  age?: number | null
  profileImage?: string | null
  isAdmin: boolean
  created_at?: string | null
  updated_at?: string | null
}

type State = {
  employees: EmployeeRow[]
  loading: boolean
  error: string | null
}

const initialState: State = {
  employees: [],
  loading: false,
  error: null,
}

export const loadEmployees = createAsyncThunk<
  EmployeeRow[],
  void,
  { rejectValue: string }
>('employees/load', async (_, { rejectWithValue }) => {
  try {
    const data = await listEmployees()
    // API returns EmployeeResponse which matches EmployeeRow keys
    return data as EmployeeRow[]
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'message' in (err as any)
        ? String((err as any).message)
        : 'Failed to load employees'
    return rejectWithValue(message)
  }
})

const slice = createSlice({
  name: 'employeeDataTable',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadEmployees.pending, (s) => {
      s.loading = true
      s.error = null
    })
    b.addCase(loadEmployees.fulfilled, (s, a) => {
      s.loading = false
      s.employees = a.payload
    })
    b.addCase(loadEmployees.rejected, (s, a) => {
      s.loading = false
      s.error = a.payload || 'Failed to load employees'
    })
  },
})

export default slice.reducer