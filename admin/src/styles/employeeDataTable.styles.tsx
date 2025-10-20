import { Box, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const TablePage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const TableCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
}))