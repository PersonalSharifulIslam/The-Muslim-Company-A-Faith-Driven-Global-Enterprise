import React from 'react'
import { useLocation } from 'wouter'
import { useAuth } from './auth-context'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()

  if (loading) return null
  if (!session) { setLocation('/login'); return null }
  if (role !== 'admin') { setLocation('/employee/dashboard'); return null }
  return <>{children}</>
}

export function EmployeeRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()

  if (loading) return null
  if (!session) { setLocation('/login'); return null }
  if (role !== 'employee') { setLocation('/admin/dashboard'); return null }
  return <>{children}</>
}
