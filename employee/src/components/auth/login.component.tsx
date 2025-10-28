import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/index.store'
import { clearError, loginThunk } from '../../store/slices/auth.slice'
import { useNavigate } from 'react-router-dom'

export default function EmployeeLogin() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((s: RootState) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    dispatch(clearError())
    const action = await dispatch(loginThunk({ email: email.trim(), password }))
    if (loginThunk.fulfilled.match(action)) {
      navigate('/', { replace: true })
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ width: 360, maxWidth: '90vw' }}>
      <h2 style={{ marginBottom: 8 }}>Employee Sign in</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>Use the account your admin created.</p>

      {error ? (
        <div style={{ background: '#fee', color: '#b00', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  )
}