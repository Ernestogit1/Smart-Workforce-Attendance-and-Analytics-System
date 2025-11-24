import { Dialog, DialogContent, DialogActions, Button, Typography, Stack, Box } from '@mui/material'
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
    overflow: 'visible',
  },
}))

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -8,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    opacity: 0.2,
    animation: 'pulse 2s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)', opacity: 0.2 },
    '50%': { transform: 'scale(1.1)', opacity: 0.3 },
  },
}))

export default function LogoutModal({ open, loading, onClose, onConfirm }: Props) {
  return (
    <StyledDialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs">
      <DialogContent sx={{ pt: 5, pb: 3, textAlign: 'center' }}>
        <IconContainer>
          <WarningAmberIcon sx={{ fontSize: 44, color: 'white' }} />
        </IconContainer>
        
        <Typography 
          variant="h5" 
          fontWeight={800} 
          sx={{ 
            mt: 3, 
            mb: 1.5,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Confirm Logout
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            px: 2,
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to logout from your account? You'll need to sign in again to access your dashboard.
        </Typography>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 3, 
          pb: 3, 
          gap: 1.5, 
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={onClose}
          disabled={!!loading}
          variant="outlined"
          size="large"
          sx={{ 
            minWidth: 130,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
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
          startIcon={!loading && <LogoutIcon />}
          sx={{ 
            minWidth: 130,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
            },
          }}
        >
          {loading ? 'Logging out...' : 'Yes, Logout'}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}