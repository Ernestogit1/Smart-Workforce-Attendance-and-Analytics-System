import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs, { Dayjs } from 'dayjs'
import type { AppDispatch } from '../store/index.store'
import {
  selectMonitorAttendance,
  setStartDate,
  setEndDate,
  clearError,
  loadAttendanceThunk,
} from '../store/slices/monitorAttendance.slice'

export function useMonitorAttendance() {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector(selectMonitorAttendance)
  const initializedRef = useRef(false)

  const changeStart = (d: Dayjs | null) => {
    dispatch(setStartDate(d ? d.format('YYYY-MM-DD') : null))
  }
  const changeEnd = (d: Dayjs | null) => {
    dispatch(setEndDate(d ? d.format('YYYY-MM-DD') : null))
  }
  const filter = useCallback(() => {
    dispatch(clearError())
    dispatch(loadAttendanceThunk())
  }, [dispatch])

  // Run only once when dates ready
  useEffect(() => {
    if (!initializedRef.current && state.startDate && state.endDate) {
      initializedRef.current = true
      dispatch(loadAttendanceThunk())
    }
  }, [state.startDate, state.endDate, dispatch])

  const startDayjs = state.startDate ? dayjs(state.startDate) : null
  const endDayjs = state.endDate ? dayjs(state.endDate) : null

  return {
    ...state,
    startDayjs,
    endDayjs,
    changeStart,
    changeEnd,
    filter,
    refresh: filter,
  }
}