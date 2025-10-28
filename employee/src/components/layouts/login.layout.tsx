import { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #f5f7ff, #eef8ff)',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,.08)',
        }}
      >
        {children}
      </div>
    </div>
  )
}