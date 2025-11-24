import { styled } from '@mui/material/styles'
import { Box, Drawer, ListItemButton } from '@mui/material'

export const DRAWER_WIDTH = 280

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    borderRight: 'none',
    color: 'white',
  },
}))

export const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
}))

export const LogoIcon = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
}))

export const NavItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  margin: '4px 12px',
  padding: '12px 16px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'white',
    transform: 'translateX(4px)',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
  },
  '&.Mui-selected': {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      transform: 'translateX(4px)',
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'color 0.2s',
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
}))

export const ProfileSection = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(0, 0, 0, 0.2)',
}))

export const LogoutButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 16px',
  color: 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    '& .MuiListItemIcon-root': {
      color: '#ef4444',
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'color 0.2s',
  },
}))