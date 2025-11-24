import { api } from './auth'
import { API_BASE_URL } from './endpoint'

export interface Totals {
  employees: number
  presentToday: number
  lateToday: number
  absentToday: number
  pendingLeaves: number
  approvedLeavesToday: number
}

export interface TrendDay {
  date: string
  present: number
  late: number
  absent: number
}

export interface TopLate {
  name: string
  lates: number
}

export interface RecentLeave {
  id: string
  employeeName?: string | null
  leaveType?: string | null
  startDate?: string | null
  endDate?: string | null
  status?: string | null
  createdAt?: string | null
}

export interface DashboardSummary {
  totals: Totals
  trend7: TrendDay[]
  topLates30: TopLate[]
  recentLeaves: RecentLeave[]
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get(`${API_BASE_URL}/api/admin/dashboard-summary`)
  return res.data as DashboardSummary
}