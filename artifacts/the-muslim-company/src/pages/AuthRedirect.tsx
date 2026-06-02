import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../lib/auth-context'

export default function AuthRedirect() {
  useEffect(() => {
    document.title = "The Muslim Company";
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      const r = document.querySelector('meta[name="robots"]');
      if (r) r.setAttribute('content', 'index, follow');
    };
  }, []);

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
