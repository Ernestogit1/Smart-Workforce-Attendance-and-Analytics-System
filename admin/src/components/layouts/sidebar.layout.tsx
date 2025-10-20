import { useMemo, useState, useCallback } from 'react'
import { 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer, 
  Toolbar, 
  useMediaQuery, 
  Typography,
  Avatar
} from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth.hook'
import SidebarNav from '../home/sidebar/sidebar.nav'
import SidebarAppBar from '../home/sidebar/sidebar.appbar'
import { navItems } from '../home/sidebar/sidebar.items'
import { styled } from '@mui/material/styles'

const drawerWidth = 280

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

const AppLogo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .logo-icon': {
    width: 40,
    height: 40,
    borderRadius: 8,
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 22,
    fontWeight: 700,
    marginRight: theme.spacing(1.5),
    boxShadow: '0 3px 10px rgba(58, 54, 219, 0.2)',
  },
  '& .logo-text': {
    fontWeight: 700,
    fontSize: 20,
    color: theme.palette.text.primary,
  }
}))

const UserProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

export default function SidebarLayout() {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMdUp = useMediaQuery('(min-width:900px)')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)

  const isSelected = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(to)
  }

  const currentTitle = useMemo(
    () => navItems.find((i) => isSelected(i.to))?.label ?? 'Dashboard',
    [location.pathname]
  )

  const handleLogout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const handleToggleMenu = useCallback(() => {
    if (isMdUp) {
      setDesktopOpen((s) => !s)
    } else {
      setMobileOpen((s) => !s)
    }
  }, [isMdUp])

  const drawer = (
    <div>
      <DrawerHeader>
        <AppLogo>
          <div className="logo-icon">A</div>
          <div className="logo-text">AdminOS</div>
        </AppLogo>
        
        <UserProfile>
          <Avatar 
            sx={{ 
              width: 70, 
              height: 70, 
              mb: 1.5,
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
              border: '3px solid white'
            }}
            src={user?.photoURL || undefined}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.displayName || 'Admin User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'admin@example.com'}
          </Typography>
        </UserProfile>
      </DrawerHeader>
      
      <Divider sx={{ opacity: 0.6 }} />
      
      <Box sx={{ px: 2, py: 2 }}>
        <SidebarNav 
          items={navItems} 
          isSelected={isSelected} 
          onNavigate={() => setMobileOpen(false)} 
        />
      </Box>
    </div>
  )

  return (
    <Box sx={{ display: 'flex', backgroundColor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />

      <SidebarAppBar 
        title={currentTitle} 
        onToggleMenu={handleToggleMenu} 
        onLogout={handleLogout}
        isDesktopOpen={desktopOpen}
        drawerWidth={drawerWidth}
      />

      {/* Desktop persistent drawer (hide/show) */}
      <Drawer
        variant="persistent"
        open={desktopOpen && isMdUp}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: (t) =>
              t.transitions.create('width', { easing: t.transitions.easing.sharp, duration: t.transitions.duration.enteringScreen }),
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen && !isMdUp}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (t) =>
            t.transitions.create(['margin', 'width'], {
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
    </Box>
  )
}