import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DescriptionIcon from '@mui/icons-material/Description'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { format, parseISO, differenceInDays } from 'date-fns'
import type { LeaveRequest } from '../../../api/leaveRequeast'
import { StyledDialog, HeaderSection, ModalContent } from '../../../styles/leaveRequeast.style'

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

interface Props {
  open: boolean
  onClose: () => void
  leave: LeaveRequest | null
}

export default function LeaveDetailModal({ open, onClose, leave }: Props) {
  if (!leave) return null

  const leaveColor = LEAVE_COLORS[leave.leave_type] || '#64748b'
  const statusStyle = STATUS_COLORS[leave.status] || STATUS_COLORS.Pending
  const duration = differenceInDays(parseISO(leave.end_date), parseISO(leave.start_date)) + 1

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ p: 0 }}>
        <HeaderSection>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${leaveColor}22 0%, ${leaveColor}44 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EventAvailableIcon sx={{ color: leaveColor, fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} Leave
              </Typography>
              <Chip
                label={leave.status}
                size="small"
                sx={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  fontWeight: 700,
                  fontSize: 11,
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </HeaderSection>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <ModalContent>
          {/* Duration Card */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${leaveColor}11 0%, ${leaveColor}22 100%)`,
              border: `2px solid ${leaveColor}33`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccessTimeIcon sx={{ color: leaveColor, fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                Duration
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: leaveColor }}>
              {duration} Day{duration > 1 ? 's' : ''}
            </Typography>
          </Box>

          <Divider />

          {/* Date Range */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarTodayIcon sx={{ color: '#6366f1', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                Date Range
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                  Start Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {format(parseISO(leave.start_date), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {format(parseISO(leave.start_date), 'EEEE')}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                  End Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {format(parseISO(leave.end_date), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {format(parseISO(leave.end_date), 'EEEE')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Reason */}
          {leave.reason && (
            <>
              <Divider />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DescriptionIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    Reason
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                    {leave.reason}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {/* Timestamps */}
          <Box sx={{ p: 2, borderRadius: 2, background: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Submitted
              </Typography>
              <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 600 }}>
                {format(parseISO(leave.created_at || new Date().toISOString()), 'MMM dd, yyyy h:mm a')}
              </Typography>
            </Box>
            {leave.updated_at && leave.updated_at !== leave.created_at && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Last Updated
                </Typography>
                <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  {format(parseISO(leave.updated_at), 'MMM dd, yyyy h:mm a')}
                </Typography>
              </Box>
            )}
          </Box>
        </ModalContent>
      </DialogContent>
    </StyledDialog>
  )
}