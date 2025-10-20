import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const RedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: '#fff',
  textTransform: 'none',
  borderRadius: 8,
  padding: '10px 24px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}))

export default RedButton