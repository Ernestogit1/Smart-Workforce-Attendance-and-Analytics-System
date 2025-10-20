import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
}))

export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}))

export const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
}))