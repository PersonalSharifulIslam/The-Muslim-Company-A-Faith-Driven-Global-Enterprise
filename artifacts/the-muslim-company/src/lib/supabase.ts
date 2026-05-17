import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'tmc_session',
  },
})

export type UserRole = 'admin' | 'employee'

export interface UserProfile {
  id: string
  role: UserRole
  email: string
  employee_id?: string
  name?: string
  department?: string
  position?: string
  profile_image?: string
}
