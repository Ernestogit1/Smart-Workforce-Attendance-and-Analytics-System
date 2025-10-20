import { ReactNode } from 'react'
import { Box } from '@mui/material'

type Props = { children: ReactNode }
export default function EmployeeAccMakerLayout({ children }: Props) {
  return <Box sx={{ maxWidth: 1000, mx: 'auto', my: 2 }}>{children}</Box>
}