import type { SxProps, Theme } from '@mui/material/styles'

export const sidebarDrawerSx = (drawerWidth: number): SxProps<Theme> => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflowX: 'hidden',
  },
})

export const sidebarCollapsedDrawerSx = (collapsedWidth: number): SxProps<Theme> => ({
  width: collapsedWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: collapsedWidth,
    boxSizing: 'border-box',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflowX: 'hidden',
  },
})

export const sidebarHeaderSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  minHeight: 64,
}

export const sidebarUserInfoSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px 16px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
}

export const sidebarListSx: SxProps<Theme> = {
  flex: 1,
  pt: 2,
}

export const sidebarListItemSx = (open: boolean): SxProps<Theme> => ({
  minHeight: 48,
  justifyContent: open ? 'initial' : 'center',
  px: 2.5,
  my: 0.5,
  mx: 1,
  borderRadius: 2,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f1f5f9',
    transform: 'translateX(4px)',
  },
  '& .MuiListItemText-primary': {
    fontWeight: 600,
    fontSize: '14px',
    color: '#475569',
  },
})

export const sidebarFooterSx: SxProps<Theme> = {
  mt: 'auto',
  pb: 2,
}