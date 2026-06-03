import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { UserProfile, UserRole } from './supabase'

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null, user: null, profile: null, role: null, loading: true,
  })

  async function loadProfile(user: User, session: Session) {
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

      if (role === 'admin') {
        setState({
          session, user, role,
          profile: { id: user.id, role: 'admin', email: user.email ?? '' },
          loading: false
        })
        return
      }

      const { data: emp } = await supabase
        .from('employees').select('*')
        .eq('employee_id', roleData.employee_id).single()

      setState({
        session, user, role,
        profile: {
          id: user.id, role: 'employee', email: user.email ?? '',
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
    let mounted = true

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

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    } catch(e: any) {
      return { error: e.message ?? 'Connection error' }
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setState({ session: null, user: null, profile: null, role: null, loading: false })
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message ?? null }
  }

  async function refreshProfile() {
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

export const useIsAdmin    = () => useAuth().role === 'admin'
export const useIsEmployee = () => useAuth().role === 'employee'
