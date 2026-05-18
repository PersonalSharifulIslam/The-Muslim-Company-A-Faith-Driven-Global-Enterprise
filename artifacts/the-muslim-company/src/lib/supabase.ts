import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'tmc_session',
    storage: window.localStorage,
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

export type Application = {
  id: number
  reference_number: string
  job_id: number
  job_title: string
  name: string
  email: string
  phone: string
  address: string
  education: string
  experience: string
  skills: string
  portfolio: string
  cover_letter: string
  cv_url: string
  status: string
  created_at: string
  updated_at: string
}

export const STATUS_LABELS: Record<string, string> = {
  submitted:   'Submitted',
  reviewing:   'Under Review',
  shortlisted: 'Shortlisted',
  interview:   'Interview',
  offered:     'Offered',
  hired:       'Hired',
  rejected:    'Rejected',
}

export const STATUS_COLORS: Record<string, string> = {
  submitted:   'bg-blue-100 text-blue-800',
  reviewing:   'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  interview:   'bg-orange-100 text-orange-800',
  offered:     'bg-green-100 text-green-800',
  hired:       'bg-emerald-100 text-emerald-800',
  rejected:    'bg-red-100 text-red-800',
}
