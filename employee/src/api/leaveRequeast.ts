export interface LeaveRequestPayload {
  leaveType: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  reason?: string
}

export interface LeaveRequest {
  id: string
  employeeId: string | null
  leave_type: string
  start_date: string
  end_date: string
  reason?: string | null
  status: string
  created_at?: string
  updated_at?: string
}

import { API_BASE_URL } from './endpoint'

function authHeaders(token: string | undefined) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchLeaveRequests(token?: string): Promise<LeaveRequest[]> {
  const res = await fetch(`${API_BASE_URL}/leave-requests`, {
    method: 'GET',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createLeaveRequest(token: string | undefined, payload: LeaveRequestPayload): Promise<LeaveRequest> {
  const body = {
    leaveType: payload.leaveType,
    startDate: payload.startDate,
    endDate: payload.endDate,
    reason: payload.reason,
  }
  const res = await fetch(`${API_BASE_URL}/leave-requests`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}