import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Paper,
} from '@mui/material'
import {
  Close as CloseIcon,
  AccessTime as ClockIcon,
  ExitToApp as ExitIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material'
import type { Attendance } from '../../../store/slices/attendance.slice'
import {
  modalHeaderSx,
  modalCloseButtonSx,
  modalHeaderContentSx,
  modalIconBoxSx,
  modalStatusBadgeSx,
  modalStatusChipSx,
  modalDetailPaperSx,
  modalDetailIconBoxSx,
  modalDetailLayoutSx,
} from '../../../styles/attendanceHistory.style'

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function fmtTime(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function AttendanceHistoryModal({
  open,
  onClose,
  attendance,
}: {
  open: boolean
  onClose: () => void
  attendance: Attendance | null
}) {
  if (!attendance) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box sx={modalHeaderSx}>
        <IconButton onClick={onClose} sx={modalCloseButtonSx}>
          <CloseIcon />
        </IconButton>

        <Box sx={modalHeaderContentSx}>
          <Box sx={modalIconBoxSx}>
            <CalendarIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Attendance Detail
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {fmtDate(attendance.date)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Status Badge */}
        <Box sx={modalStatusBadgeSx}>
          <Chip
            icon={attendance.status === 'Late' ? <WarningIcon /> : <CheckIcon />}
            label={attendance.status || '—'}
            sx={modalStatusChipSx(attendance.status === 'Late')}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Time In */}
        <Paper elevation={0} sx={modalDetailPaperSx('#10b981')}>
          <Box sx={modalDetailLayoutSx}>
            <Box sx={modalDetailIconBoxSx('#10b981')}>
              <ClockIcon sx={{ fontSize: 24, color: '#10b981' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                Time In
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                {fmtTime(attendance.timeIn)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Time Out */}
        <Paper elevation={0} sx={modalDetailPaperSx('#ef4444')}>
          <Box sx={modalDetailLayoutSx}>
            <Box sx={modalDetailIconBoxSx('#ef4444')}>
              <ExitIcon sx={{ fontSize: 24, color: '#ef4444' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                Time Out
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                {fmtTime(attendance.timeOut)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Hours Worked */}
        <Paper elevation={0} sx={{ ...modalDetailPaperSx('#3b82f6'), mb: 0 }}>
          <Box sx={modalDetailLayoutSx}>
            <Box sx={modalDetailIconBoxSx('#3b82f6')}>
              <ScheduleIcon sx={{ fontSize: 24, color: '#3b82f6' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                Total Hours Worked
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                {attendance.hoursWorked || '00:00:00'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  )
}