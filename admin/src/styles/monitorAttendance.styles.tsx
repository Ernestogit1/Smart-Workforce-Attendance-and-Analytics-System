import  type { SxProps, Theme } from '@mui/material'

export const filtersCardSx: SxProps<Theme> = {
  mb: 2,
}

export const tableCardSx: SxProps<Theme> = {
  '& .MuiDataGrid-columnHeaders': { fontWeight: 700 },
  '& .MuiDataGrid-cell': { alignItems: 'center' },
}