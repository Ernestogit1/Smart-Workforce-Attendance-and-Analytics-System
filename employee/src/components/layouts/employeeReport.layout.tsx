import { Box } from '@mui/material'
import HomeLayout from './home.layout'
import EmployeeReport from '../home/employeeReport.component'

export default function EmployeeReportLayout() {
  return (
    <HomeLayout>
      <Box sx={{ width: '100%' }}>
        <EmployeeReport />
      </Box>
    </HomeLayout>
  )
}