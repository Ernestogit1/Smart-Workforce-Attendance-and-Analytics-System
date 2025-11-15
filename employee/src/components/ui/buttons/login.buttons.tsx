import type { ReactNode } from 'react'
import { Box, Card, Container } from '@mui/material'
import { loginContainerSx, loginCardSx } from '../../../styles/auth.style'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={loginContainerSx}>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Card sx={loginCardSx} elevation={0} variant="elevation">
          {children}
        </Card>
      </Container>
    </Box>
  )
}