import { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  AccessTime as AccessTimeIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import HistoryIcon from '@mui/icons-material/History'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../store/index.store'
import { logoutThunk } from '../../../store/slices/auth.slice'
import TimeInOutModal from '../modals/time-in-out.modals'
import {
  sidebarDrawerSx,
  sidebarHeaderSx,
  sidebarUserInfoSx,
  sidebarListSx,
  sidebarListItemSx,
  sidebarFooterSx,
  sidebarCollapsedDrawerSx,
} from '../../../styles/sidebar.style'
import { useNavigate } from 'react-router-dom'

const DRAWER_WIDTH = 280
const COLLAPSED_WIDTH = 72

export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((s: RootState) => s.auth)
  const [open, setOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'timeIn' | 'timeOut'>('timeIn')
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await dispatch(logoutThunk())
    }
  }

  const handleTimeInClick = () => {
    setModalType('timeIn')
    setModalOpen(true)
  }

  const handleTimeOutClick = () => {
    setModalType('timeOut')
    setModalOpen(true)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, action: () => navigate('/') },
    { text: 'Time In', icon: <AccessTimeIcon />, action: handleTimeInClick },
    { text: 'Time Out', icon: <AccessTimeIcon />, action: handleTimeOutClick },
    { text: 'Leave Requests', icon: <BeachAccessIcon />, action: () => navigate('/leave-details') },
    { text: 'Attendance History', icon: <HistoryIcon />, action: () => navigate('/attendance-history') },
    { text: 'Reports', icon: <AssessmentIcon />, action: () => {} },
  ]

  // Get profile image from user object (photoURL from Firebase or profileImage from backend)
  const profileImage = user?.photoURL || user?.profileImage

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={open ? sidebarDrawerSx(DRAWER_WIDTH) : sidebarCollapsedDrawerSx(COLLAPSED_WIDTH)}
      >
        {/* Header */}
        <Box sx={sidebarHeaderSx}>
          {open && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Employee Portal
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#667eea' }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Divider />

        {/* User Info */}
        {open && (
          <Box sx={sidebarUserInfoSx}>
            <Avatar
              src={profileImage}
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 1,
                border: '3px solid #fff',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              {!profileImage && <AccountCircleIcon sx={{ fontSize: 40 }} />}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Employee'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
              {user?.email || ''}
            </Typography>
          </Box>
        )}

        {!open && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Avatar
              src={profileImage}
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid #fff',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              {!profileImage && <AccountCircleIcon sx={{ fontSize: 28 }} />}
            </Avatar>
          </Box>
        )}

        <Divider />

        {/* Menu Items */}
        <List sx={sidebarListSx}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? item.text : ''} placement="right">
                <ListItemButton
                  onClick={item.action}
                  sx={sidebarListItemSx(open)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: '#667eea',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={sidebarFooterSx}>
          <Divider sx={{ mb: 1 }} />
          <ListItem disablePadding>
            <Tooltip title={!open ? 'Logout' : ''} placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  ...sidebarListItemSx(open),
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                    '& .MuiListItemIcon-root': {
                      color: '#ef4444',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#ef4444',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: '#ef4444',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Logout"
                    sx={{ '& .MuiListItemText-primary': { fontWeight: 600 } }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </Box>
      </Drawer>

      {/* Time In/Out Modal */}
      <TimeInOutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </>
  )
}