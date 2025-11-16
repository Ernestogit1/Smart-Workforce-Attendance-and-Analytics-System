import { styled } from '@mui/material/styles'
import { Box, Dialog } from '@mui/material'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
}))

export const HeaderSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

export const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}))

export const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}))