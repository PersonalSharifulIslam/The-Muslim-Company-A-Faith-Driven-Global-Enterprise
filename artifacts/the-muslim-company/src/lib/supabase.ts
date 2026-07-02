import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
    storageKey:         'tmc_auth',
    flowType:           'pkce',
  },
})

// Re-exported for backward compatibility — the canonical definitions now
// live in ./roles (which has zero dependency on @supabase/supabase-js).
export type { UserRole, UserProfile } from './roles'
export { ADMIN_AREA_ROLES, isAdminAreaRole } from './roles'


export const STATUS_LABELS: Record<string, string> = {
  submitted:      'Submitted',
  reviewing:      'Under Review',
  shortlisted:    'Shortlisted',
  interview:      'Interview',
  offered:        'Offered',
  offer_accepted: 'Offer Accepted',
  hired:          'Hired',
  joined:         'Joined',
  rejected:       'Rejected',
}

export const STATUS_COLORS: Record<string, string> = {
  submitted:      'bg-blue-100 text-blue-800',
  reviewing:      'bg-yellow-100 text-yellow-800',
  shortlisted:    'bg-purple-100 text-purple-800',
  interview:      'bg-orange-100 text-orange-800',
  offered:        'bg-green-100 text-green-800',
  offer_accepted: 'bg-teal-100 text-teal-800',
  hired:          'bg-emerald-100 text-emerald-800',
  joined:         'bg-amber-200 text-amber-900',
  rejected:       'bg-red-100 text-red-800',
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


export type TransparencyReport = {
  id: number
  title: string
  report_type: 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
  period_label: string
  description: string
  pdf_url: string
  published_date: string
  featured: boolean
  created_at: string
}
