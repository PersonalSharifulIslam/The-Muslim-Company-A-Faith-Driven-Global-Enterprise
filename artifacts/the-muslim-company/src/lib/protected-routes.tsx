import React, { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from './auth-context'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (loading) return
    if (!session) setLocation('/login')
    else if (role && role !== 'admin') setLocation('/employee/dashboard')
  }, [loading, session, role])

  if (loading || !session || role !== 'admin') return null
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

  if (loading || !session || role !== 'employee') return null
  return <>{children}</>
}
