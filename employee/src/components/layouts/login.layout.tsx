import type { ReactNode } from 'react'
import { Box, Paper } from '@mui/material'
import { loginContainerSx, loginCardSx } from '../../styles/auth.style'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={loginContainerSx}>
      <Paper 
        sx={loginCardSx}
        elevation={0}
        square={false}
      >
        {children}
      </Paper>
    </Box>
  )
}