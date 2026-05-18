import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../lib/auth-context'

export default function AuthRedirect() {
  const { role, loading } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (loading) return
    if (role === 'admin') setLocation('/admin/dashboard')
    else if (role === 'employee') setLocation('/employee/dashboard')
    else setLocation('/login')
  }, [role, loading])

  return null
}
