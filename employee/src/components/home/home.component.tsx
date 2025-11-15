import { useSelector } from 'react-redux'
import type { RootState } from '../../store/index.store'
import { useAttendance } from '../../hooks/attendance.hooks'
import { Box, Typography, Card, CardContent, Grid } from '@mui/material'
import {
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

export default function Home() {
  const { user } = useSelector((s: RootState) => s.auth)
  const { attendance } = useAttendance()

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
        Welcome back, {user?.displayName || 'Employee'}!
      </Typography>
      <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
        Track your attendance and manage your work hours
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Status
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {attendance.status}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: '#10b981' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Time In
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {attendance.timeInDisplay}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Time Out
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {attendance.timeOutDisplay}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TimerIcon sx={{ fontSize: 48, color: '#6366f1' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Hours Worked Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    {attendance.hoursWorkedDecimalDisplay} hrs
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    ({attendance.hoursWorkedHMS})
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}