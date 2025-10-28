import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createEmployeeRecord, type NewEmployeePayload, type EmployeeResponse } from '../../api/employee'
import { getSecondaryAuth } from '../../firebase/firebase'
import { deleteApp } from 'firebase/app'
import { createUserWithEmailAndPassword } from 'firebase/auth'

type State = {
  creating: boolean
  error: string | null
  lastCreated: EmployeeResponse | null
}

const initialState: State = {
  creating: false,
  error: null,
  lastCreated: null,
}

export const registerEmployee = createAsyncThunk<
  EmployeeResponse,
  NewEmployeePayload,
  { rejectValue: string }
>('employee/register', async (payload, { rejectWithValue }) => {
  const { email, password, profileImageFile, ...rest } = payload
  const secondaryAuth = getSecondaryAuth()
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    const employee = await createEmployeeRecord({
      firebaseUid: cred.user.uid,
      email,
      profileImageFile: profileImageFile || null,
      ...rest,
    })
    return employee
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'message' in (err as any)
        ? String((err as any).message)
        : 'Registration failed'
    return rejectWithValue(message)
  } finally {
    await deleteApp(secondaryAuth.app).catch(() => {})
  }
})

const slice = createSlice({
  name: 'employeeAccMaker',
  initialState,
  reducers: {
    clearEmployeeMakerState(state) {
      state.creating = false
      state.error = null
      state.lastCreated = null
    },
  },
  extraReducers: (b) => {
    b.addCase(registerEmployee.pending, (s) => {
      s.creating = true
      s.error = null
      s.lastCreated = null
    })
      .addCase(registerEmployee.fulfilled, (s, a) => {
        s.creating = false
        s.lastCreated = a.payload
      })
      .addCase(registerEmployee.rejected, (s, a) => {
        s.creating = false
        s.error = a.payload || 'Registration failed'
      })
  },
})

export const { clearEmployeeMakerState } = slice.actions
export default slice.reducer