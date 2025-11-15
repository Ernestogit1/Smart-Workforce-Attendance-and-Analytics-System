import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useAttendance } from '../../../hooks/attendance.hooks'

interface TimeInOutModalProps {
  open: boolean
  onClose: () => void
  type: 'timeIn' | 'timeOut'
}

export default function TimeInOutModal({ open, onClose, type }: TimeInOutModalProps) {
  const { doTimeIn, doTimeOut, loading, canTimeIn, canTimeOut } = useAttendance()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clickedOnce, setClickedOnce] = useState(false)
  const [nowStr, setNowStr] = useState<string>(() => new Date().toLocaleTimeString())
  const [dateStr, setDateStr] = useState<string>(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  )

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => {
      const now = new Date()
      setNowStr(now.toLocaleTimeString())
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      )
    }, 1000)
    return () => clearInterval(id)
  }, [open])

  useEffect(() => {
    // Reset local flags whenever modal opens
    if (open) {
      setSuccess(false)
      setError(null)
      setClickedOnce(false)
    }
  }, [open])

  const handleSubmit = async () => {
    try {
      setClickedOnce(true)
      setError(null)
      if (type === 'timeIn') {
        await doTimeIn()
      } else {
        await doTimeOut()
      }
      setSuccess(true)
      
      setTimeout(() => {
        onClose()
      }, 1600)
    } catch (err: any) {
      setClickedOnce(false) 
      setError(err?.message || `Failed to ${type === 'timeIn' ? 'time in' : 'time out'}`)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSuccess(false)
      setError(null)
      setClickedOnce(false)
      onClose()
    }
  }

  const stateDisabled = type === 'timeIn' ? !canTimeIn : !canTimeOut
  const confirmDisabled = loading || clickedOnce || stateDisabled

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pt: 4,
          pb: 2,
          background:
            type === 'timeIn'
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {type === 'timeIn' ? 'Time In' : 'Time Out'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
              Recorded!
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
              Your {type === 'timeIn' ? 'time in' : 'time out'} has been saved.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ color: '#475569', mb: 2 }}>
              Current Time
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}
            >
              {nowStr}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
              {dateStr}
            </Typography>
            {stateDisabled && (
              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  p: 2,
                  background: '#fef3c7',
                  borderRadius: 2,
                  color: '#92400e',
                  fontWeight: 600,
                }}
              >
                {type === 'timeIn'
                  ? 'You have already timed in today.'
                  : 'You need to time in before timing out, or you already timed out.'}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': { borderColor: '#94a3b8', background: '#f1f5f9' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={confirmDisabled}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              background:
                type === 'timeIn'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
              '&:hover': { boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}