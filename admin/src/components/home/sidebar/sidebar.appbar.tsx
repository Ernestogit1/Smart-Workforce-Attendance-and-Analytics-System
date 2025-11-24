import { AppBar, Toolbar, IconButton, Typography, Button, Box, alpha, useTheme, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useThemeMode } from '../../../contexts/theme.context'

type Props = {
  title: string
  onToggleMenu: () => void
  onLogout: () => void
  isDesktopOpen: boolean
  drawerWidth: number
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isDesktopOpen' && prop !== 'drawerWidth',
})<{ isDesktopOpen?: boolean; drawerWidth: number }>(({ theme, isDesktopOpen, drawerWidth }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #1e293b 0%, #334155 100%)'
    : 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)',
  color: theme.palette.text.primary,
  boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isDesktopOpen && {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
}))

const ActionIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  borderRadius: 10,
  width: 42,
  height: 42,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: alpha(theme.palette.primary.main, 0.2),
  }
}))

export default function SidebarAppBar({ 
  title, 
  onToggleMenu, 
  onLogout,
  isDesktopOpen,
  drawerWidth
}: Props) {
  const theme = useTheme()
  const { mode, toggleTheme } = useThemeMode()
  
  return (
    <StyledAppBar 
      position="fixed" 
      isDesktopOpen={isDesktopOpen}
      drawerWidth={drawerWidth}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            onClick={onToggleMenu}
            sx={{ mr: 2 }}
            aria-label="toggle sidebar"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} noWrap>
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <ActionIcon size="small" onClick={toggleTheme}>
              {mode === 'light' ? <Brightness4 fontSize="small" /> : <Brightness7 fontSize="small" />}
            </ActionIcon>
          </Tooltip>
          
          <Button 
            variant="contained" 
            onClick={onLogout}
            color="secondary"
            size="small"
            sx={{ ml: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  )
}