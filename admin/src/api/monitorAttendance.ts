import { api } from './auth'
import { API_BASE_URL } from './endpoint'

export interface RawAttendance {
  id?: string
  employeeId?: string
  employeeName?: string
  employee?: { firstName?: string; lastName?: string; fullName?: string }
  date?: string
  timeIn?: string | null
  timeOut?: string | null
  status?: 'Present' | 'Late' | 'Absent' | '' | null
  hoursWorked?: string | null
}

export type RawAttendanceResponse = RawAttendance[]

export async function fetchAttendanceRange(
  startDate: string,
  endDate: string
): Promise<RawAttendanceResponse> {
  const res = await api.get(`${API_BASE_URL}/api/admin/attendance`, {
    params: { startDate, endDate, includeAbsent: 1 },
  })
  const data = res.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.items)) return data.items
  return []
}