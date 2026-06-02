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
  if (!roles[0] || roles[0].role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as any
  const { email, password, name, department, position, phone, address, joining_date } = body
  // Auto-generate employee_id if not provided
  const employee_id = body.employee_id?.trim() || `TMC-${Date.now().toString(36).toUpperCase()}`
  if (!email || !password || !name || !department || !position)
    return Response.json({ error: 'Missing required fields: email, password, name, department, position' }, { status: 400 })

  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { role: 'employee', employee_id, name } }),
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
    body: JSON.stringify({ auth_user_id: authId, employee_id, name, email, department, position, phone: phone||'', address: address||'', joining_date: joining_date||new Date().toISOString().split('T')[0], status: 'active' }),
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
    body: JSON.stringify({ id: authId, role: 'employee', employee_id }),
  })

  const employee = await empRes.json()
  return Response.json({ success: true, employee }, { status: 201 })
}
