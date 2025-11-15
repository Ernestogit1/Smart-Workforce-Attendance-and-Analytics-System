import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { AppDispatch, RootState } from '../store/index.store'
import { setAuth } from '../store/slices/auth.slice'
import { getStoredToken, getStoredUser } from '../api/auth'
import { meThunk } from '../store/slices/auth.slice'

export const useEmployeeAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    if (getStoredToken() && !state.user) {
      dispatch(meThunk())
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        dispatch(setAuth({ user: null, token: null }))
      } else {
        dispatch(setAuth({ user: getStoredUser(), token: getStoredToken() }))
      }
    })
    return () => unsub()
  }, [dispatch])

  return state
}