import { Avatar, Chip, Stack, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import { useEmployeeDataTable } from '../../hooks/employeeDataTable.hook'
import type { EmployeeRow } from '../../store/slices/employeeDataTable.slice'
import { TableCard, TablePage } from '../../styles/employeeDataTable.styles'

function formatDate(v?: string | null) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
}
function initials(first?: string, last?: string) {
  return `${(first || 'U')[0]}${(last || 'U')[0]}`.toUpperCase()
}

export default function EmployeeDataTable() {
  const { employees, loading } = useEmployeeDataTable()
  const rows = useMemo(() => employees.map((r) => ({ id: r._id, ...r })), [employees])

  const columns: GridColDef<EmployeeRow>[] = [
    {
      field: 'profileImage',
      headerName: '',
      width: 64,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const r = params.row
        return (
          <Avatar
            src={r.profileImage || undefined}
            sx={{ width: 36, height: 36, bgcolor: 'primary.light', fontWeight: 700 }}
          >
            {initials(r.firstName, r.lastName)}
          </Avatar>
        )
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.2,
      minWidth: 200,
      sortable: true,
      // v8: valueGetter(value, row)
      valueGetter: (_value, row) => `${row.lastName}, ${row.firstName}`,
      renderCell: (params) => {
        const r = params.row
        return (
          <Stack spacing={0.2}>
            <Typography fontWeight={700}>{`${r.lastName}, ${r.firstName}`}</Typography>
            <Typography variant="caption" color="text.secondary">
              {r.middleName ?? ''}
            </Typography>
          </Stack>
        )
      },
    },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
    { field: 'contactNumber', headerName: 'Contact', flex: 0.8, minWidth: 140 },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 180,
      renderCell: (p) => (
        <Tooltip title={p.value || ''}>
          <span>{p.value || ''}</span>
        </Tooltip>
      ),
    },
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      flex: 0.7,
      minWidth: 120,
      // v8: valueGetter(value) -> format
      valueGetter: (value) => formatDate(value as string | null),
    },
    { field: 'age', headerName: 'Age', type: 'number', width: 90 },
    {
      field: 'isAdmin',
      headerName: 'Role',
      width: 120,
      renderCell: (p) => (
        <Chip
          size="small"
          label={p.value ? 'Admin' : 'Employee'}
          color={p.value ? 'success' : 'default'}
          variant={p.value ? 'filled' : 'outlined'}
        />
      ),
    },
  ]

  return (
    <TablePage>
      <TableCard>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: 'background.default' },
            '& .MuiDataGrid-toolbarContainer': { p: 1 },
            '& .MuiDataGrid-virtualScroller': { backgroundColor: 'background.paper' },
          }}
        />
      </TableCard>
    </TablePage>
  )
}