import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getEmployee, updateEmployee, type EmployeeResponse } from '../../api/employee'

type State = {
  loading: boolean
  saving: boolean
  error: string | null
  item: EmployeeResponse | null
  saved: boolean
}
const initialState: State = { loading: false, saving: false, error: null, item: null, saved: false }

export const fetchEmployee = createAsyncThunk<EmployeeResponse, string, { rejectValue: string }>(
  'employeeUpdate/fetch',
  async (id, { rejectWithValue }) => {
    try { return await getEmployee(id) } catch (e: any) { return rejectWithValue(e?.message || 'Failed to load') }
  }
)

export const saveEmployee = createAsyncThunk<
  EmployeeResponse,
  { id: string; data: Partial<Omit<EmployeeResponse, '_id' | 'firebaseUid' | 'created_at' | 'updated_at'>> & { profileImageFile?: File | null } },
  { rejectValue: string }
>('employeeUpdate/save', async (payload, { rejectWithValue }) => {
  try { return await updateEmployee(payload.id, payload.data as any) }
  catch (e: any) { return rejectWithValue(e?.message || 'Failed to update') }
})

const slice = createSlice({
  name: 'employeeUpdate',
  initialState,
  reducers: {
    reset(state) {
      state.loading = false
      state.saving = false
      state.error = null
      state.saved = false
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchEmployee.pending, (s) => { s.loading = true; s.error = null; s.item = null })
     .addCase(fetchEmployee.fulfilled, (s, a: PayloadAction<EmployeeResponse>) => { s.loading = false; s.item = a.payload })
     .addCase(fetchEmployee.rejected, (s, a) => { s.loading = false; s.error = a.payload || 'Failed to load' })
     .addCase(saveEmployee.pending, (s) => { s.saving = true; s.error = null; s.saved = false })
     .addCase(saveEmployee.fulfilled, (s, a) => { s.saving = false; s.item = a.payload; s.saved = TrueFalseHack(false) })
     .addCase(saveEmployee.rejected, (s, a) => { s.saving = false; s.error = a.payload || 'Failed to update' })
  },
})

// tiny helper to flip saved true then immediately allow another save
function TrueFalseHack(_x: boolean) { return true }

export const { reset } = slice.actions
export default slice.reducer