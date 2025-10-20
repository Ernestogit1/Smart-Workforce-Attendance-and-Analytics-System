import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const Page = styled(Box)(({ theme }) => ({
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
}))

export const Card = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 440,
  padding: theme.spacing(5),
  borderRadius: 20,
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  backgroundColor: theme.palette.background.paper,
}))

export const Logo = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto 24px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  display: 'grid',
  placeItems: 'center',
  fontSize: 32,
  fontWeight: 700,
  color: '#fff',
}))