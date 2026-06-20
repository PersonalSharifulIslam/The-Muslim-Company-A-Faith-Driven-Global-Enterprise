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

export type UserRole =
  | 'admin'               // Tier 1: CEO/Owner — full control
  | 'executive'           // Tier 2: C-Suite (COO/CFO/CTO) — company-wide
  | 'vp'                  // Tier 3: Vice President — division-wide
  | 'director'            // Tier 3: Director — division-wide
  | 'hr_manager'          // Tier 4: HR — employees/leave/attendance/payroll/recruitment
  | 'finance_manager'     // Tier 4: Finance — payroll/financial
  | 'department_manager'  // Tier 4: scoped to own department
  | 'team_lead'           // Tier 5: scoped to own department, tasks/attendance only
  | 'recruiter'           // Tier 6: careers + applications only
  | 'content_editor'      // Tier 6: blog + newsroom + notices only
  | 'employee'            // Tier 7: base staff — employee portal only

export interface UserProfile {
  id:             string
  role:           UserRole
  email:          string
  employee_id?:   string
  name?:          string
  department?:    string
  position?:      string
  profile_image?: string
}

// Roles that have access to the /admin/* area (vs. plain "employee" who only
// sees their own Employee Portal). What each role can actually see inside
// /admin is further filtered per-page and enforced by Supabase RLS.
export const ADMIN_AREA_ROLES: UserRole[] = [
  'admin', 'executive', 'vp', 'director', 'hr_manager',
  'finance_manager', 'department_manager', 'team_lead',
  'recruiter', 'content_editor',
]

export function isAdminAreaRole(role: UserRole | null | undefined): boolean {
  return !!role && ADMIN_AREA_ROLES.includes(role)
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
