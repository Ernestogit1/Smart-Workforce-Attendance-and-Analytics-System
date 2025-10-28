import { ReactNode } from 'react'
import { Box } from '@mui/material'

type Props = { children: ReactNode }
export default function EmployeeUpdateLayout({ children }: Props) {
  return <Box sx={{ maxWidth: 900, mx: 'auto', my: 2 }}>{children}</Box>
}