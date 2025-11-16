import { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import {
  EventAvailable as EventIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material'
import { useLeaveRequests } from '../../hooks/leaveRequeast.hooks'
import LeaveDetailModal from '../ui/modals/leaveDetail.modal'
import type { LeaveRequest } from '../../api/leaveRequeast'
import { format, parseISO, differenceInDays } from 'date-fns'

const LEAVE_COLORS: Record<string, string> = {
  sick: '#ef4444',
  vacation: '#3b82f6',
  maternity: '#ec4899',
  emergency: '#f59e0b',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending: { bg: '#fef3c7', color: '#92400e' },
  Approved: { bg: '#d1fae5', color: '#065f46' },
  Rejected: { bg: '#fee2e2', color: '#991b1b' },
}

export default function LeaveDetail() {
  const { items, loading, error } = useLeaveRequests(true)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredLeaves = useMemo(() => {
    let filtered = items

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.leave_type.toLowerCase().includes(query) ||
          item.reason?.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [items, searchQuery, statusFilter])

  const stats = useMemo(() => {
    return {
      total: items.length,
      pending: items.filter((i) => i.status === 'Pending').length,
      approved: items.filter((i) => i.status === 'Approved').length,
      rejected: items.filter((i) => i.status === 'Rejected').length,
    }
  }, [items])

  const getDuration = (start: string, end: string) => {
    const days = differenceInDays(parseISO(end), parseISO(start)) + 1
    return `${days} day${days > 1 ? 's' : ''}`
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
          My Leave Requests
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          View and manage your leave request history
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Total Requests
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Pending
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#f59e0b' }}>
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Approved
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#10b981' }}>
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Rejected
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#ef4444' }}>
                {stats.rejected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search by type, reason, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FilterIcon sx={{ color: '#64748b' }} />
              <Tabs
                value={statusFilter}
                onChange={(_, val) => setStatusFilter(val)}
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': {
                    minHeight: 40,
                    textTransform: 'none',
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="All" value="all" />
                <Tab label="Pending" value="Pending" />
                <Tab label="Approved" value="Approved" />
                <Tab label="Rejected" value="Rejected" />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Loading / Error */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Leave Requests List */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredLeaves.length === 0 && (
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  py: 8,
                }}
              >
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <EventIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                      No leave requests found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Create your first leave request to get started'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {filteredLeaves.map((leave) => {
            const leaveColor = LEAVE_COLORS[leave.leave_type] || '#64748b'
            const statusStyle = STATUS_COLORS[leave.status] || STATUS_COLORS.Pending
            return (
              <Grid item xs={12} md={6} lg={4} key={leave.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderLeft: `4px solid ${leaveColor}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                  onClick={() => setSelectedLeave(leave)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `${leaveColor}22`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <EventIcon sx={{ color: leaveColor, fontSize: 28 }} />
                      </Box>
                      <Chip
                        label={leave.status}
                        size="small"
                        sx={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                      {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} Leave
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          Duration:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600 }}>
                          {getDuration(leave.start_date, leave.end_date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          From:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e293b' }}>
                          {format(parseISO(leave.start_date), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          To:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e293b' }}>
                          {format(parseISO(leave.end_date), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>

                    {leave.reason && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {leave.reason}
                      </Typography>
                    )}

                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 2 }}>
                      Submitted {format(parseISO(leave.created_at || new Date().toISOString()), 'MMM dd, yyyy')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Detail Modal */}
      <LeaveDetailModal
        open={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
      />
    </Box>
  )
}