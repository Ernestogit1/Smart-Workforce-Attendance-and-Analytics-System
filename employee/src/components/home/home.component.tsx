import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/index.store'
import { logoutThunk } from '../../store/slices/auth.slice'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token } = useSelector((s: RootState) => s.auth)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Employee Home</h1>
      <p style={{ color: '#555' }}>
        This page is protected by auth. If you can see it, your login works.
      </p>

      <div
        style={{
          display: 'grid',
          gap: 12,
          marginTop: 16,
          padding: 16,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          background: '#fafcff',
        }}
      >
        <div>
          <strong>User email:</strong> {user?.email || 'Unknown'}
        </div>
        <div>
          <strong>Display name:</strong> {user?.displayName || '—'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <strong>Token:</strong>
          <div
            style={{
              marginTop: 6,
              padding: 10,
              background: '#0b1022',
              color: '#c9e8ff',
              borderRadius: 8,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 12,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
            title={token || ''}
          >
            {token || 'No token'}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 20,
          padding: '10px 14px',
          borderRadius: 8,
          border: 'none',
          background: '#ef4444',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  )
}