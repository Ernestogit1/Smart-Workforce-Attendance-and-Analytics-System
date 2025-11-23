import { Card, CardContent, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import type { RankingRow } from '../../../api/analythicDashboard'

type Props = { rows: RankingRow[]; loading?: boolean }

export default function EmployeeRanking({ rows, loading }: Props) {
  const columns = useMemo<GridColDef<RankingRow>[]>(() => [
    { field: 'rank', headerName: 'Rank', width: 80, sortable: true, valueGetter: (_v, r) => r.rank ?? 0 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 180, sortable: true },
    { field: 'score', headerName: 'Attendance Score', flex: 0.8, minWidth: 160, sortable: true },
    { field: 'absences', headerName: 'Total Absences', flex: 0.8, minWidth: 160, sortable: true },
    { field: 'lates', headerName: 'Total Lates', flex: 0.8, minWidth: 140, sortable: true },
  ], [])

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Employee Ranking</Typography>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={!!loading}
          getRowId={(r) => r.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'score', sort: 'desc' }] },
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': { fontWeight: 700 },
          }}
        />
      </CardContent>
    </Card>
  )
}