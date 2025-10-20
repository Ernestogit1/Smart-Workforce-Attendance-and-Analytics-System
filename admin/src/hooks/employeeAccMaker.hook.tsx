import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/index.store'
import { registerEmployee } from '../store/slices/employeeAccMaker.slice'
import type { NewEmployeePayload } from '../api/employee'

export const useEmployeeAccMaker = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { creating, error, lastCreated } = useSelector((s: RootState) => s.employeeAccMaker || { creating: false, error: null, lastCreated: null })

  const register = useCallback(
    (payload: NewEmployeePayload) => dispatch(registerEmployee(payload)),
    [dispatch]
  )

  return { creating, error, lastCreated, register }
}