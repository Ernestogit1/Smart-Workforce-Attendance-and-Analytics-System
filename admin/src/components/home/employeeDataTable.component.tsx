import { Avatar, Chip, Stack, Tooltip, Typography, Box, alpha } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import { useEmployeeDataTable } from '../../hooks/employeeDataTable.hook'
import type { EmployeeRow } from '../../store/slices/employeeDataTable.slice'
import { 
  TableCard, 
  TablePage, 
  TableHeader, 
  TableTitle,
  TableDescription, 
  UpdateButton, 
  RestrictButton,
  StatusChip,
  ProfileCell,
  UserAvatar
} from '../../styles/employeeDataTable.styles'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useNavigate } from 'react-router-dom'

function formatDate(v?: string | null) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
}

function initials(first?: string, last?: string) {
  return `${(first || 'U')[0]}${(last || 'U')[0]}`.toUpperCase()
}

export default function EmployeeDataTable() {
  const { employees, loading, toggleRestrict } = useEmployeeDataTable()
  const rows = useMemo(() => employees.map((r) => ({ id: r._id, ...r })), [employees])
  const navigate = useNavigate()
  const [pageSize, setPageSize] = useState(10)

  const columns: GridColDef<EmployeeRow>[] = [
    {
      field: 'name',
      headerName: 'Employee',
      flex: 1.5,
      minWidth: 230,
      sortable: true,
      valueGetter: (_value, row) => `${row.lastName}, ${row.firstName}`,
      renderCell: (params) => {
        const r = params.row
        return (
          <ProfileCell>
            <UserAvatar>
              {r.profileImage ? (
                <img src={r.profileImage} alt={`${r.firstName} ${r.lastName}`} />
              ) : (
                initials(r.firstName, r.lastName)
              )}
            </UserAvatar>
            <Stack spacing={0.3}>
              <Typography fontWeight={600}>{`${r.firstName} ${r.lastName}`}</Typography>
              <Typography variant="caption" color="text.secondary">
                {r.middleName ? `${r.middleName} • ` : ''}{r.email}
              </Typography>
            </Stack>
          </ProfileCell>
        )
      },
    },
    { 
      field: 'contactNumber', 
      headerName: 'Contact', 
      flex: 0.8, 
      minWidth: 140,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography>{params.value || '—'}</Typography>
        </Stack>
      )
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 180,
      renderCell: (p) => (
        <Tooltip title={p.value || ''}>
          <Typography noWrap sx={{ maxWidth: '100%' }}>{p.value || '—'}</Typography>
        </Tooltip>
      ),
    },
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      flex: 0.7,
      minWidth: 120,
      valueGetter: (value) => formatDate(value as string | null),
    },
    { 
      field: 'age', 
      headerName: 'Age', 
      type: 'number', 
      width: 80,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value || '—'}</Typography>
      )
    },
    {
      field: 'isAdmin',
      headerName: 'Role',
      width: 120,
      renderCell: (p) => p.value ? (
        <StatusChip color="success" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5
        }}>
          <AdminPanelSettingsIcon fontSize="small" />
          Admin
        </StatusChip>
      ) : (
        <StatusChip color="info" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5
        }}>
          <PersonIcon fontSize="small" />
          Employee
        </StatusChip>
      ),
    },
    {
      field: 'isRestricted',
      headerName: 'Status',
      width: 120,
      renderCell: (p) => p.value ? (
        <StatusChip color="error" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5
        }}>
          <LockIcon fontSize="small" />
          Restricted
        </StatusChip>
      ) : (
        <StatusChip color="success" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5
        }}>
          <LockOpenIcon fontSize="small" />
          Active
        </StatusChip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const r = params.row as EmployeeRow
        const isRestricted = !!r.isRestricted
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <UpdateButton
              variant="contained"
              disableElevation
              startIcon={<BusinessCenterIcon />}
              onClick={() => navigate(`/dashboard/employees/${r._id}/update`)}
            >
              Update
            </UpdateButton>
            <RestrictButton
              variant="contained"
              disableElevation
              isRestricted={isRestricted}
              startIcon={isRestricted ? <LockOpenIcon /> : <LockIcon />}
              onClick={() => toggleRestrict(r._id, !isRestricted)}
            >
              {isRestricted ? 'Unrestrict' : 'Restrict'}
            </RestrictButton>
          </Stack>
        )
      },
    },
  ]

  return (
    <TablePage>
      <TableHeader sx={{ mb: 2 }}>
        <Box>
          <TableTitle variant="h4">Employee Directory</TableTitle>
          <TableDescription variant="body1">
            Manage and view all company employees
          </TableDescription>
        </Box>
      </TableHeader>
      
      <TableCard>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ 
            toolbar: { 
              showQuickFilter: true, 
              quickFilterProps: { 
                debounceMs: 300,
              }
            }
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { 
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                fontSize: '0.875rem',
              }
            },
            '& .MuiDataGrid-cell': {
              borderColor: (theme) => alpha(theme.palette.divider, 0.5),
            },
            '& .MuiDataGrid-row': {
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
              },
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: (theme) => alpha(theme.palette.background.default, 0.7),
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: 2,
              gap: 2,
              '& .MuiButton-root': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                },
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'none',
                padding: '6px 8px',
                borderRadius: 1,
              },
              '& .MuiFormControl-root': {
                minWidth: 240,
              },
              '& .MuiInputBase-root': {
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                }
              }
            }
          }}
        />
      </TableCard>
    </TablePage>
  )
}