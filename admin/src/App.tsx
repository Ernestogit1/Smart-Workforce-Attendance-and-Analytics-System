import { Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './screens/auth/login.screen'
import DashboardScreen from './screens/home/dashboard.screen'
import ProtectedRoute from './components/protectedRoute.component'
import SidebarLayout from './components/layouts/sidebar.layout'
import EmloyeeAccMakerScreen from './screens/home/employeeAccMaker.screen'
import EmployeeDataTableScreen from './screens/home/employeeDataTable.screen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<SidebarLayout />}>
          <Route index element={<DashboardScreen />} />
          <Route path="employee-acc-maker" element={<EmloyeeAccMakerScreen />} />
          <Route path="employees" element={<EmployeeDataTableScreen />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
