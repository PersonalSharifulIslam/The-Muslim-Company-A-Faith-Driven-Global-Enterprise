// Public endpoint — fetches just enough metadata to render the onboarding
// form (department/position/access_level label/status/expiry). Deliberately
// never returns submitted_password_temp or other applicants' data.
export async function onRequestGet(context: any) {
  const { request, env } = context
  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY

  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 })

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/onboarding_invites?token=eq.${encodeURIComponent(token)}&select=department,position,access_level,status,expires_at`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  )
  const rows = await res.json() as any[]
  const invite = rows[0]
  if (!invite) return Response.json({ error: 'Invalid invite link' }, { status: 404 })

  const expired = new Date(invite.expires_at) < new Date()
  return Response.json({
    department: invite.department,
    position: invite.position,
    access_level: invite.access_level,
    status: expired && invite.status === 'open' ? 'expired' : invite.status,
  })
}
