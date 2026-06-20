import React, { useEffect, useState } from 'react'
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

// Full corporate role hierarchy. Any role in this list can reach the
// /admin/* area (AdminRoute) — what they can actually SEE inside is
// further filtered by AdminLayout nav + enforced by Supabase RLS.
export const ADMIN_AREA_ROLES = [
  'admin',
  'executive',
  'vp',
  'director',
  'hr_manager',
  'finance_manager',
  'department_manager',
  'team_lead',
  'recruiter',
  'content_editor',
] as const

export type AdminAreaRole = typeof ADMIN_AREA_ROLES[number]

export function isAdminAreaRole(role: string | null): role is AdminAreaRole {
  return !!role && (ADMIN_AREA_ROLES as readonly string[]).includes(role)
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  useEffect(() => {
    if (!loading) setHasLoadedOnce(true)
  }, [loading])

  useEffect(() => {
    // Only redirect on a CONFIRMED bad state, never on a transient loading blip
    if (!hasLoadedOnce) return
    if (!session) { setLocation('/login'); return; }
    if (role && !isAdminAreaRole(role)) { setLocation('/employee/dashboard'); return; }
  }, [hasLoadedOnce, session, role])

  // Before the very first successful auth check, show spinner.
  // After that, NEVER unmount children for a transient loading/session blip
  // (e.g. tab visibility change triggering Supabase token refresh) —
  // this was wiping in-progress admin form data.
  if (!hasLoadedOnce) return <Spinner />
  if (!session) return <Spinner />
  if (role && !isAdminAreaRole(role)) return <Spinner />
  return <>{children}</>
}

export function EmployeeRoute({ children }: { children: React.ReactNode }) {
  const { loading, role, session } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (loading) return
    if (!session) { setLocation('/employee'); return; }
    // Every role (including all admin-area roles) is still a human employee
    // and can use their own Employee Portal — only block if there's truly no role.
    if (!role) { setLocation('/admin/dashboard'); return; }
  }, [loading, session, role])

  // Show spinner while loading OR while session exists but role not yet fetched
  if (loading) return <Spinner />
  if (!session) return <Spinner />
  if (session && !role) return <Spinner />
  return <>{children}</>
}
