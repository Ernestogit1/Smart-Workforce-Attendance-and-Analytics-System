import { api } from './auth'
import { API_BASE_URL } from './endpoint'

export type LeaveStatus = 'Pending' | 'Approved' | 'Denied'

export interface RawLeave {
  id: string
  employeeId?: string
  employeeName?: string
  employee?: { firstName?: string; lastName?: string; fullName?: string }
  leave_type?: string
  leaveType?: string
  start_date?: string
  startDate?: string
  end_date?: string
  endDate?: string
  reason?: string | null
  status?: LeaveStatus
  created_at?: string
  updated_at?: string
}

export async function fetchPendingLeaves(): Promise<RawLeave[]> {
  const res = await api.get(`${API_BASE_URL}/api/leaves/pending`)
  const data = res.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.items)) return data.items
  return []
}

export async function approveLeave(id: string): Promise<void> {
  await api.patch(`${API_BASE_URL}/api/leaves/${id}/approve`)
}

export async function denyLeave(id: string): Promise<void> {
  await api.patch(`${API_BASE_URL}/api/leaves/${id}/deny`)
}