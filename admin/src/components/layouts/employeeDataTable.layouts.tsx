import { ReactNode } from 'react'
import { Box } from '@mui/material'

type Props = { children: ReactNode }

export default function EmployeeDataTableLayout({ children }: Props) {
  return <Box sx={{ maxWidth: 1400, mx: 'auto', my: 2 }}>{children}</Box>
}