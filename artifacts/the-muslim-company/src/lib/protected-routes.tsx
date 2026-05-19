import React, { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from './auth-context'

function Spinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#0a1a0e',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid #b08d57',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (loading) return
    if (!session) setLocation('/login')
    else if (role && role !== 'admin') setLocation('/employee/dashboard')
  }, [loading, session, role])

  if (loading) return <Spinner />
  if (!session || role !== 'admin') return <Spinner />
  return <>{children}</>
}

export function EmployeeRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (loading) return
    if (!session) setLocation('/login')
    else if (role && role !== 'employee') setLocation('/admin/dashboard')
  }, [loading, session, role])

  if (loading) return <Spinner />
  if (!session || role !== 'employee') return <Spinner />
  return <>{children}</>
}
