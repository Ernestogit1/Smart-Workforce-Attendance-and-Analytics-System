import EmployeeLogin from '../../components/auth/login.component'
import LoginLayout from '../../components/layouts/login.layout'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../../store/index.store'

export default function LoginScreen() {
  const token = useSelector((s: RootState) => s.auth.token)
  if (token) return <Navigate to="/" replace />

  return (
    <LoginLayout>
      <EmployeeLogin />
    </LoginLayout>
  )
}