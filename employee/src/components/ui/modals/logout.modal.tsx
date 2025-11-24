import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, CircularProgress } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

type Props = {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ open, loading, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <LogoutIcon color="error" />
          <Typography variant="h6" fontWeight={800}>Confirm Logout</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to logout from your account?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={!!loading} variant="text">No</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
          disabled={!!loading}
        >
          Yes, Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}