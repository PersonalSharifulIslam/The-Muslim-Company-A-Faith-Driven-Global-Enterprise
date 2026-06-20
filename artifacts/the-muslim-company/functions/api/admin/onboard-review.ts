// Admin-only endpoint: approve or reject a submitted onboarding invite.
// On approve: creates the Supabase Auth user, employees row, and user_roles
// row (mirroring create-employee.ts), then immediately wipes the temp
// password from onboarding_invites so it never lingers in the database.
export async function onRequestPost(context: any) {
  const { request, env } = context
  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY
  const ANON_KEY     = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY

  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '')
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY },
  })
  if (!verifyRes.ok) return Response.json({ error: 'Invalid token' }, { status: 401 })
  const caller = await verifyRes.json() as any

  const roleRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?id=eq.${caller.id}&select=role`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  })
  const roles = await roleRes.json() as any[]
  const CAN_REVIEW = ['admin', 'executive', 'hr_manager']
  if (!roles[0] || !CAN_REVIEW.includes(roles[0].role))
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as any
  const { invite_id, action, review_note } = body // action: 'approve' | 'reject'
  if (!invite_id || !['approve', 'reject'].includes(action))
    return Response.json({ error: 'invite_id and a valid action are required' }, { status: 400 })

  const inviteRes = await fetch(`${SUPABASE_URL}/rest/v1/onboarding_invites?id=eq.${invite_id}&select=*`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  })
  const invites = await inviteRes.json() as any[]
  const invite = invites[0]
  if (!invite) return Response.json({ error: 'Invite not found' }, { status: 404 })
  if (invite.status !== 'submitted') return Response.json({ error: 'This invite is not awaiting review' }, { status: 409 })

  if (action === 'reject') {
    await fetch(`${SUPABASE_URL}/rest/v1/onboarding_invites?id=eq.${invite_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      body: JSON.stringify({
        status: 'rejected', reviewed_by: caller.id, reviewed_at: new Date().toISOString(),
        review_note: review_note || '', submitted_password_temp: null, // wipe immediately
      }),
    })
    return Response.json({ success: true, status: 'rejected' })
  }

  // ---- approve: actually provision the account ----
  const employee_id = `TMC-${Date.now().toString(36).toUpperCase()}`

  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({
      email: invite.submitted_email,
      password: invite.submitted_password_temp,
      email_confirm: true,
      user_metadata: { role: invite.access_level, employee_id, name: invite.submitted_name },
    }),
  })
  if (!createRes.ok) {
    const err = await createRes.json() as any
    return Response.json({ error: err.message || 'Failed to create auth user' }, { status: 400 })
  }
  const newUser = await createRes.json() as any
  const authId = newUser.id

  const empRes = await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'return=representation' },
    body: JSON.stringify({
      auth_user_id: authId, employee_id, name: invite.submitted_name, email: invite.submitted_email,
      department: invite.department, position: invite.position || '', phone: invite.submitted_phone || '',
      address: invite.submitted_address || '', joining_date: invite.submitted_joining_date || new Date().toISOString().split('T')[0],
      status: 'active',
    }),
  })
  if (!empRes.ok) {
    // Roll back the auth user so we don't leave an orphaned login
    await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${authId}`, {
      method: 'DELETE',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    })
    const err = await empRes.json() as any
    return Response.json({ error: err.message || 'Failed to create employee record' }, { status: 400 })
  }

  await fetch(`${SUPABASE_URL}/rest/v1/user_roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ id: authId, role: invite.access_level, employee_id, department: invite.department }),
  })

  // Wipe the temp password immediately — it's now consumed and must not persist.
  await fetch(`${SUPABASE_URL}/rest/v1/onboarding_invites?id=eq.${invite_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({
      status: 'approved', reviewed_by: caller.id, reviewed_at: new Date().toISOString(),
      review_note: review_note || '', submitted_password_temp: null, resulting_employee_id: employee_id,
    }),
  })

  return Response.json({ success: true, status: 'approved', employee_id })
}
