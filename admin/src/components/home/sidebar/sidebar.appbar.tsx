import { AppBar, Toolbar, IconButton, Typography, Button, Avatar, Badge, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { Notifications, Search, Brightness4 } from '@mui/icons-material'

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
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
  backgroundColor: theme.palette.background.default,
  borderRadius: 10,
  width: 42,
  height: 42,
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  }
}))

export default function SidebarAppBar({ 
  title, 
  onToggleMenu, 
  onLogout,
  isDesktopOpen,
  drawerWidth
}: Props) {
  return (
    <StyledAppBar 
      position="fixed" 
      isDesktopOpen={isDesktopOpen}
      drawerWidth={drawerWidth}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
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
          <ActionIcon color="inherit" size="small">
            <Search fontSize="small" />
          </ActionIcon>
          
          <ActionIcon color="inherit" size="small">
            <Brightness4 fontSize="small" />
          </ActionIcon>
          
          <ActionIcon color="inherit" size="small">
            <Badge badgeContent={3} color="error">
              <Notifications fontSize="small" />
            </Badge>
          </ActionIcon>
          
          <Button 
            variant="contained" 
            onClick={onLogout}
            color="secondary"
            size="small"
            sx={{ 
              ml: 1,
              boxShadow: '0 4px 12px rgba(253, 140, 115, 0.2)',
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  )
}