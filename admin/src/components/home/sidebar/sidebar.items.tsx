import { ReactNode } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

export type NavItem = {
  to: string
  label: string
  icon: ReactNode
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/dashboard/employee-acc-maker', label: 'Employee Account Maker', icon: <PersonAddIcon /> },
  { to: '/dashboard/employees', label: 'Employees', icon: 'group', to: '/dashboard/employees' },
]