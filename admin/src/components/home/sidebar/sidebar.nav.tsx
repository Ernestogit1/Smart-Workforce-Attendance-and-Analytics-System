import { List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import type { NavItem } from './sidebar.items'

type Props = {
  items: NavItem[]
  isSelected: (to: string) => boolean
  onNavigate?: () => void
}

const NavItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 10,
  marginBottom: 5,
  padding: '10px 16px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow: '0 4px 12px rgba(58, 54, 219, 0.18)',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(58, 54, 219, 0.04)',
  },
}))

export default function SidebarNav({ items, isSelected, onNavigate }: Props) {
  return (
    <List sx={{ px: 0 }}>
      {items.map((item) => (
        <Box key={item.to}>
          <NavItemButton
            component={NavLink}
            to={item.to}
            selected={isSelected(item.to)}
            onClick={onNavigate}
          >
            <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </NavItemButton>
        </Box>
      ))}
    </List>
  )
}