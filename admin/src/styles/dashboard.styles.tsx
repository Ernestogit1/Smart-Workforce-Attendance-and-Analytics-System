import { styled } from '@mui/material/styles'
import { Box, Paper, Card } from '@mui/material'

export const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: '#fff',
  marginBottom: theme.spacing(3),
  boxShadow: '0 10px 25px rgba(58, 54, 219, 0.18)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '170px',
    height: '170px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-40px',
    left: '20%',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}))

export const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}))

export const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid rgba(230, 232, 240, 0.8)',
  boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.08)',
    borderColor: 'transparent',
  },
}))

export const IconContainer = styled(Box)(({ theme }) => ({
  width: 65,
  height: 65,
  borderRadius: 15,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1.5),
  '&.primary': {
    backgroundColor: 'rgba(58, 54, 219, 0.1)',
    color: theme.palette.primary.main,
  },
  '&.info': {
    backgroundColor: 'rgba(71, 163, 255, 0.1)',
    color: theme.palette.info.main,
  },
  '&.success': {
    backgroundColor: 'rgba(56, 181, 158, 0.1)',
    color: theme.palette.success.main,
  },
  '&.warning': {
    backgroundColor: 'rgba(251, 190, 69, 0.1)',
    color: theme.palette.warning.main,
  },
}))