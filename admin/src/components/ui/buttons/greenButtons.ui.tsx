import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const GreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: '#fff',
  textTransform: 'none',
  borderRadius: 8,
  padding: '10px 24px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}))

export default GreenButton