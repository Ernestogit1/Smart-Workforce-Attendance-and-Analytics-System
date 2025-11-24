import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import LogoutIcon from '@mui/icons-material/Logout'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

type Props = {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(1),
    minWidth: 400,
  },
}))

const IconContainer = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
}))

export default function LogoutModal({ open, loading, onClose, onConfirm }: Props) {
  return (
    <StyledDialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs">
      <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
        <IconContainer>
          <WarningAmberIcon sx={{ fontSize: 36, color: 'white' }} />
        </IconContainer>
        
        <Typography variant="h5" fontWeight={800} sx={{ mt: 3, mb: 1 }}>
          Confirm Logout
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Are you sure you want to logout from your admin account?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          disabled={!!loading}
          variant="outlined"
          size="large"
          sx={{ 
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!!loading}
          variant="contained"
          color="error"
          size="large"
          startIcon={<LogoutIcon />}
          sx={{ 
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          }}
        >
          {loading ? 'Logging out...' : 'Yes, Logout'}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}