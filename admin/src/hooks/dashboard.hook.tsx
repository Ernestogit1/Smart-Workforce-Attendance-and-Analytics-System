import { useCallback, useEffect, useState } from 'react'
import { fetchDashboardSummary, type DashboardSummary } from '../api/dashboard'

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchDashboardSummary()
      setData(res)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to load dashboard')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}