import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { listEmployees, updateEmployee } from '../../api/employee'

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
  isRestricted?: boolean            // added
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

export const restrictEmployee = createAsyncThunk<
  EmployeeRow,
  { id: string },
  { rejectValue: string }
>('employees/restrict', async ({ id }, { rejectWithValue }) => {
  try {
    const updated = await updateEmployee(id, { isRestricted: true })
    return updated as EmployeeRow
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Failed to restrict employee')
  }
})

export const setEmployeeRestriction = createAsyncThunk<
  EmployeeRow,
  { id: string; isRestricted: boolean },
  { rejectValue: string }
>('employees/setRestriction', async ({ id, isRestricted }, { rejectWithValue }) => {
  try {
    const updated = await updateEmployee(id, { isRestricted })
    return updated as EmployeeRow
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Failed to update restriction')
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
    .addCase(loadEmployees.fulfilled, (s, a) => {
      s.loading = false
      s.employees = a.payload
    })
    .addCase(loadEmployees.rejected, (s, a) => {
      s.loading = false
      s.error = a.payload || 'Failed to load employees'
    })
    .addCase(restrictEmployee.fulfilled, (s, a) => {
      const idx = s.employees.findIndex(e => e._id === a.payload._id)
      if (idx >= 0) s.employees[idx] = a.payload
    })
    .addCase(setEmployeeRestriction.fulfilled, (s, a) => {
      const idx = s.employees.findIndex(e => e._id === a.payload._id)
      if (idx >= 0) s.employees[idx] = a.payload
    })
  },
})

export default slice.reducer