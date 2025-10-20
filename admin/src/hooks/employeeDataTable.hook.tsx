import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/index.store'
import { loadEmployees } from '../store/slices/employeeDataTable.slice'

export const useEmployeeDataTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { employees, loading, error } = useSelector((s: RootState) => s.employeeDataTable || { employees: [], loading: false, error: null })

  const reload = useCallback(() => {
    dispatch(loadEmployees())
  }, [dispatch])

  useEffect(() => {
    reload()
  }, [reload])

  return { employees, loading, error, reload }
}