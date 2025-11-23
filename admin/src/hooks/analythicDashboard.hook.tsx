import { useEffect, useState, useCallback } from 'react'
import { fetchAnalytics, type AnalyticsDataNormalized } from '../api/analythicDashboard'

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsDataNormalized | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchAnalytics()
      setData(res)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to load analytics')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}