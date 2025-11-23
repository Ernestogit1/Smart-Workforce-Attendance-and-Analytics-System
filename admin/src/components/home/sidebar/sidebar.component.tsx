import { useMemo } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../../hooks/auth.hook'
import { useState } from 'react'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import InsightsIcon from '@mui/icons-material/Insights'

const drawerWidth = 260

export default function SidebarLayout() {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { to: '/dashboard/employee-acc-maker', label: 'Employee Account Maker', icon: <PersonAddIcon /> },
      { to: '/dashboard/monitor-attendance', label: 'Monitor Attendance', icon: <QueryStatsIcon /> },
      { to: '/dashboard/leave-requests', label: 'Leave Management', icon: <AssignmentTurnedInIcon /> },
      { to: '/dashboard/analytics', label: 'Analytics', icon: <InsightsIcon /> }, // added
    ],
    []
  )

  const isSelected = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(to)
  }

  const drawer = (
    <div>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap component="div" fontWeight={700}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {items.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              selected={isSelected(item.to)}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  const handleLogout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((s) => !s)}
            sx={{ mr: 2, display: { md: 'none' } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {items.find((i) => isSelected(i.to))?.label ?? 'Dashboard'}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Permanent drawer on md+ */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Temporary drawer on mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export { default } from '../../layouts/sidebar.layout'