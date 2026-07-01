export async function onRequestPost(context: any) {
  const { request, env } = context
  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY
  const ANON_KEY     = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY

  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '')
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY },
  })
  if (!verifyRes.ok) return Response.json({ error: 'Invalid token' }, { status: 401 })
  const caller = await verifyRes.json() as any

  const roleRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?id=eq.${caller.id}&select=role`, {
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
  })
  const roles = await roleRes.json() as any[]
  // Only these roles can create new staff accounts and assign access levels.
  const CAN_CREATE_EMPLOYEES = ['admin', 'executive', 'hr_manager']
  if (!roles[0] || !CAN_CREATE_EMPLOYEES.includes(roles[0].role))
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as any
  const { email, password, name, department, position, phone, address, joining_date, bank_name, bank_account_name, bank_account_number, bank_branch, bank_routing_number } = body
  // Auto-generate employee_id if not provided
  const employee_id = body.employee_id?.trim() || `TMC-${Date.now().toString(36).toUpperCase()}`

  // Access level (user_roles.role) — defaults to plain "employee" if not specified.
  // Validate against the full corporate hierarchy so a typo/bad value can't
  // silently slip an unrecognized role into the system.
  const VALID_ACCESS_LEVELS = [
    'admin', 'executive', 'vp', 'director', 'hr_manager',
    'finance_manager', 'department_manager', 'team_lead',
    'recruiter', 'content_editor', 'employee',
  ]
  const access_level = VALID_ACCESS_LEVELS.includes(body.access_level) ? body.access_level : 'employee'
  // Scoped roles (department_manager / team_lead) need a department to be scoped to.
  // Company-wide roles don't need this, but we store it anyway for reference.
  const access_department = body.department || department || null

  if (!email || !password || !name || !department || !position)
    return Response.json({ error: 'Missing required fields: email, password, name, department, position' }, { status: 400 })

  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { role: access_level, employee_id, name } }),
  })
  if (!createRes.ok) {
    const err = await createRes.json() as any
    return Response.json({ error: err.message || 'Failed to create auth user' }, { status: 400 })
  }
  const newUser = await createRes.json() as any
  const authId  = newUser.id

  const empRes = await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Prefer': 'return=representation' },
    body: JSON.stringify({
      auth_user_id: authId, employee_id, name, email, department, position,
      phone: phone||'', address: address||'', joining_date: joining_date||new Date().toISOString().split('T')[0], status: 'active',
      bank_name: bank_name||'', bank_account_name: bank_account_name||'', bank_account_number: bank_account_number||'',
      bank_branch: bank_branch||'', bank_routing_number: bank_routing_number||'',
    }),
  })
  if (!empRes.ok) {
    await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${authId}`, {
      method: 'DELETE',
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
    })
    const err = await empRes.json() as any
    return Response.json({ error: err.message || 'Failed to create employee' }, { status: 400 })
  }

  await fetch(`${SUPABASE_URL}/rest/v1/user_roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({ id: authId, role: access_level, employee_id, department: access_department }),
  })

  const employee = await empRes.json()
  return Response.json({ success: true, employee }, { status: 201 })
}
