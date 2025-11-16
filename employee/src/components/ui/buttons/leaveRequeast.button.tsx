import { Button } from '@mui/material'
import VacationIcon from '@mui/icons-material/BeachAccess'

export default function LeaveRequeastButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<VacationIcon />}
      onClick={onClick}
      sx={{ fontWeight: 600, textTransform: 'none', borderRadius: 2 }}
    >
      Request Leave
    </Button>
  )
}