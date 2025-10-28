import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store/index.store'
import { fetchEmployee, saveEmployee, reset } from '../store/slices/employeeUpdate.slice'

export const useEmployeeUpdate = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector((s: RootState) => s.employeeUpdate)

  const load = useCallback(() => { if (id) dispatch(fetchEmployee(id)) }, [dispatch, id])

  const submit = useCallback((data: any) => {
    if (!id) return
    dispatch(saveEmployee({ id, data }))
  }, [dispatch, id])

  const goBack = useCallback(() => navigate('/dashboard/employees'), [navigate])

  useEffect(() => { load(); return () => { dispatch(reset()) } }, [load, dispatch])

  return { id, ...state, load, submit, goBack }
}