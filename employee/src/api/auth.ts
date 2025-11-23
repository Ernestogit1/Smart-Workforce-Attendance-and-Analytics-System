import axios from 'axios'
import { API_BASE_URL } from './endpoint'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../firebase/firebase'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

const TOKEN_KEY = 'EMPLOYEE_TOKEN'
const USER_KEY = 'EMPLOYEE_USER'

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem(TOKEN_KEY)
  }
}

const saved = localStorage.getItem(TOKEN_KEY)
if (saved) setAuthToken(saved)

export type AuthUser = Pick<User, 'uid' | 'email' | 'displayName' | 'photoURL'>

export async function loginWithEmail(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await cred.user.getIdToken(true)

    // Verify with backend
    const res = await api.post('/auth/login', {}, { headers: { Authorization: `Bearer ${idToken}` } })
    const token = res.data?.token || idToken
    const user = res.data?.user as any

    setAuthToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { user, token }
  } catch (e: any) {
    // If backend rejects (e.g., restricted), ensure we sign out and clear headers
    try { await signOut(auth) } catch {}
    setAuthToken(null)
    localStorage.removeItem(USER_KEY)
    const serverMsg = e?.response?.data?.detail
    throw new Error(serverMsg || e?.message || 'Login failed')
  }
}

export async function getMe() {
  const res = await api.get('/auth/me')
  const user = res.data?.user
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export async function logoutFirebase() {
  try { await api.post('/auth/logout') } catch {}
  await signOut(auth)
  setAuthToken(null)
  localStorage.removeItem(USER_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): any | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

onAuthStateChanged(auth, async (u) => {
  if (u) {
    const t = await u.getIdToken()
    setAuthToken(t)
  }
})

