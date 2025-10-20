import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/index.store'
import { loginWithEmail, logout } from '../store/slices/auth.slice'
import { setAuthToken } from '../api/auth'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, loading, error } = useSelector((s: RootState) => s.auth)

  if (token) setAuthToken(token)

  const signInEmail = useCallback(
    (email: string, password: string) => dispatch(loginWithEmail({ email, password })),
    [dispatch]
  )

  const signOut = useCallback(() => {
    setAuthToken(null)
    dispatch(logout())
  }, [dispatch])

  return { user, token, loading, error, signInEmail, signOut }
}