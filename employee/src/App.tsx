import {  Routes, Route, Navigate } from 'react-router-dom'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import ProtectedRoute from './components/protectedRoute.component'
import LoginScreen from './screens/auth/login.screens'
import HomeScreen from './screens/home/home.screen'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
