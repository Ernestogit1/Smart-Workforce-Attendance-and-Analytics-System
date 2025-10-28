import { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f6f9ff, #eef6ff)',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 12px 28px rgba(0,0,0,.08)',
          padding: 24,
        }}
      >
        {children}
      </div>
    </div>
  )
}