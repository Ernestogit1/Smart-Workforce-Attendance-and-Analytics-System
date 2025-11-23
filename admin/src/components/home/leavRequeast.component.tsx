import { useMemo, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Stack, Button, Divider, Alert, Snackbar, Chip,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useLeaveRequests } from '../../hooks/leavRequeast.hooks'
import { tableCardSx } from '../../styles/leavRequeast.style'
import type { LeaveRow } from '../../store/slices/leavRequeast.slice'

const fmtDate = (iso?: string) => (iso ? dayjs(iso).format('MMM D, YYYY') : '—')

export default function LeaveManagementComponent() {
  const { rows, loading, error, snackbar, approve, deny, hideSnackbar, refresh } = useLeaveRequests()
  const [actingId, setActingId] = useState<string | null>(null)

  const columns = useMemo<GridColDef<LeaveRow>[]>(() => [
    { field: 'employeeName', headerName: 'Employee Name', flex: 1.2, minWidth: 180, sortable: true },
    { field: 'leaveType', headerName: 'Leave Type', flex: 0.8, minWidth: 140, sortable: true },
    {
      field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 140, sortable: true,
      renderCell: (p) => <>{fmtDate(p?.row?.startDate)}</>,
      sortComparator: (_v1, _v2, p1, p2) =>
        (p1?.row?.startDate ? dayjs(p1.row.startDate).valueOf() : 0) -
        (p2?.row?.startDate ? dayjs(p2.row.startDate).valueOf() : 0),
    },
    {
      field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 140, sortable: true,
      renderCell: (p) => <>{fmtDate(p?.row?.endDate)}</>,
      sortComparator: (_v1, _v2, p1, p2) =>
        (p1?.row?.endDate ? dayjs(p1.row.endDate).valueOf() : 0) -
        (p2?.row?.endDate ? dayjs(p2.row.endDate).valueOf() : 0),
    },
    { field: 'reason', headerName: 'Reason', flex: 1.2, minWidth: 220, sortable: false },
    {
      field: 'status', headerName: 'Status', flex: 0.6, minWidth: 120, sortable: true,
      renderCell: (p) => {
        const s = p?.row?.status
        if (s === 'Approved') return <Chip size="small" label="Approved" color="success" variant="outlined" />
        if (s === 'Denied') return <Chip size="small" label="Denied" color="error" variant="outlined" />
        return <Chip size="small" label="Pending" color="warning" variant="outlined" />
      },
    },
    {
      field: 'actions', headerName: 'Actions', flex: 0.9, minWidth: 200, sortable: false,
      renderCell: (p) => {
        const id = p?.row?.id
        const disabled = loading || actingId === id
        return (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              disabled={disabled}
              onClick={async () => { setActingId(id); await approve(id); setActingId(null) }}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              disabled={disabled}
              onClick={async () => { setActingId(id); await deny(id); setActingId(null) }}
            >
              Deny
            </Button>
          </Stack>
        )
      },
    },
  ], [loading, actingId, approve, deny])

  const emptyOverlay = (
    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2" fontWeight={600}>No leave requests found.</Typography>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card sx={tableCardSx}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={800}>Leave Management</Typography>
            <Button onClick={refresh} disabled={loading}>Refresh</Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <DataGrid
            autoHeight={false}
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: 'startDate', sort: 'desc' }] },
            }}
            sx={{ height: 600 }}
            slots={{
              noRowsOverlay: () => emptyOverlay,
              noResultsOverlay: () => emptyOverlay,
            }}
          />
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        onClose={hideSnackbar}
        autoHideDuration={2500}
        message={snackbar.message}
      />
    </Box>
  )
}