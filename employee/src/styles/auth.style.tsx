import type { SxProps, Theme } from '@mui/material/styles'

export const loginContainerSx: SxProps<Theme> = {
  minHeight: '100vh',
  maxHeight: '100vh',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
  position: 'fixed',
  top: 0,
  left: 0,
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '-150px',
    right: '-150px',
    animation: 'pulse 8s ease-in-out infinite',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    bottom: '-100px',
    left: '-100px',
    animation: 'pulse 10s ease-in-out infinite reverse',
  },
  '@keyframes pulse': {
    '0%, 100%': { 
      transform: 'scale(1) translate(0, 0)',
      opacity: 1,
    },
    '50%': { 
      transform: 'scale(1.1) translate(20px, 20px)',
      opacity: 0.8,
    },
  },
}

export const loginCardSx: SxProps<Theme> = {
  width: '420px',
  minWidth: '420px',
  maxWidth: '420px',
  height: 'auto',
  maxHeight: '85vh',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '36px',
  position: 'relative',
  zIndex: 10,
  boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.4)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxSizing: 'border-box',
  flexShrink: 0,
  overflowY: 'auto',
  border: 'none',
  outline: 'none',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(99, 102, 241, 0.3)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(99, 102, 241, 0.5)',
    },
  },
  '&:hover': {
    boxShadow: '0 40px 80px -12px rgba(0, 0, 0, 0.5)',
    transform: 'translateY(-4px)',
  },
  '&.MuiPaper-root': {
    backgroundImage: 'none',
  },
  '@media (max-width: 768px)': {
    width: '380px',
    minWidth: '380px',
    maxWidth: '380px',
    padding: '32px',
    maxHeight: '88vh',
  },
  '@media (max-width: 480px)': {
    width: '340px',
    minWidth: '340px',
    maxWidth: '340px',
    padding: '28px 24px',
    maxHeight: '90vh',
  },
  '@media (max-width: 380px)': {
    width: '300px',
    minWidth: '300px',
    maxWidth: '300px',
    padding: '24px 20px',
    maxHeight: '92vh',
  },
  '@media (max-height: 700px)': {
    padding: '24px 32px',
    maxHeight: '92vh',
  },
  '@media (max-height: 600px)': {
    padding: '20px 28px',
    maxHeight: '94vh',
  },
}

export const loginHeaderSx: SxProps<Theme> = {
  textAlign: 'center',
  marginBottom: '28px',
  animation: 'fadeInDown 0.6s ease-out',
  '@keyframes fadeInDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}

export const loginTitleSx: SxProps<Theme> = {
  fontSize: '26px',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #1e3c72 0%, #7e22ce 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  letterSpacing: '-0.5px',
  lineHeight: 1.2,
}

export const loginSubtitleSx: SxProps<Theme> = {
  color: '#64748b',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.6,
}

export const loginFormSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  animation: 'fadeIn 0.8s ease-out 0.2s both',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}

export const loginTextFieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: '#e2e8f0',
      borderWidth: '2px',
    },
    '&:hover': {
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: '#cbd5e1',
      },
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
      '& fieldset': {
        borderColor: '#6366f1',
        borderWidth: '2px',
      },
    },
    '&.Mui-disabled': {
      backgroundColor: '#f1f5f9',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    fontSize: '13px',
    color: '#475569',
    '&.Mui-focused': {
      color: '#6366f1',
      fontWeight: 600,
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 12px',
    '&::placeholder': {
      color: '#94a3b8',
      opacity: 1,
    },
  },
}

export const loginButtonSx: SxProps<Theme> = {
  padding: '14px',
  marginTop: '6px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  border: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    boxShadow: '0 16px 32px -8px rgba(99, 102, 241, 0.6)',
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 6px 16px -4px rgba(99, 102, 241, 0.5)',
  },
  '&.Mui-disabled': {
    background: '#e2e8f0',
    color: '#94a3b8',
    boxShadow: 'none',
  },
}

export const loginErrorSx: SxProps<Theme> = {
  padding: '14px',
  borderRadius: '12px',
  backgroundColor: '#fef2f2',
  border: '2px solid #fecaca',
  color: '#dc2626',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px',
  animation: 'shake 0.5s ease-in-out',
  '@keyframes shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-8px)' },
    '75%': { transform: 'translateX(8px)' },
  },
}

export const loginDividerSx: SxProps<Theme> = {
  marginY: '24px',
  '&::before, &::after': {
    borderColor: '#e2e8f0',
  },
  '& .MuiDivider-wrapper': {
    paddingX: '16px',
  },
}

export const loginFooterSx: SxProps<Theme> = {
  textAlign: 'center',
  marginTop: '24px',
  color: '#64748b',
  fontSize: '14px',
  animation: 'fadeIn 1s ease-out 0.4s both',
  '& a': {
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}