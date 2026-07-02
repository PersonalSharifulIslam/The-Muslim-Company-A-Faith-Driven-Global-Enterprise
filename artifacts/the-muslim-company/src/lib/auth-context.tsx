import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { UserProfile, UserRole } from './roles'
import { isAdminAreaRole } from './roles'

interface AuthState {
  session:  Session | null
  user:     User    | null
  profile:  UserProfile | null
  role:     UserRole | null
  loading:  boolean
}

interface AuthContextValue extends AuthState {
  signIn:         (email: string, password: string) => Promise<{ error: string | null }>
  signOut:        () => Promise<void>
  resetPassword:  (email: string) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// The @supabase/supabase-js bundle (~50-100KB) is only needed on the
// /admin, /employee, and /login areas. Every public marketing page
// (home, about, blog, careers listing, etc.) renders inside AuthProvider
// too, so importing supabase statically at the top of this file used to
// force-load it on every single page load. This lazy singleton defers
// the import until it's actually needed.
let supabasePromise: Promise<typeof import('./supabase')> | null = null
function getSupabase() {
  if (!supabasePromise) supabasePromise = import('./supabase')
  return supabasePromise
}

function isAuthRoute(pathname: string) {
  return /^\/(admin|employee|login|auth-redirect)(\/|$)/.test(pathname)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null, user: null, profile: null, role: null,
    loading: typeof window !== 'undefined' ? isAuthRoute(window.location.pathname) : false,
  })

  async function loadProfile(user: User, session: Session) {
    const { supabase } = await getSupabase()
    // Keep existing role/session while loading to prevent flicker
    setState(prev => ({ ...prev, loading: true }))
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, employee_id')
        .eq('id', user.id)
        .single()

      if (!roleData) {
        setState({ session, user, profile: null, role: null, loading: false })
        return
      }

      const role = roleData.role as UserRole

      // The owner/admin account has no linked employee_id (it's the
      // single super-admin login, not a regular staff record).
      if (role === 'admin' && !roleData.employee_id) {
        setState({
          session, user, role,
          profile: { id: user.id, role: 'admin', email: user.email ?? '' },
          loading: false
        })
        return
      }

      // Every other role (executive, vp, director, hr_manager,
      // finance_manager, department_manager, team_lead, recruiter,
      // content_editor, employee) is a real person on the employees
      // table — load their name/department/position for both the
      // Employee Portal and the admin sidebar.
      const { data: emp } = roleData.employee_id
        ? await supabase.from('employees').select('*').eq('employee_id', roleData.employee_id).single()
        : { data: null }

      setState({
        session, user, role,
        profile: {
          id: user.id, role, email: user.email ?? '',
          employee_id: roleData.employee_id,
          name: emp?.name, department: emp?.department,
          position: emp?.position, profile_image: emp?.profile_image,
        },
        loading: false,
      })
    } catch {
      setState({ session, user, profile: null, role: null, loading: false })
    }
  }

  useEffect(() => {
    // Public marketing pages never need a session — skip loading Supabase
    // entirely so they don't pay for the bundle at all.
    if (!isAuthRoute(window.location.pathname)) {
      setState(s => (s.loading ? { ...s, loading: false } : s))
      return
    }

    let mounted = true

    getSupabase().then(({ supabase }) => {
      if (!mounted) return

      // Restore session from localStorage
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return
        if (session?.user) {
          loadProfile(session.user, session)
        } else {
          setState(s => ({ ...s, loading: false }))
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_OUT' || !session) {
          setState({ session: null, user: null, profile: null, role: null, loading: false })
          return
        }
        if (event === 'SIGNED_IN') {
          if (session?.user) loadProfile(session.user, session)
        }
        // TOKEN_REFRESHED: just update session/user, keep existing role/profile
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          setState(prev => ({
            ...prev,
            session,
            user: session.user,
          }))
        }
      })

      return () => subscription.unsubscribe()
    })

    return () => { mounted = false }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { supabase } = await getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    } catch(e: any) {
      return { error: e.message ?? 'Connection error' }
    }
  }

  async function signOut() {
    const { supabase } = await getSupabase()
    await supabase.auth.signOut()
    setState({ session: null, user: null, profile: null, role: null, loading: false })
  }

  async function resetPassword(email: string) {
    const { supabase } = await getSupabase()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message ?? null }
  }

  async function refreshProfile() {
    const { supabase } = await getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) await loadProfile(session.user, session)
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, resetPassword, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export const useIsAdmin      = () => useAuth().role === 'admin'
export const useIsEmployee   = () => useAuth().role === 'employee'
export const useIsAdminArea  = () => isAdminAreaRole(useAuth().role)
