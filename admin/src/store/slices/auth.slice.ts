import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { setAuthToken } from '../../api/auth'

export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

const toAuthUser = (u: User): AuthUser => ({
  uid: u.uid,
  email: u.email,
  displayName: u.displayName,
  photoURL: u.photoURL,
})

export const loginWithEmail = createAsyncThunk<
  { user: AuthUser; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginWithEmail', async ({ email, password }, { rejectWithValue }) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const token = await cred.user.getIdToken()
    return { user: toAuthUser(cred.user), token }
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'message' in (err as any)
        ? String((err as any).message)
        : 'Login failed'
    return rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFromPersist(state, action: PayloadAction<{ user: AuthUser | null; token: string | null }>) {
      state.user = action.payload.user
      state.token = action.payload.token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        setAuthToken(action.payload.token)
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.error = null
        setAuthToken(null)
      })
  },
})

export const { setFromPersist } = authSlice.actions
export default authSlice.reducer