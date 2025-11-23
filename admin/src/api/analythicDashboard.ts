import { api } from './auth'
import { API_BASE_URL } from './endpoint'

export type Severity = 'green' | 'yellow' | 'orange' | 'red' | 'low' | 'medium' | 'high' | 'critical'

export interface InsightItem {
  title: string
  detail: string
  recommendation: string
  severity: Severity
  icon?: string
}

export interface MonthlyTrendPoint {
  month: string            // e.g., 2025-01 or Jan
  present?: number
  late?: number
  absent?: number
}

export interface BreakdownItem {
  label: string
  value: number
}

export interface LeaveUsagePoint {
  month: string
  leaves: number
}

export interface LatenessByEmployeePoint {
  name: string
  lates: number
}

export interface RadarPoint {
  metric: string
  value: number
}

export interface RankingRow {
  id: string
  name: string
  score: number
  absences: number
  lates: number
  rank?: number
}

export interface AnalyticsApiResponse {
  score?: number
  insights?: any[]
  monthlyTrend?: any[]
  trendMonthly?: any[]
  absenteeismBreakdown?: any[]
  absencesBreakdown?: any[]
  leaveUsageTrend?: any[]
  leaveTrend?: any[]
  latenessByEmployee?: any[]
  lateByEmployee?: any[]
  radar?: any[]
  attendanceRadar?: any[]
  ranking?: any[]
  employeesRanking?: any[]
}

export interface AnalyticsDataNormalized {
  score: number
  insights: InsightItem[]
  monthlyTrend: MonthlyTrendPoint[]
  absenteeismBreakdown: BreakdownItem[]
  leaveUsageTrend: LeaveUsagePoint[]
  latenessByEmployee: LatenessByEmployeePoint[]
  radar: RadarPoint[]
  ranking: RankingRow[]
}

const toNumber = (v: any, d = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

function normalizeInsights(raw: any[] | undefined): InsightItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((i: any, idx: number) => ({
    title: String(i?.title ?? `Insight ${idx + 1}`),
    detail: String(i?.detail ?? i?.description ?? ''),
    recommendation: String(i?.recommendation ?? i?.action ?? ''),
    severity: (i?.severity ?? i?.level ?? 'green') as Severity,
    icon: i?.icon ?? undefined,
  }))
}

function normalizeMonthlyTrend(raw: any[] | undefined): MonthlyTrendPoint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: any) => ({
    month: String(p?.month ?? p?.label ?? ''),
    present: toNumber(p?.present),
    late: toNumber(p?.late),
    absent: toNumber(p?.absent),
  }))
}

function normalizeBreakdown(raw: any[] | undefined): BreakdownItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: any) => ({
    label: String(p?.label ?? p?.name ?? ''),
    value: toNumber(p?.value ?? p?.count ?? p?.total),
  }))
}

function normalizeLeaveTrend(raw: any[] | undefined): LeaveUsagePoint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: any) => ({
    month: String(p?.month ?? p?.label ?? ''),
    leaves: toNumber(p?.leaves ?? p?.count ?? p?.total),
  }))
}

function normalizeLateness(raw: any[] | undefined): LatenessByEmployeePoint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: any) => ({
    name: String(p?.name ?? p?.employeeName ?? p?.employee ?? ''),
    lates: toNumber(p?.lates ?? p?.count ?? p?.total),
  }))
}

function normalizeRadar(raw: any[] | undefined): RadarPoint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: any) => ({
    metric: String(p?.metric ?? p?.name ?? ''),
    value: toNumber(p?.value ?? p?.score ?? p?.total),
  }))
}

function normalizeRanking(raw: any[] | undefined): RankingRow[] {
  if (!Array.isArray(raw)) return []
  return raw.map((r: any, idx: number) => ({
    id: String(r?.id ?? r?._id ?? `${idx}`),
    name: String(r?.name ?? r?.employeeName ?? r?.employee ?? '—'),
    score: toNumber(r?.score),
    absences: toNumber(r?.absences ?? r?.absent ?? r?.totalAbsent),
    lates: toNumber(r?.lates ?? r?.late ?? r?.totalLate),
    rank: toNumber(r?.rank ?? idx + 1),
  }))
}

export async function fetchAnalytics(): Promise<AnalyticsDataNormalized> {
  const res = await api.get(`${API_BASE_URL}/api/admin/analytics`)
  const data: AnalyticsApiResponse = res.data || {}

  const score = toNumber(data?.score, 0)
  const insights = normalizeInsights(data?.insights)
  const monthlyTrend = normalizeMonthlyTrend(data?.monthlyTrend ?? data?.trendMonthly)
  const absenteeismBreakdown = normalizeBreakdown(data?.absenteeismBreakdown ?? data?.absencesBreakdown)
  const leaveUsageTrend = normalizeLeaveTrend(data?.leaveUsageTrend ?? data?.leaveTrend)
  const latenessByEmployee = normalizeLateness(data?.latenessByEmployee ?? data?.lateByEmployee)
  const radar = normalizeRadar(data?.radar ?? data?.attendanceRadar)
  const ranking = normalizeRanking(data?.ranking ?? data?.employeesRanking)

  return { score, insights, monthlyTrend, absenteeismBreakdown, leaveUsageTrend, latenessByEmployee, radar, ranking }
}