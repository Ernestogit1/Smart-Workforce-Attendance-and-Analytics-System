import { styled, keyframes } from '@mui/material/styles'
import { Box, Paper, TextField, Button, Typography, InputLabel, alpha } from '@mui/material'

// Subtle slide-in animation
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  animation: `${slideIn} 0.5s ease-out`,
}))

export const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3a36db 0%, #47a3ff 100%)',
  },
}))

export const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  background: 'linear-gradient(90deg, #3a36db 0%, #47a3ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${slideIn} 0.6s ease-out`,
}))

export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: 'relative',
  padding: theme.spacing(3, 0),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

export const FormSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(58, 54, 219, 0.2)',
    },
  },
}))

export const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
}))

export const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1, 4),
  boxShadow: '0 4px 14px 0 rgba(58, 54, 219, 0.39)',
  background: 'linear-gradient(90deg, #3a36db 0%, #47a3ff 100%)',
  fontWeight: 600,
  '&:hover': {
    boxShadow: '0 6px 20px 0 rgba(58, 54, 219, 0.5)',
    background: 'linear-gradient(90deg, #2a288c 0%, #3787d8 100%)',
  },
}))

export const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,
}))

export const FileUploadContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: 12,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.background.default, 0.9),
  },
}))

export const AvatarPreview = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  overflow: 'hidden',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
}))

export const StatusBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(4),
  right: theme.spacing(4),
  padding: theme.spacing(0.5, 2),
  borderRadius: 50,
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))