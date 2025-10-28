import { ReactNode } from 'react'
import { Box } from '@mui/material'

type Props = { children: ReactNode }

export default function EmployeeDataTableLayout({ children }: Props) {
  return <Box sx={{ maxWidth: 1600, width: '100%', mx: 'auto', my: 2 }}>{children}</Box>
}