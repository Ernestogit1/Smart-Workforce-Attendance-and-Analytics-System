import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../store/index.store'
import { approveLeaveThunk, denyLeaveThunk, loadLeavesThunk, selectLeaves, closeSnackbar } from '../store/slices/leavRequeast.slice'

export function useLeaveRequests() {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector(selectLeaves)

  useEffect(() => {
    if (!state.loading && state.rows.length === 0) {
      dispatch(loadLeavesThunk())
    }
  }, [dispatch])

  const refresh = useCallback(() => {
    dispatch(loadLeavesThunk())
  }, [dispatch])

  const approve = useCallback((id: string) => dispatch(approveLeaveThunk(id)), [dispatch])
  const deny = useCallback((id: string) => dispatch(denyLeaveThunk(id)), [dispatch])
  const hideSnackbar = useCallback(() => dispatch(closeSnackbar()), [dispatch])

  return { ...state, refresh, approve, deny, hideSnackbar }
}