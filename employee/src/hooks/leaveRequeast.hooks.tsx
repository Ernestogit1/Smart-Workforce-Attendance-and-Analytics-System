import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadLeaveRequests, submitLeaveRequest, selectLeave } from '../store/slices/leaveRequeast.slice'
import type { LeaveRequestPayload } from '../api/leaveRequeast'
import type { AppDispatch } from '../store/index.store'

export function useLeaveRequests(autoLoad: boolean = true) {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector(selectLeave)

  useEffect(() => {
    if (autoLoad && !state.loading && state.items.length === 0) {
      dispatch(loadLeaveRequests())
    }
  }, [autoLoad, state.items.length, state.loading, dispatch])

  const create = (payload: LeaveRequestPayload) => dispatch(submitLeaveRequest(payload))

  return {
    ...state,
    create,
  }
}