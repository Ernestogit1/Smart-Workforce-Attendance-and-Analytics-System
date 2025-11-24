import { useMemo, useState, useCallback } from 'react'
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  Toolbar, 
  useMediaQuery, 
  Typography,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth.hook'
import SidebarNav from '../home/sidebar/sidebar.nav'
import SidebarAppBar from '../home/sidebar/sidebar.appbar'
import { navItems } from '../home/sidebar/sidebar.items'
import { styled } from '@mui/material/styles'
import LogoutModal from '../ui/modals/logout.modal'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

const drawerWidth = 280

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' 
      : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    color: theme.palette.text.primary,
  },
}))

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2.5),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}))

const AppLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
}))

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
}))

const UserProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}))

export default function SidebarLayout() {
  const theme = useTheme()
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isSelected = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(to)
  }

  const currentTitle = useMemo(
    () => navItems.find((i) => isSelected(i.to))?.label ?? 'Dashboard',
    [location.pathname]
  )

  const handleLogoutClick = () => {
    setLogoutOpen(true)
  }

  const handleLogoutConfirm = async () => {
    try {
      setLoggingOut(true)
      await signOut()
      setLogoutOpen(false)
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  const handleToggleMenu = useCallback(() => {
    if (isMdUp) {
      setDesktopOpen((s) => !s)
    } else {
      setMobileOpen((s) => !s)
    }
  }, [isMdUp])

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DrawerHeader>
        <AppLogo>
          <LogoIcon>
            <AdminPanelSettingsIcon sx={{ fontSize: 28, color: 'white' }} />
          </LogoIcon>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              Admin Panel
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Management System
            </Typography>
          </Box>
        </AppLogo>
        
        <UserProfile>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              fontWeight: 700,
            }}
            src={user?.photoURL || undefined}
          >
            {user?.displayName?.[0]?.toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {user?.displayName || 'Admin User'}
            </Typography>
            <Chip
              label="Administrator"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            />
          </Box>
        </UserProfile>
      </DrawerHeader>
      
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
        <SidebarNav 
          items={navItems} 
          isSelected={isSelected} 
          onNavigate={() => setMobileOpen(false)} 
          onLogout={handleLogoutClick}
        />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <SidebarAppBar 
        title={currentTitle} 
        onToggleMenu={handleToggleMenu} 
        onLogout={handleLogoutClick}
        isDesktopOpen={desktopOpen}
        drawerWidth={drawerWidth}
      />

      <StyledDrawer
        variant="persistent"
        open={desktopOpen && isMdUp}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {drawer}
      </StyledDrawer>

      <StyledDrawer
        variant="temporary"
        open={mobileOpen && !isMdUp}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (t) => t.transitions.create(['margin', 'width'], {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.enteringScreen,
          }),
          width: {
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
            xs: '100%',
          },
          ml: {
            md: desktopOpen ? `${drawerWidth}px` : 0,
            xs: 0,
          },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <LogoutModal
        open={logoutOpen}
        loading={loggingOut}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </Box>
  )
}