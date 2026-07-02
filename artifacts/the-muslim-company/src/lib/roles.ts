// Role types and pure role-logic, deliberately kept free of any
// @supabase/supabase-js import. auth-context.tsx imports from here (not
// from ./supabase) so that public marketing pages never pull in the
// ~50-100KB Supabase client bundle just to know "is this role admin-area".

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
