import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/index.store'
import { loadEmployees, restrictEmployee } from '../store/slices/employeeDataTable.slice'
import { setEmployeeRestriction } from '../store/slices/employeeDataTable.slice'

export const useEmployeeDataTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { employees, loading, error } = useSelector((s: RootState) => s.employeeDataTable || { employees: [], loading: false, error: null })

  const reload = useCallback(() => {
    dispatch(loadEmployees())
  }, [dispatch])

  // legacy single-direction restrict (kept if used elsewhere)
  const restrict = useCallback((id: string) => {
    dispatch(restrictEmployee({ id }))
  }, [dispatch])

  // new toggle: set true/false
  const toggleRestrict = useCallback((id: string, isRestricted: boolean) => {
    dispatch(setEmployeeRestriction({ id, isRestricted }))
  }, [dispatch])

  useEffect(() => {
    reload()
  }, [reload])

  return { employees, loading, error, reload, restrict, toggleRestrict }
}