import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/index.store'
import { Card, Page } from '../../styles/auth.styles'

type Props = { children: ReactNode }

export default function LoginLayout({ children }: Props) {
  const token = useSelector((s: RootState) => s.auth.token) || localStorage.getItem('token')
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <Page>
      <Card elevation={0}>{children}</Card>
    </Page>
  )
}