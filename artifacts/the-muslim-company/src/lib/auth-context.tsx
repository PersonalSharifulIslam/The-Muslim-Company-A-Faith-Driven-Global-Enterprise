import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
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
  const initialized = useRef(false)

  async function loadProfile(user: User) {
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, employee_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!roleData) {
        const metaRole = user.user_metadata?.role as UserRole | undefined
        setState(s => ({
          ...s,
          role: metaRole ?? null,
          profile: metaRole ? { id: user.id, role: metaRole, email: user.email ?? '' } : null,
          loading: false,
        }))
        return
      }

      const role = roleData.role as UserRole

      if (role === 'admin') {
        setState(s => ({
          ...s, role,
          profile: { id: user.id, role: 'admin', email: user.email ?? '' },
          loading: false,
        }))
        return
      }

      const { data: emp } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', roleData.employee_id)
        .maybeSingle()

      setState(s => ({
        ...s, role,
        profile: {
          id: user.id, role: 'employee', email: user.email ?? '',
          employee_id: roleData.employee_id,
          name: emp?.name, department: emp?.department,
          position: emp?.position, profile_image: emp?.profile_image,
        },
        loading: false,
      }))
    } catch (e) {
      console.error('loadProfile error:', e)
      setState(s => ({ ...s, loading: false }))
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!initialized.current && event === 'INITIAL_SESSION') {
        initialized.current = true
        setState(s => ({ ...s, session, user: session?.user ?? null }))
        if (session?.user) await loadProfile(session.user)
        else setState(s => ({ ...s, loading: false }))
        return
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setState(s => ({ ...s, session, user: session?.user ?? null }))
        if (session?.user) await loadProfile(session.user)
      }
      if (event === 'SIGNED_OUT') {
        setState({ session: null, user: null, profile: null, role: null, loading: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
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
    if (state.user) await loadProfile(state.user)
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
