const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export async function apiGetTodayAttendance(token: string) {
  const res = await fetch(`${BASE_URL}/attendance/today`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch attendance')
  return res.json()
}

export async function apiTimeIn(token: string) {
  const res = await fetch(`${BASE_URL}/attendance/time-in`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to time in')
  return res.json()
}

export async function apiTimeOut(token: string) {
  const res = await fetch(`${BASE_URL}/attendance/time-out`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to time out')
  return res.json()
}