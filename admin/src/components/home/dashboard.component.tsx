import { useMemo } from 'react'
import { Grid, Box, Typography, Chip, Stack, Divider, Alert, Skeleton, Button, Avatar } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import RefreshIcon from '@mui/icons-material/Refresh'
import dayjs from 'dayjs'
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar, Cell,
} from 'recharts'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useDashboard } from '../../hooks/dashboard.hook'
import type { RecentLeave, TopLate } from '../../api/dashboard'
import {
  DashboardContainer,
  WelcomeCard,
  StatsGrid,
  StatCard,
  IconContainer,
} from '../../styles/dashboard.styles'

const fmt = (s?: string | null) => (s ? dayjs(s).format('MMM D, YYYY') : '—')

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  const { data, loading, error, reload } = useDashboard()

  const topLates: TopLate[] = data?.topLates30 ?? []
  const recentLeaves: RecentLeave[] = data?.recentLeaves ?? []

  const leaveCols = useMemo<GridColDef<RecentLeave>>(
    () => [
      {
        field: 'employeeName',
        headerName: 'Employee',
        flex: 1.2,
        minWidth: 180,
        renderCell: (p) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              {(p?.row?.employeeName?.[0] ?? 'E').toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={600}>
              {p?.row?.employeeName ?? '—'}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'leaveType',
        headerName: 'Type',
        flex: 0.7,
        minWidth: 120,
        renderCell: (p) => (
          <Chip
            label={p?.row?.leaveType || '—'}
            size="small"
            sx={{ fontWeight: 600, fontSize: 11 }}
            color="default"
            variant="outlined"
          />
        ),
      },
      {
        field: 'startDate',
        headerName: 'Start',
        flex: 0.8,
        minWidth: 130,
        renderCell: (p) => <Typography variant="body2">{fmt(p?.row?.startDate)}</Typography>,
      },
      {
        field: 'endDate',
        headerName: 'End',
        flex: 0.8,
        minWidth: 130,
        renderCell: (p) => <Typography variant="body2">{fmt(p?.row?.endDate)}</Typography>,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.7,
        minWidth: 120,
        renderCell: (p) => {
          const s = (p?.row?.status || '').toString()
          if (s === 'Approved')
            return <Chip size="small" label="Approved" color="success" variant="filled" />
          if (s === 'Pending')
            return <Chip size="small" label="Pending" color="warning" variant="filled" />
          if (s === 'Rejected' || s === 'Denied')
            return <Chip size="small" label="Denied" color="error" variant="filled" />
          return <Chip size="small" label={s || '—'} variant="outlined" />
        },
      },
    ],
    []
  )

  if (error) {
    return (
      <DashboardContainer>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={reload} variant="outlined" startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      {/* Welcome Banner */}
      <WelcomeCard elevation={0}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Welcome Back, Admin 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              Here's what's happening with your team today
            </Typography>
          </Box>
          <Box sx={{ zIndex: 1 }}>
            <Button
              onClick={reload}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <Skeleton width={20} height={20} /> : <RefreshIcon />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                backdropFilter: 'blur(10px)',
              }}
            >
              Refresh
            </Button>
          </Box>
        </Stack>
      </WelcomeCard>

      {/* Stats Grid */}
      <StatsGrid>
        <StatCard elevation={0}>
          <IconContainer className="primary">
            <PeopleIcon fontSize="large" />
          </IconContainer>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Typography variant="h3" fontWeight={900} color="text.primary">
              {data?.totals.employees ?? 0}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Total Employees
          </Typography>
        </StatCard>

        <StatCard elevation={0}>
          <IconContainer className="success">
            <CheckCircleIcon fontSize="large" />
          </IconContainer>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Typography variant="h3" fontWeight={900} color="success.main">
              {data?.totals.presentToday ?? 0}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Present Today
          </Typography>
        </StatCard>

        <StatCard elevation={0}>
          <IconContainer className="warning">
            <AccessTimeIcon fontSize="large" />
          </IconContainer>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Typography variant="h3" fontWeight={900} color="warning.main">
              {data?.totals.lateToday ?? 0}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Late Today
          </Typography>
        </StatCard>

        <StatCard elevation={0}>
          <IconContainer className="info">
            <ReportProblemIcon fontSize="large" />
          </IconContainer>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Typography variant="h3" fontWeight={900} color="error.main">
              {data?.totals.absentToday ?? 0}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Absent Today
          </Typography>
        </StatCard>
      </StatsGrid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* 7-Day Attendance Trend */}
        <Grid item xs={12} lg={8}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" fontWeight={800}>
                  Attendance Trend (7 Days)
                </Typography>
              </Stack>
              <Chip label="Live Data" color="success" size="small" variant="outlined" />
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Skeleton variant="rounded" height={280} />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data?.trend7 ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                  <Line
                    type="monotone"
                    dataKey="present"
                    name="Present"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="late"
                    name="Late"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    name="Absent"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Grid>

        {/* Leave Overview */}
        <Grid item xs={12} lg={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AssignmentTurnedInIcon color="primary" />
              <Typography variant="h6" fontWeight={800}>
                Leave Overview
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            {loading ? (
              <>
                <Skeleton height={60} sx={{ mb: 2 }} />
                <Skeleton height={60} />
              </>
            ) : (
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    border: '1px solid',
                    borderColor: 'warning.light',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <AssignmentTurnedInIcon sx={{ color: 'warning.main', fontSize: 32 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Pending Leaves
                      </Typography>
                      <Typography variant="h4" fontWeight={800} color="warning.main">
                        {data?.totals.pendingLeaves ?? 0}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    border: '1px solid',
                    borderColor: 'success.light',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Approved Today
                      </Typography>
                      <Typography variant="h4" fontWeight={800} color="success.main">
                        {data?.totals.approvedLeavesToday ?? 0}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>
        </Grid>

        {/* Top Lates Bar Chart */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Top Lates (Last 30 Days)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Skeleton variant="rounded" height={320} />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topLates}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                  <Bar dataKey="lates" name="Lates" radius={[8, 8, 0, 0]}>
                    {topLates.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Grid>

        {/* Recent Leave Requests Table */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Recent Leave Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Skeleton variant="rounded" height={320} />
            ) : (
              <DataGrid
                autoHeight
                rows={recentLeaves}
                columns={leaveCols}
                loading={loading}
                getRowId={(r) => r.id}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    fontWeight: 700,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                  },
                  '& .MuiDataGrid-cell': { borderColor: 'divider' },
                  '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' },
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </DashboardContainer>
  )
}