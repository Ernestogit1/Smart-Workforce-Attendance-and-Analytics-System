import { useMemo } from 'react'
import {
  Box, Card, CardContent, Typography, Stack, Button, Divider, Alert, Chip,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import RefreshIcon from '@mui/icons-material/Refresh'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { useMonitorAttendance } from '../../hooks/monitorAttendance.hook'
import { filtersCardSx, tableCardSx } from '../../styles/monitorAttendance.styles'
import type { AttendanceLog } from '../../store/slices/monitorAttendance.slice'

const fmtTime = (iso?: string | null) => (iso ? dayjs(iso).format('h:mm A') : '—')
const fmtDate = (iso?: string | null) => (iso ? dayjs(iso).format('MMM D, YYYY') : '—')

const statusChip = (s: 'Present' | 'Late' | 'Absent') => {
  if (s === 'Present') return <Chip size="small" label="Present" color="success" variant="outlined" />
  if (s === 'Late') return <Chip size="small" label="Late" color="warning" variant="outlined" />
  return <Chip size="small" label="Absent" color="error" variant="outlined" />
}

export default function MonitorAttendanceComponent() {
  const {
    startDayjs,
    endDayjs,
    changeStart,
    changeEnd,
    filter,
    loading,
    error,
    rows,
  } = useMonitorAttendance()

  const canFilter = !!startDayjs && !!endDayjs && !loading

  const columns = useMemo<GridColDef<AttendanceLog>[]>(() => [
    { field: 'employeeName', headerName: 'Employee Name', flex: 1.2, minWidth: 180, sortable: true },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 140,
      sortable: true,
      renderCell: (p) => <>{fmtDate(p?.row?.date)}</>,
      sortComparator: (_v1, _v2, p1, p2) =>
        (p1?.row?.date ? dayjs(p1.row.date).valueOf() : 0) -
        (p2?.row?.date ? dayjs(p2.row.date).valueOf() : 0),
    },
    {
      field: 'timeIn',
      headerName: 'Time In',
      flex: 0.6,
      minWidth: 120,
      renderCell: (p) => <>{fmtTime(p?.row?.timeIn)}</>,
    },
    {
      field: 'timeOut',
      headerName: 'Time Out',
      flex: 0.6,
      minWidth: 120,
      renderCell: (p) => <>{fmtTime(p?.row?.timeOut)}</>,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 120,
      sortable: true,
      renderCell: (p) => statusChip((p?.row?.status as any) || 'Absent'),
    },
    {
      field: 'hoursWorked',
      headerName: 'Hours Worked',
      flex: 0.6,
      minWidth: 140,
      valueGetter: (_v, r) => r?.hoursWorked || '00:00:00',
    },
  ], [])

  const emptyOverlay = (
    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
      <AccessTimeIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
      <Typography variant="body2" fontWeight={600}>
        No attendance logs for the selected range.
      </Typography>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card sx={filtersCardSx}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="caption" color="text.secondary">Start date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={startDayjs}
                  onChange={changeStart}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  disableFuture
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="caption" color="text.secondary">End date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={endDayjs}
                  onChange={changeEnd}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  disableFuture
                />
              </LocalizationProvider>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<FilterAltIcon />}
                onClick={filter}
                disabled={!canFilter}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={filter}
                disabled={loading}
              >
                Refresh
              </Button>
            </Stack>
          </Stack>
          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={tableCardSx}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={800}>Attendance Logs</Typography>
            <Typography variant="body2" color="text.secondary">
              {startDayjs && endDayjs
                ? `${startDayjs.format('MMM D, YYYY')} → ${endDayjs.format('MMM D, YYYY')}`
                : 'Select a date range'}
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={r => r.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
            }}
            slots={{
              noRowsOverlay: () => emptyOverlay,
              noResultsOverlay: () => emptyOverlay,
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}