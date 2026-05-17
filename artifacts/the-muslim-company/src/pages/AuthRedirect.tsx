import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'

export default function AuthRedirect() {
  const { role, loading } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (loading) return
    if (role === 'admin')    navigate('/admin/dashboard',    { replace: true })
    else if (role === 'employee') navigate('/employee/dashboard', { replace: true })
    else navigate('/login', { replace: true })
  }, [role, loading, navigate])
  return null
}
