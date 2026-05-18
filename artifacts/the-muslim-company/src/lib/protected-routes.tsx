import React, { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from './auth-context'

function LoadingScreen() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a1a0e', color:'#b08d57', fontFamily:'sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'3px solid #b08d57', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 1rem' }} />
        Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
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

  if (loading) return <LoadingScreen />
  if (!session || (role && role !== 'admin')) return null
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

  if (loading) return <LoadingScreen />
  if (!session || (role && role !== 'employee')) return null
  return <>{children}</>
}
