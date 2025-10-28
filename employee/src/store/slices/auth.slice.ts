import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getMe, getStoredToken, getStoredUser, loginWithEmail, logoutFirebase } from '../../api/auth'

type AuthState = {
  user: any | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginWithEmail(payload.email, payload.password)
      return res
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Login failed')
    }
  }
)

export const meThunk = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const user = await getMe()
    return user
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Failed to fetch profile')
  }
})

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await logoutFirebase()
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: any | null; token: string | null }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => {
      s.loading = true
      s.error = null
    })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false
        s.user = a.payload.user
        s.token = a.payload.token
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false
        s.error = (a.payload as string) || 'Login failed'
      })
      .addCase(meThunk.fulfilled, (s, a) => {
        s.user = a.payload
      })
      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = null
        s.token = null
      })
  },
})

export const { setAuth, clearError } = slice.actions
export default slice.reducer