import { ReactNode } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupIcon from '@mui/icons-material/Group'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import InsightsIcon from '@mui/icons-material/Insights' // added

export type NavItem = {
  to: string
  label: string
  icon: ReactNode
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/dashboard/employee-acc-maker', label: 'Employee Account Maker', icon: <PersonAddIcon /> },
  { to: '/dashboard/employees', label: 'Employees', icon: <GroupIcon /> },
  { to: '/dashboard/monitor-attendance', label: 'Monitor Attendance', icon: <QueryStatsIcon /> },
  { to: '/dashboard/leave-requests', label: 'Leave Management', icon: <AssignmentTurnedInIcon /> },
  { to: '/dashboard/analytics', label: 'Analytics', icon: <InsightsIcon /> }, // added
]