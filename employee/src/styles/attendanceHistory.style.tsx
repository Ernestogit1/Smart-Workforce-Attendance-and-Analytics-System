import { styled } from '@mui/material/styles'
import { Box, Paper, Card, alpha } from '@mui/material'

// Container
export const HistoryContainer = styled(Box)({
  padding: '24px',
  '@media (min-width: 600px)': {
    padding: '24px',
  },
  '@media (min-width: 960px)': {
    padding: '32px',
  },
})

// Header Section
export const HeaderSection = styled(Box)({
  marginBottom: '32px',
})

export const headerTitleSx = {
  fontWeight: 800,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
}

// Stats Cards
export const statsGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
  gap: 2,
  mb: 4,
}

export const StatCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: '50%',
    backgroundColor: alpha('#fff', 0.1),
  },
}))

export const statCardIconBoxSx = {
  width: 48,
  height: 48,
  borderRadius: 2,
  bgcolor: alpha('#fff', 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const statCardContentSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  position: 'relative',
  zIndex: 1,
}

// Loading & Error States
export const loadingContainerSx = {
  display: 'flex',
  justifyContent: 'center',
  py: 8,
}

export const loadingSpinnerSx = {
  color: '#667eea',
}

export const errorPaperSx = {
  p: 3,
  borderRadius: 3,
  bgcolor: '#fee2e2',
  border: '1px solid #fecaca',
  textAlign: 'center',
}

// Records Section
export const recordsHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 3,
}

export const recordsListStackSx = {
  spacing: 2,
}

// Record Card
export const RecordCard = styled(Card)({
  borderRadius: '24px',
  border: '1px solid #e5e7eb',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
    borderColor: '#667eea',
  },
})

export const recordCardContentSx = {
  p: 3,
}

export const recordCardLayoutSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 3,
}

// Date Badge
export const dateBadgeSx = {
  minWidth: 80,
  height: 80,
  borderRadius: 2.5,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
}

// Time Info Box
export const timeInfoBoxSx = (color: string) => ({
  width: 36,
  height: 36,
  borderRadius: 1.5,
  bgcolor: alpha(color, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const timeInfoContainerSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
}

// Status Chip
export const statusChipSx = (isLate: boolean) => ({
  height: 36,
  px: 1,
  fontWeight: 700,
  fontSize: '0.875rem',
  bgcolor: isLate ? alpha('#ef4444', 0.1) : alpha('#10b981', 0.1),
  color: isLate ? '#ef4444' : '#10b981',
  border: `1px solid ${isLate ? alpha('#ef4444', 0.3) : alpha('#10b981', 0.3)}`,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
})

// Empty State
export const emptyStatePaperSx = {
  p: 8,
  borderRadius: 3,
  border: '2px dashed #e5e7eb',
  textAlign: 'center',
  bgcolor: '#fafafa',
}

export const emptyStateIconSx = {
  fontSize: 64,
  color: '#cbd5e1',
  mb: 2,
}

// Modal Styles
export const modalHeaderSx = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  p: 3,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: '50%',
    bgcolor: alpha('#fff', 0.1),
  },
}

export const modalCloseButtonSx = {
  position: 'absolute',
  right: 12,
  top: 12,
  color: '#fff',
  bgcolor: alpha('#fff', 0.2),
  '&:hover': {
    bgcolor: alpha('#fff', 0.3),
  },
  zIndex: 1,
}

export const modalHeaderContentSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  position: 'relative',
  zIndex: 1,
}

export const modalIconBoxSx = {
  width: 56,
  height: 56,
  borderRadius: 2,
  bgcolor: alpha('#fff', 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const modalStatusBadgeSx = {
  display: 'flex',
  justifyContent: 'center',
  mb: 3,
}

export const modalStatusChipSx = (isLate: boolean) => ({
  height: 44,
  px: 2,
  fontWeight: 700,
  fontSize: '1rem',
  bgcolor: isLate ? alpha('#ef4444', 0.1) : alpha('#10b981', 0.1),
  color: isLate ? '#ef4444' : '#10b981',
  border: `2px solid ${isLate ? alpha('#ef4444', 0.3) : alpha('#10b981', 0.3)}`,
  '& .MuiChip-icon': {
    color: 'inherit',
    fontSize: 24,
  },
})

export const modalDetailPaperSx = (color: string) => ({
  p: 2.5,
  mb: 2,
  borderRadius: 2,
  bgcolor: alpha(color, 0.05),
  border: `1px solid ${alpha(color, 0.2)}`,
})

export const modalDetailIconBoxSx = (color: string) => ({
  width: 48,
  height: 48,
  borderRadius: 2,
  bgcolor: alpha(color, 0.15),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const modalDetailLayoutSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
}

// Gradient Backgrounds
export const gradientPurple = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
export const gradientPink = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
export const gradientBlue = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'