// Public endpoint — called by the employee filling out the onboarding form.
// No auth required (they don't have an account yet), but the token itself
// acts as the secret/capability that scopes what they can do.
export async function onRequestPost(context: any) {
  const { request, env } = context
  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY

  const body = await request.json() as any
  const { token, name, email, password, phone, address, joining_date } = body

  if (!token || !name || !email || !password)
    return Response.json({ error: 'Token, name, email and password are required' }, { status: 400 })
  if (password.length < 8)
    return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

  // Look up the invite by token (service role, so we can also check status/expiry safely)
  const inviteRes = await fetch(
    `${SUPABASE_URL}/rest/v1/onboarding_invites?token=eq.${encodeURIComponent(token)}&select=*`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  )
  const invites = await inviteRes.json() as any[]
  const invite = invites[0]

  if (!invite) return Response.json({ error: 'Invalid invite link' }, { status: 404 })
  if (invite.status !== 'open') return Response.json({ error: 'This invite has already been used or is no longer open' }, { status: 409 })
  if (new Date(invite.expires_at) < new Date()) return Response.json({ error: 'This invite link has expired' }, { status: 410 })

  // Check email isn't already a registered user
  const existingRes = await fetch(`${SUPABASE_URL}/rest/v1/employees?email=eq.${encodeURIComponent(email)}&select=id`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  })
  const existing = await existingRes.json() as any[]
  if (existing.length) return Response.json({ error: 'An employee with this email already exists' }, { status: 409 })

  const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/onboarding_invites?id=eq.${invite.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'return=representation' },
    body: JSON.stringify({
      status: 'submitted',
      submitted_name: name,
      submitted_email: email,
      submitted_password_temp: password, // held only until approval, then wiped — see onboard-approve.ts
      submitted_phone: phone || '',
      submitted_address: address || '',
      submitted_joining_date: joining_date || new Date().toISOString().split('T')[0],
      submitted_at: new Date().toISOString(),
    }),
  })
  if (!updateRes.ok) {
    const err = await updateRes.json() as any
    return Response.json({ error: err.message || 'Failed to submit' }, { status: 400 })
  }

  return Response.json({ success: true })
}
