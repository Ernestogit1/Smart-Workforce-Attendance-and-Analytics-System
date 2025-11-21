import { styled, alpha } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const ReportContainer = styled(Box)({
  padding: '24px',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  '@media (min-width: 900px)': { padding: '40px' },
})

export const HeaderSection = styled(Box)({
  marginBottom: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const Section = styled(Box)({
  marginBottom: '32px',
})

export const KpiGrid = styled(Box)({
  display: 'grid',
  gap: 20,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  marginBottom: '32px',
})

export const KpiCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  position: 'relative',
  overflow: 'hidden',
  background: '#fff',
  border: 'none',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
}))

export const KpiIconBox = styled(Box)({
  width: 56,
  height: 56,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 28,
  marginBottom: '8px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
})

export const TimelineWrapper = styled(Paper)({
  borderRadius: 24,
  overflow: 'hidden',
  background: '#fff',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
})

export const TimelineHeader = styled(Box)({
  padding: '24px 28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
})

export const ScrollArea = styled(Box)({
  maxHeight: 420,
  overflowY: 'auto',
  '&::-webkit-scrollbar': { width: 10 },
  '&::-webkit-scrollbar-track': { background: '#f1f5f9' },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 5,
    '&:hover': { background: '#667eea' },
  },
})

export const TimelineRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '140px 120px 140px 140px 120px',
  padding: '16px 28px',
  fontSize: 14,
  alignItems: 'center',
  borderBottom: '1px solid #f1f5f9',
  transition: '0.3s',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': {
    background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    transform: 'translateX(4px)',
  },
}))

export const MonthSummaryBox = styled(Paper)({
  padding: '28px',
  borderRadius: 24,
  background: '#fff',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  border: '2px solid transparent',
  backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
})

export const SummaryRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  fontSize: 15,
  gap: 16,
  padding: '12px 0',
  alignItems: 'center',
})

export const HeatmapWrapper = styled(Paper)({
  padding: '28px',
  borderRadius: 24,
  background: '#fff',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
})

export const HeatmapGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 8,
  marginBottom: '20px',
})

export const HeatCell = styled(Box)({
  aspectRatio: '1 / 1',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'scale(1.15) rotate(5deg)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    zIndex: 10,
    border: '2px solid #667eea',
  },
})

export const InsightsBox = styled(Paper)({
  padding: '28px',
  borderRadius: 24,
  background: '#fff',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
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
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
  },
})

export const ComparisonBox = styled(Paper)({
  padding: '28px',
  borderRadius: 24,
  background: '#fff',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
})

export const ComparisonRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '140px 80px 80px 1fr',
  fontSize: 14,
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #f1f5f9',
  '&:last-child': { borderBottom: 'none' },
})

export const MonthSelector = styled(Box)({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  background: '#fff',
  padding: '12px 20px',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '2px solid transparent',
  transition: '0.3s',
  '&:hover': {
    border: '2px solid #667eea',
    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.2)',
  },
})

export const StatusChipColor = (status: string) => {
  if (status === 'Present') return '#10b981'
  if (status === 'Late') return '#f59e0b'
  if (status === 'Absent') return '#ef4444'
  return '#64748b'
}

export const HeatColor = (status: string) => {
  if (status === 'Present') return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  if (status === 'Late') return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  if (status === 'Absent') return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  return 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
}

export const HeaderGradientText = {
  fontWeight: 900,
  fontSize: '2.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.5px',
  lineHeight: 1.2,
}

export const SectionTitle = {
  fontWeight: 800,
  fontSize: '1.5rem',
  color: '#1e293b',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}