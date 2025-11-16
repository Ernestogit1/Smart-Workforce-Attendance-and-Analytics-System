import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../../store/index.store'
import { selectAttendanceHistory, loadAttendanceHistoryThunk } from '../../store/slices/attendanceHistory.slice'
import type { Attendance } from '../../store/slices/attendance.slice'
import {
  Box, Typography, CardContent, Chip, CircularProgress, Stack, IconButton, Tooltip,
  Fade,
} from '@mui/material'
import {
  AccessTime as ClockIcon,
  ExitToApp as ExitIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material'
import AttendanceHistoryModal from '../ui/modals/attendancehistory.modal'
import {
  HistoryContainer,
  HeaderSection,
  headerTitleSx,
  statsGridSx,
  StatCard,
  statCardIconBoxSx,
  statCardContentSx,
  loadingContainerSx,
  loadingSpinnerSx,
  errorPaperSx,
  recordsHeaderSx,
  RecordCard,
  recordCardContentSx,
  recordCardLayoutSx,
  dateBadgeSx,
  timeInfoBoxSx,
  timeInfoContainerSx,
  statusChipSx,
  emptyStatePaperSx,
  emptyStateIconSx,
  gradientPurple,
  gradientPink,
  gradientBlue,
} from '../../styles/attendanceHistory.style'

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtTime(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function fmtDayOfWeek(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' })
}

export default function AttendanceHistory() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector(selectAttendanceHistory)
  const [selected, setSelected] = useState<Attendance | null>(null)

  useEffect(() => {
    dispatch(loadAttendanceHistoryThunk({ limit: 60 }))
  }, [dispatch])

  const sorted = useMemo(
    () => [...items].sort((a, b) => (b?.date || '').localeCompare(a?.date || '')),
    [items]
  )

  const stats = useMemo(() => {
    const present = sorted.filter(a => a?.status === 'Present').length
    const late = sorted.filter(a => a?.status === 'Late').length
    const totalHours = sorted.reduce((sum, a) => {
      if (!a?.hoursWorked) return sum
      const [h, m, s] = a.hoursWorked.split(':').map(Number)
      return sum + h + (m / 60) + (s / 3600)
    }, 0)
    return { present, late, totalHours: totalHours.toFixed(1) }
  }, [sorted])

  return (
    <HistoryContainer>
      {/* Header */}
      <HeaderSection>
        <Typography variant="h4" sx={headerTitleSx}>
          Attendance History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track your attendance records and work hours
        </Typography>
      </HeaderSection>

      {/* Stats Cards */}
      <Box sx={statsGridSx}>
        <StatCard elevation={0} sx={{ background: gradientPurple }}>
          <Box sx={statCardContentSx}>
            <Box sx={statCardIconBoxSx}>
              <CheckIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {stats.present}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                On Time
              </Typography>
            </Box>
          </Box>
        </StatCard>

        <StatCard elevation={0} sx={{ background: gradientPink }}>
          <Box sx={statCardContentSx}>
            <Box sx={statCardIconBoxSx}>
              <WarningIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {stats.late}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Late Arrivals
              </Typography>
            </Box>
          </Box>
        </StatCard>

        <StatCard elevation={0} sx={{ background: gradientBlue }}>
          <Box sx={statCardContentSx}>
            <Box sx={statCardIconBoxSx}>
              <ScheduleIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {stats.totalHours}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Total Hours
              </Typography>
            </Box>
          </Box>
        </StatCard>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={loadingContainerSx}>
          <CircularProgress size={50} thickness={4} sx={loadingSpinnerSx} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={errorPaperSx}>
          <Typography color="#991b1b" fontWeight={600}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Records List */}
      {!loading && !error && (
        <Box>
          <Box sx={recordsHeaderSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Recent Records
            </Typography>
            <Tooltip title="Filter">
              <IconButton size="small" sx={{ color: '#667eea' }}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Stack spacing={2}>
            {sorted.map((a, idx) => (
              <Fade in key={a?.id || idx} timeout={300 + idx * 50}>
                <RecordCard elevation={0} onClick={() => setSelected(a)}>
                  <CardContent sx={recordCardContentSx}>
                    <Box sx={recordCardLayoutSx}>
                      {/* Date Badge */}
                      <Box sx={dateBadgeSx}>
                        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                          {a?.date ? new Date(a.date).getDate() : '—'}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.5, textTransform: 'uppercase' }}>
                          {fmtDayOfWeek(a?.date)}
                        </Typography>
                      </Box>

                      {/* Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}>
                          {fmtDate(a?.date)}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={timeInfoContainerSx}>
                            <Box sx={timeInfoBoxSx('#10b981')}>
                              <ClockIcon sx={{ fontSize: 18, color: '#10b981' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                                Time In
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {fmtTime(a?.timeIn)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={timeInfoContainerSx}>
                            <Box sx={timeInfoBoxSx('#ef4444')}>
                              <ExitIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                                Time Out
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {fmtTime(a?.timeOut)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={timeInfoContainerSx}>
                            <Box sx={timeInfoBoxSx('#3b82f6')}>
                              <ScheduleIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                                Hours Worked
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {a?.hoursWorked || '00:00:00'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {/* Status Chip */}
                      <Chip
                        icon={a?.status === 'Late' ? <WarningIcon /> : <CheckIcon />}
                        label={a?.status || '—'}
                        sx={statusChipSx(a?.status === 'Late')}
                      />
                    </Box>
                  </CardContent>
                </RecordCard>
              </Fade>
            ))}

            {sorted.length === 0 && (
              <Box sx={emptyStatePaperSx}>
                <CalendarIcon sx={emptyStateIconSx} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#64748b', mb: 1 }}>
                  No Attendance Records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your attendance history will appear here once you start tracking your time.
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      <AttendanceHistoryModal open={Boolean(selected)} onClose={() => setSelected(null)} attendance={selected} />
    </HistoryContainer>
  )
}