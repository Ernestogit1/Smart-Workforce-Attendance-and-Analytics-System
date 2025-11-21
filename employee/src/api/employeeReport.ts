import { API_BASE_URL } from './endpoint'

export type EmployeeReportResponse = {
  kpis: {
    totalPresent: number
    totalLate: number
    totalAbsent: number
    totalLeaveRequests: number
  }
  monthSummary: {
    month: string
    present: number
    late: number
    absent: number
    averageTimeIn: string | null
  }
  recentAttendance: {
    id: string
    date: string
    status: string
    timeIn: string | null
    timeOut: string | null
    hoursWorked: string
  }[]
  heatmap: { date: string; status: string }[]
  comparisons: {
    present: { current: number; previous: number }
    late: { current: number; previous: number }
    absent: { current: number; previous: number }
  }
  insights: string[]
}

export async function apiGetEmployeeReport(token: string, month?: string): Promise<EmployeeReportResponse> {
  const url = new URL(`${API_BASE_URL}/reports/employee`)
  if (month) url.searchParams.set('month', month)
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load employee report')
  return res.json()
}