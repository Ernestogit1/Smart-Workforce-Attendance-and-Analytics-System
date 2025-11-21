import { Routes, Route, Navigate } from 'react-router-dom'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import ProtectedRoute from './components/protectedRoute.component'
import LoginScreen from './screens/auth/login.screens'
import HomeScreen from './screens/home/home.screen'
import LeaveDetailScreen from './screens/home/leaveDetail.screen'
import AttendanceHistoryScreen from './screens/home/attendancehistory.screen'
import EmployeeReportScreen from './screens/home/employeeReport.screen'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/leave-details" element={<LeaveDetailScreen />} />
        <Route path="/attendance-history" element={<AttendanceHistoryScreen />} />
        <Route path="/employee-report" element={<EmployeeReportScreen />} /> {/* added */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default App
