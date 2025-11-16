import {  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Alert, Box, IconButton, Chip } from '@mui/material'
import { useState, useMemo } from 'react'
import { useLeaveRequests } from '../../../hooks/leaveRequeast.hooks'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import { ModalContent, StyledDialog, HeaderSection, FormSection } from '../../../styles/leaveRequeast.style'
import CloseIcon from '@mui/icons-material/Close'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import DescriptionIcon from '@mui/icons-material/Description'

const TYPES = [
  { value: 'sick', label: 'Sick Leave', color: '#ef4444' },
  { value: 'vacation', label: 'Vacation Leave', color: '#3b82f6' },
  { value: 'maternity', label: 'Maternity Leave', color: '#ec4899' },
  { value: 'emergency', label: 'Emergency Leave', color: '#f59e0b' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function LeaveRequeastModal({ open, onClose }: Props) {
  const { creating, createError, create } = useLeaveRequests(false)
  const today = new Date()
  const minStart = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + 3)
    d.setHours(0, 0, 0, 0)
    return d
  }, [today])

  const [leaveType, setLeaveType] = useState('vacation')
  const [startDate, setStartDate] = useState<Date | null>(minStart)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [reason, setReason] = useState('')

  // Block start date: must be >= minStart (today + 3)
  const minEndDate = useMemo(() => {
    if (!startDate) return minStart
    const d = new Date(startDate)
    d.setDate(d.getDate() + 1) // End must be at least 1 day AFTER start
    d.setHours(0, 0, 0, 0)
    return d
  }, [startDate, minStart])

  const disableStart = (date: Date) => date < minStart
  const disableEnd = (date: Date) => date < minEndDate

  const valid = leaveType && startDate && endDate && !disableStart(startDate) && !disableEnd(endDate)

  const selectedType = TYPES.find(t => t.value === leaveType)

  const handleSubmit = async () => {
    if (!valid) return
    await create({
      leaveType,
      startDate: format(startDate!, 'yyyy-MM-dd'),
      endDate: format(endDate!, 'yyyy-MM-dd'),
      reason: reason.trim() || undefined,
    })
    onClose()
    setReason('')
    setEndDate(null)
    setStartDate(minStart)
    setLeaveType('vacation')
  }

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ p: 0 }}>
        <HeaderSection>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${selectedType?.color}22 0%, ${selectedType?.color}44 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EventAvailableIcon sx={{ color: selectedType?.color, fontSize: 28 }} />
            </Box>
            <Box>
              <Box sx={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
                Request Leave
              </Box>
              <Box sx={{ fontSize: 14, color: '#64748b', mt: 0.5 }}>
                Schedule your time off in advance
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </HeaderSection>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <ModalContent>
          {createError && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              {createError}
            </Alert>
          )}

          <FormSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionIcon sx={{ color: '#6366f1', fontSize: 20 }} />
              <Box sx={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>
                Leave Type
              </Box>
            </Box>
            <TextField
              select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: selectedType?.color },
                  '&.Mui-focused fieldset': { borderColor: selectedType?.color },
                },
              }}
            >
              {TYPES.map(t => (
                <MenuItem key={t.value} value={t.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: t.color,
                      }}
                    />
                    {t.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </FormSection>

          <FormSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EventAvailableIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <Box sx={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>
                Date Range
              </Box>
              <Chip 
                label="3 days advance required" 
                size="small" 
                sx={{ 
                  ml: 'auto', 
                  background: '#fef3c7', 
                  color: '#92400e',
                  fontSize: 11,
                  fontWeight: 600,
                }} 
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(d) => {
                    setStartDate(d)
                    if (d && endDate && endDate <= d) setEndDate(null)
                  }}
                  shouldDisableDate={disableStart}
                  minDate={minStart}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': { borderColor: '#10b981' },
                        },
                      },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(d) => setEndDate(d)}
                  shouldDisableDate={disableEnd}
                  minDate={minEndDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                        },
                      },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
            <Alert 
              severity="info" 
              sx={{ 
                mt: 1, 
                borderRadius: 2, 
                background: '#eff6ff',
                '& .MuiAlert-icon': { color: '#2563eb' },
              }}
            >
              Start date must be at least 3 days from today. End date must be after start date.
            </Alert>
          </FormSection>

          <FormSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
              <Box sx={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>
                Reason (Optional)
              </Box>
            </Box>
            <TextField
              multiline
              minRows={3}
              maxRows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide additional details for your leave request..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#8b5cf6' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                },
              }}
            />
          </FormSection>
        </ModalContent>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1, background: '#f8fafc' }}>
        <Button 
          onClick={onClose} 
          disabled={creating}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600,
            color: '#64748b',
            '&:hover': { background: '#e2e8f0' },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!valid || creating} 
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            background: `linear-gradient(135deg, ${selectedType?.color} 0%, ${selectedType?.color}dd 100%)`,
            boxShadow: `0 4px 12px ${selectedType?.color}44`,
            '&:hover': {
              background: `linear-gradient(135deg, ${selectedType?.color}dd 0%, ${selectedType?.color}bb 100%)`,
            },
            '&:disabled': {
              background: '#e2e8f0',
              color: '#94a3b8',
            },
          }}
        >
          {creating ? 'Submitting...' : 'Submit Request'}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}