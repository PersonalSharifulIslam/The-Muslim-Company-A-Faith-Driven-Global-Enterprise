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
  const profileLoading = useRef(false)

  async function loadProfile(user: User) {
    if (profileLoading.current) return
    profileLoading.current = true
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, employee_id')
        .eq('id', user.id)
        .single()

      if (!roleData) { setState(s => ({ ...s, loading: false })); return }

      const role = roleData.role as UserRole

      if (role === 'admin') {
        setState(s => ({ ...s, role, profile: { id: user.id, role: 'admin', email: user.email ?? '' }, loading: false }))
        return
      }

      const { data: emp } = await supabase
        .from('employees').select('*')
        .eq('employee_id', roleData.employee_id).single()

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
    } finally {
      profileLoading.current = false
    }
  }

  useEffect(() => {
    // Get initial session
    // Add timeout to prevent infinite spinning
    const timer = setTimeout(() => {
      setState(s => s.loading ? { ...s, loading: false } : s)
    }, 5000)
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timer)
      if (session?.user) {
        setState(s => ({ ...s, session, user: session.user }))
        loadProfile(session.user)
      } else {
        setState(s => ({ ...s, loading: false }))
      }
    }).catch(() => {
      clearTimeout(timer)
      setState(s => ({ ...s, loading: false }))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setState({ session: null, user: null, profile: null, role: null, loading: false })
        return
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          setState(s => ({ ...s, session, user: session.user }))
          await loadProfile(session.user)
        }
      }
    })

    return () => subscription.unsubscribe()
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
    setState(s => ({ ...s, loading: true }))
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
