import type { SxProps, Theme } from '@mui/material'

export const tableCardSx: SxProps<Theme> = {
  '& .MuiDataGrid-columnHeaders': { fontWeight: 700, position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'background.paper' },
  '& .MuiDataGrid-cell': { alignItems: 'center' },
}