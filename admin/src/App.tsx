import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/protectedRoute.component'
import SidebarLayout from './components/layouts/sidebar.layout'
import LoginScreen from './screens/auth/login.screen'
import DashboardScreen from './screens/home/dashboard.screen'
import EmloyeeAccMakerScreen from './screens/home/employeeAccMaker.screen'
import EmployeeDataTableScreen from './screens/home/employeeDataTable.screen'
import EmployeeUpdateScreen from './screens/home/employeeUpdate.screen'
import MonitorAttendanceScreen from './screens/home/monitorAttendance.screen'
import LeaveRequeastScreen from './screens/home/leavRequeast.screen'
import AnalyticDashboardScreen from './screens/home/analythicDashboard.screen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<SidebarLayout />}>
          <Route index element={<DashboardScreen />} />
          <Route path="employee-acc-maker" element={<EmloyeeAccMakerScreen />} />
          <Route path="employees" element={<EmployeeDataTableScreen />} />
          <Route path="employees/:id/update" element={<EmployeeUpdateScreen />} />
          <Route path="monitor-attendance" element={<MonitorAttendanceScreen />} />
          <Route path="leave-requests" element={<LeaveRequeastScreen />} />
          <Route path="analytics" element={<AnalyticDashboardScreen />} /> {/* added */}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default App
