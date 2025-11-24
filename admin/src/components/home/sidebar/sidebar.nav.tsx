import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, alpha, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import LogoutIcon from '@mui/icons-material/Logout'
import type { NavItem } from './sidebar.items'

type Props = {
  items: NavItem[]
  isSelected: (to: string) => boolean
  onNavigate?: () => void
  onLogout: () => void
}

const NavItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  margin: '4px 12px',
  padding: '12px 16px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.text.primary,
    transform: 'translateX(4px)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '&.Mui-selected': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: '#ffffff',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
    },
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      transform: 'translateX(4px)',
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: theme.palette.text.secondary,
    transition: 'color 0.2s',
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
}))

const LogoutButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  margin: '4px 12px',
  padding: '12px 16px',
  color: theme.palette.text.secondary,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: theme.palette.text.secondary,
    transition: 'color 0.2s',
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
}))

export default function SidebarNav({ items, isSelected, onNavigate, onLogout }: Props) {
  const theme = useTheme()
  
  return (
    <List sx={{ px: 0 }}>
      {items.map((item) => (
        <ListItem key={item.to} disablePadding>
          <NavItemButton
            component={NavLink}
            to={item.to}
            selected={isSelected(item.to)}
            onClick={onNavigate}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </NavItemButton>
        </ListItem>
      ))}
      
      <Divider sx={{ my: 2, mx: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />
      
      <ListItem disablePadding>
        <LogoutButton onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </LogoutButton>
      </ListItem>
    </List>
  )
}