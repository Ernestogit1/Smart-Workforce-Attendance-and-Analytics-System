import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import Sidebar from '../ui/sidebar/sidebar.component'

const DRAWER_WIDTH = 280
const COLLAPSED_WIDTH = 72

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: 'linear-gradient(135deg, #f6f9ff 0%, #eef6ff 100%)',
          minHeight: '100vh',
          transition: 'margin 0.3s ease',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 4,
            boxShadow: '0 12px 28px rgba(0,0,0,.08)',
            padding: 4,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}