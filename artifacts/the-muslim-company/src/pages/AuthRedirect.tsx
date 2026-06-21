import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../lib/auth-context'
import { isAdminAreaRole } from '../lib/supabase'

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
    // Any corporate access-level role (admin, executive, vp, director,
    // hr_manager, finance_manager, department_manager, team_lead, recruiter,
    // content_editor) goes to the admin panel. Plain "employee" goes to the
    // Employee Portal. No role at all (shouldn't normally happen) → login.
    if (isAdminAreaRole(role)) setLocation('/admin/dashboard')
    else if (role === 'employee') setLocation('/employee/dashboard')
    else setLocation('/login')
  }, [role, loading])

  return null
}
