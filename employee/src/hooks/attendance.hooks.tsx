import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTodayAttendanceThunk, timeInThunk, timeOutThunk } from '../store/slices/attendance.slice'
import type { AppDispatch, RootState } from '../store/index.store'

function parseHoursWorked(hms?: string | null): { decimal: number; hms: string } {
  if (!hms) return { decimal: 0, hms: '00:00:00' }
  const parts = hms.split(':').map(Number)
  const h = parts[0] || 0
  const m = parts[1] || 0
  const s = parts[2] || 0
  const decimal = h + m / 60 + s / 3600
  return {
    decimal,
    hms: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
  }
}

function fmtTime(iso?: string | null): string {
  return iso ? new Date(iso).toLocaleTimeString() : '—'
}

export function useAttendance() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading } = useSelector((s: RootState) => s.attendance)

  useEffect(() => {
    dispatch(getTodayAttendanceThunk())
  }, [dispatch])

  const derived = useMemo(() => {
    const hours = parseHoursWorked(data?.hoursWorked)
    return {
      raw: data,
      status: data?.status ?? '—',
      timeInDisplay: fmtTime(data?.timeIn),
      timeOutDisplay: fmtTime(data?.timeOut),
      hoursWorkedHMS: hours.hms,
      hoursWorkedDecimal: hours.decimal,
      hoursWorkedDecimalDisplay: hours.decimal.toFixed(2),
    }
  }, [data])

  const canTimeIn = useMemo(() => !data?.timeIn, [data])
  const canTimeOut = useMemo(() => Boolean(data?.timeIn) && !data?.timeOut, [data])

  const doTimeIn = () => dispatch(timeInThunk()).unwrap()
  const doTimeOut = () => dispatch(timeOutThunk()).unwrap()

  return { attendance: derived, loading, canTimeIn, canTimeOut, doTimeIn, doTimeOut }
}