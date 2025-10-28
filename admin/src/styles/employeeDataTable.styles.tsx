import { Box, Paper, Typography, InputAdornment, TextField, Button, styled, alpha, keyframes } from '@mui/material'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const TablePage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  animation: `${fadeIn} 0.5s ease-out`,
}))

export const TableCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: 0,
  borderRadius: 20,
  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    zIndex: 1,
  }
}))

export const TableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3, 3, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

export const TableTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}))

export const TableDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}))

export const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create(['box-shadow', 'background-color']),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    }
  },
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  boxShadow: 'none',
  padding: theme.spacing(1, 2),
  transition: theme.transitions.create(['background-color', 'box-shadow', 'transform']),
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  }
}))

export const UpdateButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  }
}))

export const RestrictButton = styled(ActionButton, {
  shouldForwardProp: (prop) => prop !== 'isRestricted',
})<{ isRestricted?: boolean }>(({ theme, isRestricted }) => ({
  backgroundColor: isRestricted 
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.warning.main, 0.1),
  color: isRestricted ? theme.palette.success.main : theme.palette.warning.main,
  '&:hover': {
    backgroundColor: isRestricted 
      ? alpha(theme.palette.success.main, 0.15)
      : alpha(theme.palette.warning.main, 0.15),
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  }
}))

export const StatusChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color?: string }>(({ theme, color = 'default' }) => {
  const colorMap: Record<string, any> = {
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    info: theme.palette.info,
    default: {
      main: theme.palette.grey[500],
      light: theme.palette.grey[100]
    }
  }
  const colorObj = colorMap[color] || colorMap.default
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1.2),
    borderRadius: 16,
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1,
    color: colorObj.main,
    backgroundColor: alpha(colorObj.main, 0.12),
    border: `1px solid ${alpha(colorObj.main, 0.24)}`,
    '& .MuiBox-icon': {
      fontSize: 12,
      marginRight: 4
    }
  }
})

export const ProfileCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}))

export const UserAvatar = styled(Box)(({ theme }) => ({
  width: 38,
  height: 38,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.light,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  fontSize: '1rem',
  border: `2px solid ${theme.palette.background.paper}`,
  '& img': {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  }
}))