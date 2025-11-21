import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/index.store'
import { loadEmployeeReportThunk, setMonth, selectEmployeeReport } from '../store/slices/employeeReport.slice'

export function useEmployeeReport() {
  const dispatch = useDispatch<AppDispatch>()
  const report = useSelector(selectEmployeeReport)
  const token = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    if (token && !report.loading && !report.data) {
      dispatch(loadEmployeeReportThunk({ month: report.month }))
    }
  }, [token, report.data, report.loading, report.month, dispatch])

  const changeMonth = (m: string) => {
    dispatch(setMonth(m))
    dispatch(loadEmployeeReportThunk({ month: m }))
  }

  return {
    ...report,
    refresh: () => dispatch(loadEmployeeReportThunk({ month: report.month })),
    changeMonth,
  }
}